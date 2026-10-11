import { useNavigate } from "react-router-dom";
import ComebackPoster, { type PosterLink } from "@/components/ui/comeback-poster";
import { sections } from "@/data/sections";
import { useTheme } from "@/hooks/useTheme";

const external = { target: "_blank", rel: "noopener noreferrer" };

// The masthead's three rows, laid out like the poster's 6 / 4 / 2 words
const links: PosterLink[] = [
  // sections of the page, and the résumé
  ...sections,
  { label: "Résumé", href: "/Resume Mehra Priyanshu.pdf", download: "Resume_Mehra_Priyanshu.pdf" },
  // profiles
  { label: "GitHub", href: "https://github.com/priyanshu-3", ...external },
  { label: "LeetCode", href: "https://leetcode.com/oiee", ...external },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/priyanshu-mehra-060070245/", ...external },
  { label: "Instagram", href: "https://www.instagram.com/priyanshu_3/", ...external },
  // ways to get in touch; the call opens the same Cal.com booking as the call-to-action band
  { label: "Start a project", href: "/#contact" },
  { label: "Book a call", "data-cal-link": "priyanshu_3", "data-cal-config": '{"layout":"month_view"}' },
];

const footNote =
  "From a first line of code at VTU in 2022 to production software at Tecnotree, with competition prizes, an AI skin-cancer detector, " +
  "an infant-care app and a multi-agent dev pipeline along the way. Scroll down for the whole story.";

// The same poster at night: a dark masthead with cream type, and a dusk sky over the field
const NIGHT = {
  paper: "#1b1714",
  ink: "#ebe5da",
  haze: "#3f4347",
  field: "#1b2117",
};

/**
 * The hero, set as a printed poster: name and links on the masthead, a field
 * of poppies below.
 */
export function HeroPoster() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <ComebackPoster
      title="Priyanshu Mehra"
      nav={links}
      onNavigate={(href) => navigate(href)}
      topNote={null}
      corners={false}
      footNote={footNote}
      height="max(100svh, 620px)"
      palette={theme === "dark" ? NIGHT : undefined}
      // Phones: keep the corner clear for the fixed theme toggle
      topRight={<span aria-hidden className="block h-9 w-9 sm:hidden" />}
    />
  );
}
