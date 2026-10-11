import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/hooks/useTheme";

/** A small round button, fixed in the top-right corner, that flips between the light and dark poster. */
export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      onClick={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        setTheme(next, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
      }}
      className="fixed right-3 top-3 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-ink bg-paper/90 text-ink shadow-[0_6px_18px_-8px_rgba(0,0,0,0.45)] backdrop-blur transition-colors hover:bg-ink hover:text-paper md:right-5 md:top-5"
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.6} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={1.6} />}
    </button>
  );
}
