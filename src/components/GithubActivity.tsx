import ContributionSkyline from "@/components/ui/contribution-skyline";
import { useGithubContributions } from "@/hooks/useGithubContributions";
import { Eyebrow } from "@/components/theme/marks";

const USERNAME = "priyanshu-3";
const PROFILE = `https://github.com/${USERNAME}`;

// The theme's yellow, from pale to deep; at night, from dim to bright
const YELLOW_SCALE = {
  light: ["#fef9c3", "#fde047", "#eab308", "#a16207"],
  dark: ["#3f3a12", "#854d0e", "#eab308", "#fde047"],
};

/** Live GitHub contribution skyline; never falls back to the component's made-up sample year. */
export function GithubActivity() {
  const contributions = useGithubContributions(USERNAME);

  return (
    <div className="mx-auto max-w-5xl text-ink">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <Eyebrow className="mb-3">
            <span>GitHub activity</span>
          </Eyebrow>
          <h3 className="text-3xl font-black tracking-tight md:text-4xl">
            A year of <span className="text-hi">commits</span>
          </h3>
        </div>
        <a
          href={PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-line px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-dim transition-colors hover:border-ink/50 hover:text-ink"
        >
          @{USERNAME} ↗
        </a>
      </div>

      {contributions.status === "ready" && <ContributionSkyline data={contributions.days} palette={YELLOW_SCALE} className="!border-line" />}

      {contributions.status === "loading" && (
        <div className="h-72 animate-pulse rounded-xl border border-line bg-surface" aria-label="Loading GitHub activity" />
      )}

      {contributions.status === "error" && (
        <div className="rounded-xl border border-line p-8 text-center text-dim">
          Couldn&apos;t load my contribution graph right now.{" "}
          <a href={PROFILE} target="_blank" rel="noopener noreferrer" className="font-semibold text-hi underline-offset-4 hover:underline">
            See it on GitHub
          </a>
          .
        </div>
      )}
    </div>
  );
}
