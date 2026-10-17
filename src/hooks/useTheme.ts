import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

const KEY = "theme";
const listeners = new Set<() => void>();

// index.html sets the class before the first paint, so the page never flashes light
const read = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#ffffff");
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private mode or blocked storage: the theme still applies for this visit
  }
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** The current theme, re-rendering whenever it changes. */
export function useTheme() {
  return useSyncExternalStore(subscribe, read, () => "light" as Theme);
}

let switching = false;

/**
 * Switches theme. Where the browser supports view transitions, the new theme
 * grows out of the given point (the toggle) in a circle; elsewhere the colours
 * fade across. Nothing on the page is rebuilt for the switch (even the pixel
 * fields just flip by CSS), so the reveal starts at once and stays smooth.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  // A second click mid-switch would restart the reveal from scratch; let the first one finish
  if (switching) return;
  switching = true;

  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & {
    startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
  };

  if (!doc.startViewTransition || reduced || !origin) {
    // No view transitions: fade every colour across instead of jumping
    root.classList.add(reduced ? "theme-switching" : "theme-fading");
    apply(theme);
    window.setTimeout(() => {
      root.classList.remove("theme-switching", "theme-fading");
      switching = false;
    }, reduced ? 0 : 400);
    return;
  }

  // During the reveal, elements' own colour fades would lag behind it, so they're paused
  root.classList.add("theme-switching");
  const done = () => {
    root.classList.remove("theme-switching");
    switching = false;
  };

  const transition = doc.startViewTransition(() => {
    // Only the toggles re-render; flushSync gets them into the new snapshot
    flushSync(() => apply(theme));
  });
  transition.finished.then(done, done);
  // Never leave hover fades switched off for long, even if the transition stalls
  window.setTimeout(done, 1500);

  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    })
    // A very slow device can time the transition out; the theme has still switched, just without the circle
    .catch(() => {});
}
