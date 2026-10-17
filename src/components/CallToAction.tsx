import { ScrollSection } from "@/components/ScrollSection";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { PixelField } from "@/components/theme/marks";

/** An inverted band (dark on the light theme, light on the dark), with pixels rising from below. */
export function CallToActionSection() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#facc15" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <ScrollSection className="relative overflow-hidden bg-ink px-6 py-28 text-canvas md:py-36">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72"
        style={{
          maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
        }}
      >
        <PixelField on="ink" className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="mb-8 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-canvas/50">
          <span>Open invitation</span>
          <span className="h-px w-8 bg-canvas/30" />
          <span>Free session</span>
        </p>
        <h2 className="mb-8 text-4xl font-black leading-[0.95] tracking-tight md:text-7xl">
          Book your free session.{" "}
          <span className="text-yellow-400 dark:text-yellow-500">Power up your project.</span>
        </h2>

        <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-canvas/60 md:text-lg">
          I bring big ideas to life with clear, sharp, meaningful design and craft them with expert, purposeful development.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/#contact"
            className="border-2 border-yellow-400 bg-yellow-400 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:border-yellow-300 hover:bg-yellow-300"
          >
            Start a Project
          </Link>

          <button
            data-cal-link="priyanshu_3"
            data-cal-config='{"layout":"month_view"}'
            className="cursor-pointer border-2 border-canvas/25 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-canvas/70 transition-colors hover:border-canvas/60 hover:text-canvas"
          >
            Schedule a Call
          </button>
        </div>
      </div>
    </ScrollSection>
  );
}
