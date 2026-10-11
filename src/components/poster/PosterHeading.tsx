import { Spark } from "./marks";

/**
 * A section heading set like the hero's masthead: a numbered label row over a
 * rule, then the title in Bodoni caps with its first letter in the swash script.
 */
export function PosterHeading({
  number,
  label,
  title,
  intro,
  className = "",
}: {
  number: string;
  label: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <header className={`relative mb-14 md:mb-20 ${className}`}>
      <div className="flex items-center justify-between border-b border-current pb-3 font-label text-[9px] uppercase tracking-[0.2em] md:text-[10px]">
        <span>No. {number}</span>
        <span className="flex items-center gap-2">
          <Spark className="h-2.5 w-2.5" />
          {label}
        </span>
      </div>
      <h2 className="mt-8 font-display text-[2.6rem] font-medium uppercase leading-[0.95] tracking-[0.02em] sm:text-6xl md:text-7xl lg:text-8xl">
        <span className="mr-[0.04em] font-script text-[1.32em] font-normal normal-case leading-[0.7]">{title[0]}</span>
        {title.slice(1)}
      </h2>
      {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-75 md:text-xl">{intro}</p>}
    </header>
  );
}
