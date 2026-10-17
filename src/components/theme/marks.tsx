import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Baby, Bot, Briefcase, GraduationCap, Laptop, RadioTower, ScanSearch, School, Send, Trophy, type LucideIcon } from "lucide-react";
import type { MilestoneKind } from "@/data/story";
import PixelBackground from "@/components/ui/hero-with-pixelbackground-utils/pixel-background";

/** A small yellow square, the theme's bullet. */
export function Mark({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`inline-block size-1.5 shrink-0 bg-yellow-400 ${className}`} />;
}

/** The small uppercase label line above headings: "02 —— Skills". */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-dim ${className}`}>{children}</p>
  );
}

/** The icon for each moment of the story. */
export const MILESTONE_ICONS: Record<MilestoneKind, LucideIcon> = {
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

/** A yellow tile with a milestone's icon, like the logo square. `size` is its width in px. */
export function IconTile({ kind, size = 36, className = "", style }: { kind: MilestoneKind; size?: number; className?: string; style?: CSSProperties }) {
  const Icon = MILESTONE_ICONS[kind];
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center bg-yellow-400 text-zinc-900 ${className}`}
      style={{ width: size, height: size, borderRadius: size * 0.22, ...style }}
    >
      <Icon style={{ width: size * 0.48, height: size * 0.48 }} strokeWidth={1.8} />
    </span>
  );
}

/** Re-mounts its pixels after the window stops resizing, since the canvas is sized once. */
function useResizeKey() {
  const [key, setKey] = useState(0);
  useEffect(() => {
    let timer = 0;
    let width = window.innerWidth;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (window.innerWidth === width) return;
        width = window.innerWidth;
        setKey((k) => k + 1);
      }, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
    };
  }, []);
  return key;
}

/**
 * The shimmering pixel field. `on` says what it sits on: the page ("canvas") or
 * the inverted band ("ink"). There is one set of light-grey pixels, and dark
 * grounds get them inverted by CSS, so switching theme never rebuilds or
 * replays them. The canvas only runs while it's near the screen.
 */
export function PixelField({ on = "canvas", className = "" }: { on?: "canvas" | "ink"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const resizeKey = useResizeKey();
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The page is light in the light theme; the band is the opposite
  const tone = on === "canvas" ? "opacity-70 dark:opacity-100 dark:invert" : "invert dark:opacity-70 dark:invert-0";

  return (
    <div ref={ref} className={`${className} ${tone}`}>
      {near && (
        <PixelBackground
          key={resizeKey}
          gap={6}
          speed={60}
          colors="#d4d4d4,#e5e5e5,#c4c4c4,#bababa"
          opacity={1}
          direction="top"
          className="h-full w-full"
        />
      )}
    </div>
  );
}
