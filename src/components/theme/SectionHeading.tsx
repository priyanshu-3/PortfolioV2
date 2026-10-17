import { Eyebrow } from "./marks";

/**
 * A section heading in the theme: a numbered label line, then a heavy title,
 * with an optional last part picked out in yellow.
 */
export function SectionHeading({
  number,
  label,
  title,
  highlight,
  intro,
  className = "",
}: {
  number: string;
  label: string;
  title: string;
  highlight?: string;
  intro?: string;
  className?: string;
}) {
  return (
    <header className={`mb-14 md:mb-20 ${className}`}>
      <Eyebrow className="mb-6">
        <span>{number}</span>
        <span className="h-px w-8 bg-line" />
        <span>{label}</span>
      </Eyebrow>
      <h2 className="text-5xl font-black leading-[0.95] tracking-tight text-ink md:text-7xl">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-hi">{highlight}</span>
          </>
        )}
      </h2>
      {intro && <p className="mt-6 max-w-xl text-base leading-relaxed text-dim md:text-lg">{intro}</p>}
    </header>
  );
}
