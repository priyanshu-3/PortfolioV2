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
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#14110f" : "#eae8e2");
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

/**
 * Switches theme. Where the browser supports view transitions, the new theme
 * grows out of the given point (the toggle) in a circle; otherwise it just swaps.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & {
    startViewTransition?: (update: () => Promise<void>) => { ready: Promise<void>; finished: Promise<void> };
  };
  // Elements' own colour fades would lag behind the swap, so they're paused while it happens
  root.classList.add("theme-switching");
  const done = () => root.classList.remove("theme-switching");

  if (!doc.startViewTransition || reduced || !origin) {
    apply(theme);
    requestAnimationFrame(() => requestAnimationFrame(done));
    return;
  }

  const transition = doc.startViewTransition(async () => {
    // Render React (the poster and 3D palettes) before the new page is captured
    flushSync(() => apply(theme));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

  transition.finished.then(done, done);
  // Never leave hover fades switched off for long, even if the transition stalls
  window.setTimeout(done, 1500);

  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    })
    // A very slow device can time the transition out; the theme has still switched, just without the circle
    .catch(() => {});
}
