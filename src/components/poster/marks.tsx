/** Small printed marks borrowed from the hero poster, for the rest of the page. */

/** The concave four-point star. */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 120" className={className} fill="currentColor">
      <path d="M100 0 Q105 55 200 60 Q105 65 100 120 Q95 65 0 60 Q95 55 100 0 Z" />
    </svg>
  );
}

/** The little sparkle that sits beside the title. */
export function Spark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={className} fill="currentColor">
      <path d="M10 0 Q11 9 20 10 Q11 11 10 20 Q9 11 0 10 Q9 9 10 0 Z" />
    </svg>
  );
}

/** The masthead's slow contour lines, as a static backdrop. */
export function Contours({ lines = 14, className = "" }: { lines?: number; className?: string }) {
  const W = 1200;
  const H = 600;
  const gap = H / lines;
  const paths = Array.from({ length: lines }, (_, i) => {
    const base = (i + 0.5) * gap;
    let d = "";
    for (let k = 0; k <= 80; k++) {
      const x = (k / 80) * W;
      const y = base + 2.4 * Math.sin(x * 0.011 + i * 0.37) + 1.6 * Math.sin(x * 0.027 - i * 0.21);
      d += (k ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    return d;
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {paths.map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}

/** The hollow square the poster puts before each word. */
export function Mark({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`inline-block h-[0.62em] w-[0.62em] shrink-0 border border-current ${className}`} />;
}

/** A poppy seen from above: five red petals around a dark heart. */
export function Poppy({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className} style={style}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="50"
          cy="29"
          rx="23"
          ry="27"
          transform={`rotate(${a} 50 50)`}
          fill="rgb(var(--poppy))"
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="1"
        />
      ))}
      <circle cx="50" cy="50" r="12" fill="#1a0f0d" />
      <circle cx="50" cy="50" r="5" fill="#6d7a50" />
    </svg>
  );
}
