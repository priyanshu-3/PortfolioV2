import { useEffect, useState } from "react";
import type { ContributionDay } from "@/components/ui/contribution-skyline";

// Free public proxy for GitHub's contribution calendar (no token needed, CORS enabled)
const API = "https://github-contributions-api.jogruber.de/v4/";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; days: ContributionDay[] };

/** The last year of a user's public GitHub contributions, one entry per day. */
export function useGithubContributions(username: string) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API}${encodeURIComponent(username)}?y=last`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub contributions request failed: ${response.status}`);
        return response.json() as Promise<{ contributions: ContributionDay[] }>;
      })
      .then(({ contributions }) => {
        setState({ status: "ready", days: contributions.map(({ date, count }) => ({ date, count })) });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error(error);
        setState({ status: "error" });
      });
    return () => controller.abort();
  }, [username]);

  return state;
}
