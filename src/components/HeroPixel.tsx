/**
 * The hero, adapted from ScrollX UI's "Hero with Pixel Background": a navbar,
 * a pixel field shimmering in from the top, a heavy two-line name and a yellow
 * timeline ribbon you can drag to resize.
 */
import { useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FileDown } from "lucide-react";
import { Timeline, TimelineText } from "@/components/ui/hero-with-pixelbackground-utils/timeline";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PixelField } from "@/components/theme/marks";
import { sections } from "@/data/sections";

const ease = [0.22, 1, 0.36, 1] as const;

const socials = [
  { label: "GitHub", href: "https://github.com/priyanshu-3" },
  { label: "LeetCode", href: "https://leetcode.com/oiee" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/priyanshu-mehra-060070245/" },
  { label: "Instagram", href: "https://www.instagram.com/priyanshu_3/" },
];

// Every line of the headline shares one size, so the ribbon reads as the third line
const headline = "text-[2rem] font-black leading-none tracking-tight sm:text-5xl md:text-7xl xl:text-9xl";

function Navbar() {
  return (
    <nav className="border-y border-line">
      {/* The links are centred on the full width; the buttons are pinned to the right edge */}
      <div className="relative flex w-full items-center justify-center px-4 py-4 sm:px-6 md:py-5">
        {/* Phones: the résumé as an icon on the left, balancing the theme button on the right */}
        <a
          href="/Resume Mehra Priyanshu.pdf"
          download="Resume_Mehra_Priyanshu.pdf"
          aria-label="Download résumé"
          title="Download résumé"
          className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg bg-ink text-canvas transition-colors hover:bg-ink/80 sm:hidden"
        >
          <FileDown className="size-5" strokeWidth={1.8} />
        </a>
        <ul className="flex items-center justify-center gap-3.5 min-[380px]:gap-4 sm:gap-8 md:gap-10">
          {sections.slice(1).map((section) => (
            <li key={section.href}>
              <Link
                to={section.href}
                className="text-[14px] font-semibold text-dim transition-colors hover:text-ink min-[380px]:text-[15px] sm:text-base md:text-lg"
              >
                {section.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3 sm:right-6">
          <ThemeToggle large />
          {/* Phones get the icon on the left instead */}
          <a
            href="/Resume Mehra Priyanshu.pdf"
            download="Resume_Mehra_Priyanshu.pdf"
            className="hidden rounded-lg bg-ink px-5 py-2.5 text-base font-semibold text-canvas transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink/80 sm:inline-block"
          >
            Résumé
          </a>
        </div>
      </div>
    </nav>
  );
}

export function HeroPixel() {
  // The ribbons measure their text when they mount, which can be before Inter has
  // loaded; a resize event makes every ribbon measure again once it has.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => !cancelled && window.dispatchEvent(new Event("resize")));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-canvas">
      {/* Pixels shimmer in from the top and fade out down the page */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      >
        <PixelField className="h-full w-full" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <Navbar />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-8 flex items-center gap-2"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-dim">Bengaluru</span>
            <span className="h-px w-8 bg-line" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-dim">Software Engineer</span>
          </motion.div>

          <div className="flex flex-col items-center gap-1 text-center text-ink">
            <h1 className="flex flex-col items-center gap-1">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className={headline}
            >
              Priyanshu
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease }}
              className={headline}
            >
              Mehra
            </motion.span>
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.44, ease }}
              className="mt-2"
            >
              <Timeline
                rotation={-1.2}
                initialLeft={0}
                minWidth={56}
                containerClassName="bg-canvas"
                handleClassName="bg-canvas border-yellow-400"
                handleIndicatorClassName="bg-yellow-400"
              >
                <TimelineText className={`${headline} py-3 text-hi`}>Builds Software</TimelineText>
              </Timeline>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="mt-12 max-w-md text-center text-sm leading-relaxed text-dim md:text-base"
          >
            From a first line of code at VTU to production software at Tecnotree: full-stack web apps, Android apps and AI
            tools, built with care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/#contact"
              className="border-2 border-yellow-400 bg-yellow-400 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors duration-300 hover:border-yellow-300 hover:bg-yellow-300"
            >
              Start a Project
            </Link>
            <Link
              to="/#projects"
              className="border-2 border-line px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-dim transition-colors duration-300 hover:border-ink/50 hover:text-ink"
            >
              View Work
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold uppercase tracking-[0.2em] text-dim transition-colors hover:text-ink"
                >
                  {social.label} ↗
                </a>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-line to-transparent" />
    </section>
  );
}
