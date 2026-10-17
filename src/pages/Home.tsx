import { HeroPixel } from "@/components/HeroPixel";
import { StoryScroll } from "@/components/story/StoryScroll";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactForm } from "@/components/ui/contact-sections";
import { CallToActionSection } from "@/components/CallToAction";
import { sections } from "@/data/sections";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero: a printed poster over a field of poppies */}
      <HeroPixel />

      {/* The story: education, projects, internship and work, told as a book you scroll through */}
      <StoryScroll />

      <SkillsSection />

      <ProjectsSection />

      {/* Call To Action Section */}
      <CallToActionSection />

      {/* Contact */}
      <section id="contact">
        <ContactForm />
      </section>

      {/* Footer: the logo, the section links and the year */}
      <footer className="border-t border-line px-6 py-10 text-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-6 rounded-md bg-yellow-400" />
            <span className="text-base font-bold">Priyanshu Mehra</span>
          </Link>
          <nav aria-label="Sections" className="flex flex-wrap justify-center gap-x-7 gap-y-3">
            {sections.map((section) => (
              <Link key={section.href} to={section.href} className="text-sm font-medium text-dim transition-colors hover:text-ink">
                {section.label}
              </Link>
            ))}
          </nav>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-dim">© {new Date().getFullYear()} Priyanshu Mehra</p>
        </div>
      </footer>
    </div>
  );
}
