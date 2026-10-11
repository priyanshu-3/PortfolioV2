import { ScrollSection } from "@/components/ScrollSection";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { Contours, Star } from "@/components/poster/marks";

/** A dark band the colour of the hero's field, inviting a project or a call. */
export function CallToActionSection() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#3a2b27" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <ScrollSection className="relative overflow-hidden bg-field px-6 py-28 text-cream md:py-36">
      <Contours lines={18} className="text-cream opacity-[0.07]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Star className="mx-auto mb-10 h-10 w-16 text-poppy md:h-12 md:w-20" />
        <p className="mb-6 font-label text-[9px] font-bold uppercase tracking-[0.24em] text-cream/70 md:text-[10px]">
          An open invitation
        </p>
        <h2 className="mb-8 font-display text-4xl font-medium uppercase leading-[1.02] tracking-[0.02em] md:text-7xl">
          <span className="mr-[0.03em] font-script text-[1.3em] font-normal normal-case leading-[0.7]">B</span>ook your free session,{" "}
          <br className="hidden md:block" />
          power up your project's future
        </h2>

        <p className="mx-auto mb-12 max-w-3xl font-display text-xl italic text-cream/75 md:text-2xl">
          I bring big ideas to life with clear, sharp, meaningful design and craft them with expert, purposeful development.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            to="/#contact"
            className="bg-poppy px-8 py-4 font-label text-[11px] font-bold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-cream hover:text-field"
          >
            Start a project ↘
          </Link>

          <button
            data-cal-link="priyanshu_3"
            data-cal-config='{"layout":"month_view"}'
            className="cursor-pointer border border-cream/60 px-8 py-4 font-label text-[11px] font-bold uppercase tracking-[0.2em] text-cream transition-colors hover:border-cream hover:bg-cream hover:text-field"
          >
            Schedule a call ↗
          </button>
        </div>
      </div>
    </ScrollSection>
  );
}
