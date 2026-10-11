import { ScrollSection } from "@/components/ScrollSection";
import { motion, type Variants } from "framer-motion";
import { GithubActivity } from "@/components/GithubActivity";
import { PosterHeading } from "@/components/poster/PosterHeading";
import { Mark } from "@/components/poster/marks";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  live?: string;
}

const projects: Project[] = [
  {
    title: "Multi-Agent Software Development Pipeline",
    description:
      "Built an autonomous RAG-based multi-agent system (Planner, Builder, Reviewer) that turns requirements into reviewed PRs. Engineered a Planner agent that decomposes PDF/TXT/MD specs into dependency-ordered GitHub issues with acceptance criteria. Developed Builder and Reviewer agents that write multi-file code into draft PRs and post inline diff reviews with verdicts. Designed a label-driven orchestrator with a 5-round review cap, human escalation, rate-limit backoff and Gemini model fallback.",
    tags: ["Python", "Google Gemini API", "RAG", "GitHub REST API", "PyGitHub", "pdfplumber"],
    github: "https://github.com/priyanshu-3/dev-agent-pipeline",
  },
  {
    title: "Shishu-Sneh (Smart Baby's First Year Guide)",
    description:
      "Engineered an offline-first infant healthcare app utilizing Room DB and Supabase PostgreSQL for local persistence and cloud sync. Developed a Spring Boot backend to automate immunization tracking against the Indian NIS via Android WorkManager notifications. Integrated Google Gemini API to build a dynamic nutrition engine processing real-time user ingredients for localized recipes. Implemented data visualization dashboards using MPAndroidChart to parse health logs and render growth trends.",
    tags: ["Spring Boot", "Android Native", "Room DB", "Supabase", "Gemini API"],
    github: "https://github.com/priyanshu-3/Shishu-Sneh",
  },
  {
    title: "Advanced Skin Cancer Detection System",
    description:
      "Built a full-stack AI web app for skin cancer detection achieving 85-90% test accuracy using ensemble ML models. Designed 10+ Flask REST APIs with SQLAlchemy and a responsive React UI supporting real-time medical image analysis. Implemented XAI, confidence scoring mechanisms, and automated 100% of medical report updates via PDF generation.",
    tags: ["Python", "Flask", "React", "Tailwind CSS", "XGBoost", "Roboflow API", "SQLAlchemy"],
    github: "https://github.com/priyanshu-3/SkinCare",
  },
  {
    title: "Drug Inventory and Supply Chain Tracking System",
    description:
      "Engineered a full-stack supply chain platform enabling end-to-end traceability across 6 roles, improving transparency by 35%. Built real-time inventory monitoring features, reducing system stock-outs by 30% and improving fulfillment speed by 25%. Developed secure role-based access controls and analytics dashboards, increasing operational decision-making efficiency by 40%.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Data Visualization"],
    github: "https://github.com/priyanshu-3/Drug-Inventory",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const buttonClass =
  "inline-flex items-center gap-2 border border-ink px-4 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-mark";

export function ProjectsSection() {
  return (
    <ScrollSection id="projects" className="px-4 py-28 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <PosterHeading
          number="03"
          label="Selected work"
          title="Projects"
          intro="Real projects from my GitHub, spanning AI, full-stack development and Android."
        />

        {/* One ruled row per project */}
        <motion.ol
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="border-t border-ink"
        >
          {projects.map((project, index) => (
            <motion.li
              key={project.title}
              variants={rowVariants}
              className="group grid gap-6 border-b border-ink py-10 md:grid-cols-[7rem_1fr_auto] md:gap-10 md:py-14"
            >
              <span className="font-display text-5xl leading-none text-ink/80 transition-colors group-hover:text-poppy md:text-6xl">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="font-display text-2xl font-medium leading-tight md:text-4xl">{project.title}</h3>
                <p className="mt-4 max-w-3xl leading-relaxed text-ink/75">{project.description}</p>
                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-label text-[9px] font-bold uppercase tracking-[0.14em] md:text-[10px]">
                  {project.tags.map((tag) => (
                    <li key={tag} className="flex items-center gap-2">
                      <Mark />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-start gap-3 md:flex-col md:items-end">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className={buttonClass}>
                  GitHub ↗
                </a>
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className={buttonClass}>
                    Live demo ↗
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {/* Live GitHub contribution skyline */}
        <div className="mt-28">
          <GithubActivity />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <p className="mb-6 font-display text-lg italic text-ink/70">Explore all repositories and contributions on GitHub.</p>
          <a
            href="https://github.com/priyanshu-3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-ink px-8 py-4 font-label text-[11px] font-bold uppercase tracking-[0.2em] text-mark transition-colors hover:bg-poppy"
          >
            View all on GitHub ↗
          </a>
        </motion.div>
      </div>
    </ScrollSection>
  );
}
