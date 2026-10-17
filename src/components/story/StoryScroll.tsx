/**
 * The story, told as a scroll-driven book: a title page, chapters in a narrow
 * column, and a "DEEP END" spread that splits open as you scroll, pinning the
 * page while the next chapters rise out of it.
 *
 * Scroll mechanics adapted from "Alice Scroll Story" by Kedhareswer Naidu
 * (21st.dev, MIT): the pinned split-header reveal and the rising content.
 */
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { milestones, type Milestone } from "@/data/story";
import { Eyebrow, IconTile, Mark, PixelField } from "@/components/theme/marks";
import { Timeline, TimelineText } from "@/components/ui/hero-with-pixelbackground-utils/timeline";

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
      <div className="mb-5 flex items-center justify-between gap-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">
          <span>Chapter {pad(number)}</span>
          <span aria-hidden className="h-px w-5 bg-current opacity-50" />
          <span>{milestone.category}</span>
          <span aria-hidden className="h-px w-5 bg-current opacity-50" />
          <span>{milestone.period}</span>
        </p>
        <IconTile kind={milestone.kind} size={34} className="rotate-[4deg]" />
      </div>

      <h3 className="text-[2rem] font-black leading-[1.05] tracking-tight md:text-[2.6rem]">{milestone.title}</h3>
      <p className="mt-2 text-sm font-medium opacity-60 md:text-base">{milestone.subtitle}</p>
      <p className="mt-6 text-[17px] leading-[1.75] opacity-85 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-[3.4rem] first-letter:font-black first-letter:leading-[0.8] first-letter:text-hi">
        {milestone.text}
      </p>

      {milestone.tags && (
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-75">
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
          className="mt-5 inline-block text-xs font-bold uppercase tracking-[0.2em] underline-offset-4 transition-colors hover:text-hi hover:underline"
        >
          View on GitHub ↗
        </a>
      )}

      {isLast && (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/#contact"
            className="border-2 border-yellow-400 bg-yellow-400 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:border-yellow-300 hover:bg-yellow-300"
          >
            Start a Project
          </Link>
          <a
            href="/Resume Mehra Priyanshu.pdf"
            download="Resume_Mehra_Priyanshu.pdf"
            className="border-2 border-line px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-dim transition-colors hover:border-ink/50 hover:text-ink"
          >
            Résumé ↓
          </a>
        </div>
      )}
    </article>
  );
}

/** A part of the story on the plain page, in a narrow reading column. */
function Act({ label, children, after = false }: { label: string; children: ReactNode; after?: boolean }) {
  return (
    <div className={`relative z-[1] flex justify-center bg-canvas text-ink ${after ? "py-24 md:py-32" : "pb-24 md:pb-32"}`}>
      <div className="w-full max-w-[36rem] px-5">
        <Eyebrow className="mb-14 border-b border-line pb-4">
          <Mark />
          {label}
        </Eyebrow>
        {children}
      </div>
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
    <section id="story" ref={root} className="relative overflow-x-clip bg-canvas text-ink" aria-label="My story">
      {/* Title page */}
      <div className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
          style={{
            maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          }}
        >
          <PixelField className="h-full w-full" />
        </div>

        <Eyebrow className="relative mb-8">
          <span>01</span>
          <span className="h-px w-8 bg-line" />
          <span>The story so far</span>
        </Eyebrow>
        <h2 className="relative text-[2.4rem] font-black leading-none tracking-tight sm:text-6xl md:text-8xl">From First Code</h2>
        <div className="relative mt-2">
          <Timeline
            rotation={-1.2}
            initialLeft={0}
            minWidth={56}
            containerClassName="bg-canvas"
            handleClassName="bg-canvas border-yellow-400"
            handleIndicatorClassName="bg-yellow-400"
          >
            <TimelineText className="py-2 text-[2.4rem] font-black leading-none tracking-tight text-hi sm:text-6xl md:text-8xl">
              To Production
            </TimelineText>
          </Timeline>
        </div>
        <p className="relative mt-10 text-sm text-dim md:text-base">Ten chapters, 2019 to today. Scroll on.</p>
      </div>

      <Act label="Part I · The beginning">
        {ACT_ONE.map((m) => (
          <Chapter key={m.id} milestone={m} number={milestones.indexOf(m) + 1} />
        ))}
      </Act>

      {/* The deep end: a full-page spread that splits open onto the inverted page */}
      <div data-reveal className="relative min-h-screen bg-ink text-canvas motion-reduce:pb-24">
        <header
          data-reveal-header
          className="relative z-[1] flex min-h-screen items-center justify-center bg-canvas text-ink will-change-transform motion-reduce:min-h-[60vh]"
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
                <p className="whitespace-nowrap text-[clamp(3.2rem,14vw,15rem)] font-black uppercase leading-none tracking-tighter">
                  Deep <span className="text-hi">End</span>
                </p>
              </div>
            ))}
          </div>
        </header>

        <div data-reveal-content className="relative flex justify-center -mt-[60vh] motion-reduce:mt-0">
          <div className="relative w-full max-w-[36rem] px-5">
            <div className="relative pb-32">
              <Eyebrow className="mb-14 border-b border-canvas/20 pb-4 !text-canvas/60">
                <Mark />
                Part II · The deep end
              </Eyebrow>
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
