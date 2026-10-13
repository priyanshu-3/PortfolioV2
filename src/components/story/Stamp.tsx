import { useId } from "react";
import { Baby, Bot, Briefcase, GraduationCap, Laptop, RadioTower, ScanSearch, School, Send, Trophy, type LucideIcon } from "lucide-react";
import type { MilestoneKind } from "@/data/story";

/** The icon on each chapter's stamp. */
export const STAMP_ICONS: Record<MilestoneKind, LucideIcon> = {
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

/** A postage stamp with perforated edges and a milestone's icon. `size` is its width in px. */
export function Stamp({ kind, size = 44, className = "" }: { kind: MilestoneKind; size?: number; className?: string }) {
  const Icon = STAMP_ICONS[kind];
  const mask = "stamp" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const W = 44;
  const H = 52;
  const holes: [number, number][] = [];
  for (let x = 3; x <= W - 3; x += 5.5) holes.push([x, 0], [x, H]);
  for (let y = 3; y <= H - 3; y += 5.5) holes.push([0, y], [W, y]);

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: (size * H) / W }} aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
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
      <Icon className="absolute inset-0 m-auto text-cream" style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={1.6} />
    </div>
  );
}
