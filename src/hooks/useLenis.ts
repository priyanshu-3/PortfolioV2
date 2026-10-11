import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;

/** Smooth, inertial page scrolling, so the story's camera glides instead of jumping. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      // Let the Cal.com booking modal scroll natively
      prevent: (node) => !!node.closest?.("cal-modal-box, [data-lenis-prevent]"),
    });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled]);
}

/** Scroll to an element through Lenis when it's running, so both stay in sync. */
export function smoothScrollTo(target: HTMLElement | number, immediate = false) {
  if (lenis) {
    const instance = lenis;
    instance.scrollTo(target, {
      immediate,
      duration: 1.4,
      // Content above the target can grow while we scroll past it (e.g. the GitHub
      // skyline rising into 3D), so check where the target ended up and correct once.
      onComplete: () => {
        if (typeof target === "number") return;
        // The page may also have got longer, so refresh Lenis's cached scroll limit first
        instance.resize();
        const offset = target.getBoundingClientRect().top;
        const atBottom = window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2;
        if (Math.abs(offset) > 4 && !atBottom) instance.scrollTo(target, { duration: 0.6 });
      },
    });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
  } else {
    target.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
  }
}
