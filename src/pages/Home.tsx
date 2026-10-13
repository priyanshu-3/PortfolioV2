import { HeroPoster } from "@/components/HeroPoster";
import { StoryScroll } from "@/components/story/StoryScroll";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactForm } from "@/components/ui/contact-sections";
import { CallToActionSection } from "@/components/CallToAction";
import { Mark } from "@/components/poster/marks";
import { sections } from "@/data/sections";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero: a printed poster over a field of poppies */}
      <HeroPoster />

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

      {/* Footer: the section links live here too, since the top bar is gone */}
      <footer className="border-t border-ink px-4 py-12 text-ink sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
          <p className="font-display text-2xl font-medium uppercase tracking-[0.02em]">
            <span className="mr-[0.03em] font-script text-[1.3em] font-normal leading-[0.7]">P</span>riyanshu Mehra
          </p>
          <nav aria-label="Sections" className="flex flex-wrap justify-center gap-x-6 gap-y-3 font-label text-[9px] font-bold uppercase tracking-[0.18em] md:text-[10px]">
            {sections.map((section) => (
              <Link key={section.href} to={section.href} className="flex items-center gap-2 underline-offset-4 hover:text-poppy hover:underline">
                <Mark />
                {section.label}
              </Link>
            ))}
          </nav>
          <p className="font-label text-[9px] uppercase tracking-[0.18em] text-ink/70">© {new Date().getFullYear()} Priyanshu Mehra</p>
        </div>
      </footer>
    </div>
  );
}
