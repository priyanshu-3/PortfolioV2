import { motion, type Variants } from "motion/react";
import { SectionHeading } from "@/components/theme/SectionHeading";
import { Mark } from "@/components/theme/marks";

/* ─────────────────────────────────────────────
   Skill categories data
   ───────────────────────────────────────────── */
const skillCategories = [
  {
    title: "Languages & Databases",
    subtitle: "Core Stack",
    bio: "Building robust applications using versatile programming languages and scalable database solutions.",
    skills: ["Java", "Python", "JavaScript", "HTML", "CSS", "MySQL", "PostgreSQL"],
  },
  {
    title: "AI & Machine Learning",
    subtitle: "Intelligence Layer",
    bio: "Developing intelligent features, integrating LLMs, and creating specialized AI agents.",
    skills: [
      "Google Gemini API",
      "Prompt Engineering",
      "Agent Creation",
      "Multi-Agent Systems",
      "RAG",
      "XGBoost",
    ],
  },
  {
    title: "Tools & DevOps",
    subtitle: "Build & Deploy",
    bio: "Streamlining development pipelines, version control, and managing reliable cloud infrastructure.",
    skills: ["Git", "GitHub", "Maven", "Gradle", "Supabase"],
  },
  {
    title: "Developer Tools",
    subtitle: "Productivity",
    bio: "Leveraging cutting-edge AI coding assistants and intelligent tooling to accelerate development.",
    skills: ["GitHub Copilot", "Cursor", "Codex", "Claude", "Chat2DB"],
  },
];

/* ─────────────────────────────────────────────
   Animation variants
   ───────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] },
  },
};

/* ─────────────────────────────────────────────
   One category, a cell of the ruled grid
   ───────────────────────────────────────────── */
function SkillCategoryCard({ cat, index }: { cat: (typeof skillCategories)[0]; index: number }) {
  return (
    <motion.div variants={itemVariants} className="group border-b border-r border-line bg-canvas p-7 transition-colors hover:bg-surface md:p-10">
      <div className="flex items-start justify-between gap-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-dim">{cat.subtitle}</span>
        <span className="text-5xl font-black leading-none tracking-tight text-line transition-colors group-hover:text-yellow-400 md:text-6xl">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-6 text-2xl font-black tracking-tight md:text-3xl">{cat.title}</h3>
      <p className="mt-3 max-w-md leading-relaxed text-dim">{cat.bio}</p>

      <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 text-[11px] font-semibold uppercase tracking-[0.15em]">
        {cat.skills.map((skill) => (
          <li key={skill} className="flex items-center gap-2">
            <Mark />
            {skill}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main exported section
   ───────────────────────────────────────────── */
export function SkillSectionBlock() {
  return (
    <section aria-labelledby="skills-heading" className="relative w-full px-4 py-24 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          id="skills-heading"
        >
          <SectionHeading number="02" label="What I work with" title="Skills &" highlight="Technologies" />
        </motion.div>

        {/* 2×2 grid, ruled like a table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid border-l border-t border-line sm:grid-cols-2"
        >
          {skillCategories.map((cat, i) => (
            <SkillCategoryCard key={cat.title} cat={cat} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
