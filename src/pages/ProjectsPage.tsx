import { ScrollSection } from "@/components/ScrollSection";
import { type Variants } from "framer-motion";
import { motion } from "framer-motion";
import { Github, ExternalLink, Code2 } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  live?: string;
  gradient: string;
  emoji: string;
}

const projects: Project[] = [
  {
    title: "Multi-Agent Software Development Pipeline",
    description:
      "Built an autonomous RAG-based multi-agent system (Planner, Builder, Reviewer) that turns requirements into reviewed PRs. Engineered a Planner agent that decomposes PDF/TXT/MD specs into dependency-ordered GitHub issues with acceptance criteria. Developed Builder and Reviewer agents that write multi-file code into draft PRs and post inline diff reviews with verdicts. Designed a label-driven orchestrator with a 5-round review cap, human escalation, rate-limit backoff and Gemini model fallback.",
    tags: ["Python", "Google Gemini API", "RAG", "GitHub REST API", "PyGitHub", "pdfplumber"],
    github: "https://github.com/priyanshu-3/dev-agent-pipeline",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    emoji: "🤖",
  },
  {
    title: "Shishu-Sneh (Smart Baby's First Year Guide)",
    description:
      "Engineered an offline-first infant healthcare app utilizing Room DB and Supabase PostgreSQL for local persistence and cloud sync. Developed a Spring Boot backend to automate immunization tracking against the Indian NIS via Android WorkManager notifications. Integrated Google Gemini API to build a dynamic nutrition engine processing real-time user ingredients for localized recipes. Implemented data visualization dashboards using MPAndroidChart to parse health logs and render growth trends.",
    tags: ["Spring Boot", "Android Native", "Room DB", "Supabase", "Gemini API"],
    github: "https://github.com/priyanshu-3/Shishu-Sneh",
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    emoji: "👶",
  },
  {
    title: "Advanced Skin Cancer Detection System",
    description:
      "Built a full-stack AI web app for skin cancer detection achieving 85-90% test accuracy using ensemble ML models. Designed 10+ Flask REST APIs with SQLAlchemy and a responsive React UI supporting real-time medical image analysis. Implemented XAI, confidence scoring mechanisms, and automated 100% of medical report updates via PDF generation.",
    tags: ["Python", "Flask", "React", "Tailwind CSS", "XGBoost", "Roboflow API", "SQLAlchemy"],
    github: "https://github.com/priyanshu-3/SkinCare",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    emoji: "🔬",
  },
  {
    title: "Drug Inventory and Supply Chain Tracking System",
    description:
      "Engineered a full-stack supply chain platform enabling end-to-end traceability across 6 roles, improving transparency by 35%. Built real-time inventory monitoring features, reducing system stock-outs by 30% and improving fulfillment speed by 25%. Developed secure role-based access controls and analytics dashboards, increasing operational decision-making efficiency by 40%.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Data Visualization"],
    github: "https://github.com/priyanshu-3/Drug-Inventory",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    emoji: "💊",
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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <ScrollSection id="projects" className="py-32 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
              Built by Priyanshu Mehra
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              My Projects
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Real projects from my GitHub — spanning AI, Computer Vision, Full-Stack Development,
              and creative experiments.
            </p>
          </motion.div>

          {/* Project Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => {
              // Map project to glow colors based on index or title
              const glowColor = 
                index % 5 === 0 ? "red" :
                index % 5 === 1 ? "purple" :
                index % 5 === 2 ? "blue" :
                index % 5 === 3 ? "green" : "orange";

              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="h-full"
                >
                  <div className="relative h-full">
                    <GlowCard
                      customSize={true}
                      glowColor={glowColor}
                      className="!rounded-3xl !bg-black/40 backdrop-blur-xl h-full !p-0"
                    >
                      {/* Gradient accent overlay (static) */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-[0.05] pointer-events-none`}
                      />

                      {/* Card content */}
                      <div className="relative z-10 p-7 flex flex-col h-full">
                        {/* Title */}
                        <h3 className="text-2xl font-extrabold mb-4 text-white">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-medium px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-3 mt-auto flex-wrap">
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all duration-200"
                          >
                            <Github className="w-4 h-4" />
                            GitHub
                          </a>
                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-white transition-all duration-200"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </GlowCard>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-20 text-center"
          >
            <p className="text-muted-foreground mb-6">
              Explore all repositories and contributions on GitHub.
            </p>
            <a
              href="https://github.com/priyanshu-3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/30"
            >
              <Code2 className="w-5 h-5" />
              View All on GitHub
            </a>
          </motion.div>

        </div>
      </ScrollSection>
    </div>
  );
}
