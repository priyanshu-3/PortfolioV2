import ContributionSkyline from "@/components/ui/contribution-skyline";
import { useGithubContributions } from "@/hooks/useGithubContributions";

const USERNAME = "priyanshu-3";
const PROFILE = `https://github.com/${USERNAME}`;

// Paper-pale to deep poppy, matching the hero's field; at night, embers that brighten with activity
const POPPY_SCALE = {
  light: ["#efc4b8", "#e5836d", "#d9301d", "#7d1b10"],
  dark: ["#4a1810", "#8c2416", "#d9301d", "#f2876c"],
};

/** Live GitHub contribution skyline; never falls back to the component's made-up sample year. */
export function GithubActivity() {
  const contributions = useGithubContributions(USERNAME);

  return (
    <div className="mx-auto max-w-5xl text-ink">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4">
        <div>
          <p className="mb-2 font-label text-[9px] font-bold uppercase tracking-[0.2em] md:text-[10px]">GitHub activity</p>
          <h3 className="font-display text-3xl font-medium md:text-4xl">A year of commits</h3>
        </div>
        <a
          href={PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-ink px-4 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-mark"
        >
          @{USERNAME} ↗
        </a>
      </div>

      {contributions.status === "ready" && <ContributionSkyline data={contributions.days} palette={POPPY_SCALE} className="!rounded-none !border-ink !font-display" />}

      {contributions.status === "loading" && (
        <div className="h-72 animate-pulse border border-ink/25 bg-ink/5" aria-label="Loading GitHub activity" />
      )}

      {contributions.status === "error" && (
        <div className="border border-ink/25 p-8 text-center text-ink/70">
          Couldn&apos;t load my contribution graph right now.{" "}
          <a href={PROFILE} target="_blank" rel="noopener noreferrer" className="text-poppy underline-offset-4 hover:underline">
            See it on GitHub
          </a>
          .
        </div>
      )}
    </div>
  );
}
