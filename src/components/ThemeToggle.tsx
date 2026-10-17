import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/hooks/useTheme";

/**
 * Flips between the light and dark theme. Inline, it sits in the hero's navbar;
 * `floating`, it pins to the top-right corner and only appears once you've
 * scrolled past the hero, so the two never sit on top of each other.
 */
export function ThemeToggle({ floating = false, large = false }: { floating?: boolean; large?: boolean }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const [shown, setShown] = useState(!floating);

  useEffect(() => {
    if (!floating) return;
    const update = () => setShown(window.scrollY > window.innerHeight * 0.85);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [floating]);

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      tabIndex={shown ? 0 : -1}
      onClick={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        setTheme(next, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
      }}
      className={`flex ${large ? "size-11" : "size-9"} shrink-0 items-center justify-center rounded-lg border border-line bg-canvas/90 text-ink backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/40 ${
        floating
          ? `fixed right-3 top-3 z-[60] shadow-sm md:right-5 md:top-5 ${shown ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`
          : ""
      }`}
    >
      {theme === "dark" ? (
        <Sun className={large ? "size-5" : "size-[17px]"} strokeWidth={1.8} />
      ) : (
        <Moon className={large ? "size-5" : "size-[17px]"} strokeWidth={1.8} />
      )}
    </button>
  );
}
