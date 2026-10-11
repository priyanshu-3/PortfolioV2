import { Suspense, lazy, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Baby, Bot, Briefcase, GraduationCap, Laptop, RadioTower, ScanSearch, School, Send, Trophy, type LucideIcon } from "lucide-react";
import { milestones, type Milestone, type MilestoneKind } from "@/data/story";
import { smoothScrollTo } from "@/hooks/useLenis";
import { cardSide } from "./layout";
import { Mark } from "@/components/poster/marks";
import { SceneErrorBoundary } from "./SceneErrorBoundary";

// three.js is the heaviest part of the site, so it loads separately from the page text
const loadScene = () => import("./StoryScene");
const StoryScene = lazy(loadScene);

const COUNT = milestones.length;
// Scrolling per milestone, in viewport heights
const STEP_VH = 55;
// How far (in milestones) a card stays visible either side of its moment
const FADE = 0.45;

/** The icon on each postcard's stamp, matching the 3D object at that moment. */
const STAMPS: Record<MilestoneKind, LucideIcon> = {
  books: School,
  laptop: Laptop,
  trophy: Trophy,
  scan: ScanSearch,
  briefcase: Briefcase,
  phone: Baby,
  cap: GraduationCap,
  agents: Bot,
  tower: RadioTower,
  envelope: Send,
};

/** A postage stamp with perforated edges and the moment's icon. */
function Stamp({ kind }: { kind: MilestoneKind }) {
  const Icon = STAMPS[kind];
  const mask = "stamp" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const W = 44;
  const H = 52;
  const holes: [number, number][] = [];
  for (let x = 3; x <= W - 3; x += 5.5) holes.push([x, 0], [x, H]);
  for (let y = 3; y <= H - 3; y += 5.5) holes.push([0, y], [W, y]);

  return (
    <div className="relative h-[52px] w-[44px] shrink-0 rotate-[4deg]" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full drop-shadow-[0_1px_1px_rgba(58,43,39,0.35)]">
        <defs>
          <mask id={mask}>
            <rect width={W} height={H} fill="white" />
            {holes.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={1.8} fill="black" />
            ))}
          </mask>
        </defs>
        <rect width={W} height={H} fill="rgb(var(--paper))" mask={`url(#${mask})`} />
        <rect x={4} y={4} width={W - 8} height={H - 8} fill="rgb(var(--poppy))" />
      </svg>
      <Icon className="absolute inset-0 m-auto h-5 w-5 text-cream" strokeWidth={1.6} />
    </div>
  );
}

function StoryCard({ milestone, index, progress }: { milestone: Milestone; index: number; progress: MotionValue<number> }) {
  const distance = useTransform(progress, (p) => p * (COUNT - 1) - index);
  // Smoothstep fade, so cards ease in and out rather than ramping linearly
  const opacity = useTransform(distance, (d) => {
    const t = Math.max(0, 1 - Math.abs(d) / FADE);
    return t * t * (3 - 2 * t);
  });
  const y = useTransform(distance, (d) => d * -36);
  const rotate = useTransform(distance, (d) => d * 3);
  const pointerEvents = useTransform(distance, (d) => (Math.abs(d) < FADE * 0.6 ? "auto" : "none"));
  const isLast = index === COUNT - 1;

  return (
    <div
      className={`pointer-events-none absolute inset-x-3 bottom-4 flex md:inset-y-0 md:items-center md:pt-16 ${
        cardSide(index) === "left" ? "md:left-[7%] md:right-auto" : "md:left-auto md:right-[7%]"
      }`}
    >
      <motion.article
        style={{ opacity, y, rotate, pointerEvents }}
        className="w-full border border-ink bg-mark p-5 text-ink shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)] will-change-transform md:w-[24rem] md:p-7"
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink/25 pb-3">
          <div className="flex flex-col gap-1">
            <span className="font-label text-[9px] font-bold uppercase tracking-[0.2em]">{milestone.category}</span>
            <span className="font-display text-sm italic tabular-nums text-ink/70">{milestone.period}</span>
          </div>
          <Stamp kind={milestone.kind} />
        </div>

        <h3 className="mt-3 font-display text-xl font-medium leading-tight md:mt-4 md:text-2xl">{milestone.title}</h3>
        {/* On short phone screens the subtitle and tags step aside so the card clears the 3D object */}
        <p className="mt-1 font-display text-sm italic text-ink/60 max-md:[@media(max-height:740px)]:hidden">{milestone.subtitle}</p>
        <p className="mt-3 text-[14px] leading-relaxed text-ink/80 md:mt-4 md:text-[15px]">{milestone.text}</p>

        {(milestone.tags || milestone.github || isLast) && (
          <div className="mt-4 border-t border-ink/25 pt-3 md:mt-5 md:pt-4">
            {milestone.tags && (
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 font-label text-[8px] uppercase tracking-[0.14em] text-ink/75 md:text-[9px] max-md:[@media(max-height:740px)]:hidden">
                {milestone.tags.map((tag) => (
                  <li key={tag} className="flex items-center gap-1.5">
                    <Mark />
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            {milestone.github && (
              <a
                href={milestone.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${milestone.tags ? "mt-3 md:mt-4 max-md:[@media(max-height:740px)]:mt-0" : ""} inline-block font-label text-[10px] font-bold uppercase tracking-[0.18em] underline-offset-4 hover:text-poppy hover:underline`}
              >
                View on GitHub ↗
              </a>
            )}

            {isLast && (
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  to="/#contact"
                  className="bg-ink px-4 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-mark transition-colors hover:bg-poppy"
                >
                  Start a project ↘
                </Link>
                <a
                  href="/Resume Mehra Priyanshu.pdf"
                  download="Resume_Mehra_Priyanshu.pdf"
                  className="font-label text-[10px] font-bold uppercase tracking-[0.18em] underline-offset-4 hover:text-poppy hover:underline"
                >
                  Résumé ↓
                </a>
              </div>
            )}
          </div>
        )}
      </motion.article>
    </div>
  );
}

/**
 * A thin ink rule with a mark per moment; the current one is set in red. Each mark
 * jumps to its moment, and "Skip" leaves the story for the next section.
 */
function ProgressRail({ progress, active, onJump }: { progress: MotionValue<number>; active: number; onJump: (i: number) => void }) {
  const fill = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div className="pointer-events-none absolute left-4 right-16 top-5 z-10 mx-auto max-w-2xl text-ink md:inset-x-4 md:top-10">
      <div className="mb-3 flex items-center justify-between font-label text-[9px] uppercase tracking-[0.2em]">
        <span>No. 01 · The story</span>
        <span className="flex items-center gap-4">
          <span className="tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => {
              const next = document.getElementById("skills");
              if (next) smoothScrollTo(next);
            }}
            className="pointer-events-auto font-bold underline-offset-4 hover:text-poppy hover:underline"
          >
            Skip ↓
          </button>
        </span>
      </div>
      <div className="relative h-px bg-ink/25">
        <motion.div className="absolute inset-y-0 left-0 bg-ink" style={{ width: fill }} />
        {milestones.map((milestone, i) => (
          <button
            key={milestone.id}
            type="button"
            aria-label={`Go to ${milestone.title}`}
            title={milestone.title}
            onClick={() => onJump(i)}
            className="group pointer-events-auto absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${(i / (COUNT - 1)) * 100}%` }}
          >
            <span
              className="h-2 w-2 border transition-all duration-300 group-hover:scale-150"
              style={{
                borderColor: i === active ? "rgb(var(--poppy))" : "rgb(var(--ink))",
                backgroundColor: i === active ? "rgb(var(--poppy))" : i < active ? "rgb(var(--ink))" : "rgb(var(--paper))",
                transform: `rotate(45deg) scale(${i === active ? 1.4 : 1})`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The home page's story: a pinned 3D scene whose camera flies along a path
 * through each moment of the journey as you scroll, with a postcard for each one.
 */
export function StoryTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const nearScreen = useInView(sectionRef, { margin: "300px 0px" });
  // Load the 3D scene a little before the story scrolls into view, not with the hero
  const soon = useInView(sectionRef, { margin: "1200px 0px", once: true });
  const [active, setActive] = useState(0);

  // Fetch the scene's code once the page has settled, so it's ready by the time you arrive
  useEffect(() => {
    const timer = window.setTimeout(() => void loadScene(), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.round(p * (COUNT - 1));
    if (next !== active) setActive(next);
  });

  const jumpTo = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(top + (i / (COUNT - 1)) * (section.offsetHeight - window.innerHeight));
  };

  return (
    // A short scroll per milestone, plus one screen to settle on the last
    <section id="story" ref={sectionRef} className="relative" style={{ height: `${(COUNT - 1) * STEP_VH + 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {soon && (
          <SceneErrorBoundary>
            <Suspense fallback={null}>
              <StoryScene progress={scrollYProgress} active={nearScreen} />
            </Suspense>
          </SceneErrorBoundary>
        )}

        {/* Soft fade at the top and bottom edges into the rest of the page */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

        <ProgressRail progress={scrollYProgress} active={active} onJump={jumpTo} />

        {milestones.map((milestone, i) => (
          <StoryCard key={milestone.id} milestone={milestone} index={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
