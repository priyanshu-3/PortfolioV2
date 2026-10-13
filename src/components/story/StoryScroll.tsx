/**
 * The story, told as a scroll-driven book: a title page, chapters in a narrow
 * column, and a "DEEP END" spread that splits open as you scroll, pinning the
 * page while the next chapters rise out of the dark and poppies, stamps and a
 * star drift past at different speeds.
 *
 * Scroll mechanics adapted from "Alice Scroll Story" by Kedhareswer Naidu
 * (21st.dev, MIT): the pinned split-header reveal, the rising content and the
 * speed-based parallax.
 */
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { milestones, type Milestone } from "@/data/story";
import { Mark, Poppy, Spark, Star } from "@/components/poster/marks";
import { Stamp } from "./Stamp";

gsap.registerPlugin(ScrollTrigger);

// Three acts: the beginning, the deep end (revealed), and where it's going
const ACT_ONE = milestones.slice(0, 3);
const DEEP_END = milestones.slice(3, 8);
const ACT_THREE = milestones.slice(8);

const pad = (n: number) => String(n).padStart(2, "0");

/** The header's clip: whole, then opened from the middle, top half up and bottom half down. */
const CLOSED = "polygon(0 0, 100% 0, 100% 50%, 0 50%, 0 50%, 100% 50%, 100% 100%, 0 100%)";
const OPEN = "polygon(0 0, 100% 0, 100% 0%, 0 0%, 0 100%, 100% 100%, 100% 100%, 0 100%)";

/** One milestone, set as a chapter of the book. */
function Chapter({ milestone, number }: { milestone: Milestone; number: number }) {
  const isLast = number === milestones.length;

  return (
    <article className="mb-16 last:mb-0 md:mb-20">
      <div className="mb-5 flex items-start justify-between gap-6">
        <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 font-label text-[9px] font-bold uppercase tracking-[0.2em] md:text-[10px]">
          <span>Chapter {pad(number)}</span>
          <span aria-hidden className="opacity-50">·</span>
          <span>{milestone.category}</span>
          <span aria-hidden className="opacity-50">·</span>
          <span className="font-display text-sm font-normal normal-case italic tracking-normal opacity-75">{milestone.period}</span>
        </p>
        <Stamp kind={milestone.kind} size={36} className="rotate-[4deg]" />
      </div>

      <h3 className="font-display text-[2rem] font-medium leading-[1.1] md:text-[2.6rem]">{milestone.title}</h3>
      <p className="mt-2 font-display italic opacity-70">{milestone.subtitle}</p>
      <p className="mt-6 text-[17px] leading-[1.75] opacity-90 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-script first-letter:text-[3.6rem] first-letter:leading-[0.8] first-letter:text-poppy">
        {milestone.text}
      </p>

      {milestone.tags && (
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-label text-[9px] font-bold uppercase tracking-[0.14em] opacity-80">
          {milestone.tags.map((tag) => (
            <li key={tag} className="flex items-center gap-2">
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
          className="mt-5 inline-block font-label text-[10px] font-bold uppercase tracking-[0.18em] underline-offset-4 hover:text-poppy hover:underline"
        >
          View on GitHub ↗
        </a>
      )}

      {isLast && (
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            to="/#contact"
            className="bg-ink px-5 py-3.5 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-poppy hover:text-cream"
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
    </article>
  );
}

/** A part of the story on plain paper, in a narrow reading column. */
function Act({ label, children, after = false }: { label: string; children: ReactNode; after?: boolean }) {
  return (
    <div className={`relative z-[1] flex justify-center bg-paper text-ink ${after ? "py-24 md:py-32" : "pb-24 md:pb-32"}`}>
      <div className="w-full max-w-[36rem] px-5">
        <p className="mb-14 flex items-center gap-3 border-b border-ink pb-3 font-label text-[9px] uppercase tracking-[0.2em] md:text-[10px]">
          <Spark className="h-2.5 w-2.5" />
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

/** Something drifting past in the deep end; `speed` is how much faster than the page it moves. */
function Drift({ speed, className, style, children }: { speed: number; className: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div data-speed={speed} className={`absolute ${className}`} style={style}>
      {children}
    </div>
  );
}

export function StoryScroll() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((section) => {
        const header = section.querySelector<HTMLElement>("[data-reveal-header]")!;
        const halves = section.querySelectorAll<HTMLElement>("[data-reveal-half]");
        const content = section.querySelector<HTMLElement>("[data-reveal-content]")!;
        // The spread stays pinned for one screen, just while the words split. (The original
        // pins for the full height of its text, which with five chapters left a long empty,
        // stalled stretch; after the split, the chapters scroll normally.)
        const length = () => "+=" + header.offsetHeight;

        // The first chapter rises into the opening as the halves part
        gsap
          .timeline({ scrollTrigger: { trigger: section, start: "top top", end: length, scrub: true, invalidateOnRefresh: true } })
          .fromTo(content, { y: () => window.innerHeight * 0.45 }, { y: 0, ease: "none" }, 0.15);

        // The header splits open from the middle
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top top", end: length, scrub: true, pin: true, invalidateOnRefresh: true },
        });
        tl.fromTo(header, { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.4, ease: "power4.inOut" });
        if (halves.length === 2) {
          tl.fromTo(halves[0], { y: "0%" }, { y: "-30%", ease: "power3.inOut" }, 0);
          tl.fromTo(halves[1], { y: "0%" }, { y: "30%", ease: "power3.inOut" }, 0);
        }

        // Parallax: each drifting thing rises faster than the page, by its own speed
        section.querySelectorAll<HTMLElement>("[data-speed]").forEach((item) => {
          gsap.to(item, {
            yPercent: (Number(item.dataset.speed) - 1) * 100,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + content.offsetHeight * 3,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });
    }, root);

    // Web fonts change the text's height, so measure again once they've arrived
    let cancelled = false;
    document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <section id="story" ref={root} className="relative overflow-x-clip bg-paper text-ink" aria-label="My story">
      {/* Title page */}
      <div className="flex min-h-[85vh] flex-col items-center justify-center px-5 py-24 text-center">
        <p className="mb-10 font-label text-[9px] uppercase tracking-[0.24em] md:text-[10px]">No. 01 · The story so far</p>
        <h2 className="font-display text-[clamp(2.4rem,7.5vw,6.25rem)] font-medium uppercase leading-[1.05] tracking-[0.02em]">
          <span className="mr-[0.03em] font-script text-[1.3em] font-normal normal-case leading-[0.7]">F</span>rom first code
          <br />
          to production
        </h2>
        <p className="mt-8 font-display text-lg italic opacity-70 md:text-xl">
          Ten chapters, 2019 to today. Scroll on.
        </p>
        <Star className="mt-12 h-6 w-10 text-poppy" />
      </div>

      <Act label="Part I · The beginning">
        {ACT_ONE.map((m) => (
          <Chapter key={m.id} milestone={m} number={milestones.indexOf(m) + 1} />
        ))}
      </Act>

      {/* The deep end: a full-page spread that splits open onto the dark */}
      <div data-reveal className="relative min-h-screen bg-ink text-paper motion-reduce:pb-24">
        <header
          data-reveal-header
          className="relative z-[1] flex min-h-screen items-center justify-center bg-paper text-ink will-change-transform motion-reduce:min-h-[60vh]"
        >
          <div className="relative flex w-full flex-col items-center justify-center">
            {[0, 1].map((half) => (
              <div
                key={half}
                data-reveal-half
                aria-hidden={half === 1}
                className={`flex min-h-screen w-full items-center justify-center motion-reduce:min-h-[60vh] ${
                  half === 0 ? "[clip-path:inset(0_0_calc(50%_-_1px)_0)]" : "absolute left-0 top-0 [clip-path:inset(calc(50%_-_1px)_0_0_0)]"
                }`}
              >
                <p className="whitespace-nowrap font-display text-[clamp(3.4rem,13.5vw,14rem)] font-medium uppercase leading-none tracking-[0.02em]">
                  <span className="mr-[0.02em] font-script text-[1.25em] font-normal normal-case leading-[0.7]">D</span>eep end
                </p>
              </div>
            ))}
          </div>
        </header>

        <div data-reveal-content className="relative flex justify-center -mt-[60vh] motion-reduce:mt-0">
          <div className="relative w-full max-w-[36rem] px-5">
            {/* Things drifting past: rough positions follow the original's layout */}
            <div aria-hidden className="pointer-events-none absolute left-0 top-0 z-0">
              <Drift speed={6} className="-top-[22rem] left-[3rem] h-[11rem] w-[11rem] md:-top-[30rem] md:left-[1rem] md:h-[18rem] md:w-[18rem]">
                <Poppy className="h-full w-full" />
              </Drift>
              <Drift speed={13} className="-left-[3rem] -top-[25rem] md:-left-[6rem]">
                <Stamp kind="scan" size={96} className="-rotate-6" />
              </Drift>
              <Drift speed={15} className="-left-[3rem] -top-[22rem] md:-left-[12rem]">
                <Stamp kind="agents" size={70} className="rotate-12" />
              </Drift>
              <Drift speed={23} className="-top-[19rem] left-[12rem] h-[3.25rem] w-[3.25rem] blur-[2px] md:left-[31rem]">
                <Poppy className="h-full w-full" />
              </Drift>
              <Drift speed={5} className="-top-[20rem] left-[13rem] z-[1] h-[7rem] w-[12rem] blur-[2px] md:-top-[25rem] md:left-[25rem] md:h-[12rem] md:w-[20rem]">
                <Star className="h-full w-full text-poppy" />
              </Drift>
            </div>

            <div className="relative pb-32">
              <p className="mb-14 flex items-center gap-3 border-b border-paper/40 pb-3 font-label text-[9px] uppercase tracking-[0.2em] md:text-[10px]">
                <Spark className="h-2.5 w-2.5" />
                Part II · The deep end
              </p>
              {DEEP_END.map((m) => (
                <Chapter key={m.id} milestone={m} number={milestones.indexOf(m) + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Act label="Part III · Where it's going" after>
        {ACT_THREE.map((m) => (
          <Chapter key={m.id} milestone={m} number={milestones.indexOf(m) + 1} />
        ))}
      </Act>
    </section>
  );
}
