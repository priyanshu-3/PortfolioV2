import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/spotlight-card";
import {
  motion,
  type Variants,
} from "framer-motion";


/* ─────────────────────────────────────────────
   Skill categories data
   ───────────────────────────────────────────── */
const skillCategories = [
  {
    emoji: "🖥️",
    title: "Languages & Databases",
    subtitle: "Core Stack",
    bio: "Building robust applications using versatile programming languages and scalable database solutions.",
    skills: ["Java", "Python", "JavaScript", "HTML", "CSS", "MySQL", "PostgreSQL"],
    gradient: "from-blue-500/15 via-cyan-500/8 to-transparent",
    glowColor: "rgba(99,179,237,0.3)",
    accentColor: "#63b3ed",
  },
  {
    emoji: "⚙️",
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
    gradient: "from-emerald-500/15 via-green-500/8 to-transparent",
    glowColor: "rgba(72,187,120,0.3)",
    accentColor: "#48bb78",
  },
  {
    emoji: "🛠️",
    title: "Tools & DevOps",
    subtitle: "Build & Deploy",
    bio: "Streamlining development pipelines, version control, and managing reliable cloud infrastructure.",
    skills: ["Git", "GitHub", "Maven", "Gradle", "Supabase"],
    gradient: "from-orange-500/15 via-amber-500/8 to-transparent",
    glowColor: "rgba(246,173,85,0.3)",
    accentColor: "#f6ad55",
  },
  {
    emoji: "⚡",
    title: "Developer Tools",
    subtitle: "Productivity",
    bio: "Leveraging cutting-edge AI coding assistants and intelligent tooling to accelerate development.",
    skills: ["GitHub Copilot", "Cursor", "Codex", "Claude", "Chat2DB"],
    gradient: "from-purple-500/15 via-violet-500/8 to-transparent",
    glowColor: "rgba(159,122,234,0.3)",
    accentColor: "#9f7aea",
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
  hidden: { opacity: 0, y: 30, scale: 0.93 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] },
  },
};

/* ─────────────────────────────────────────────
   Individual skill category card
   ───────────────────────────────────────────── */
function SkillCategoryCard({
  cat,
}: {
  cat: (typeof skillCategories)[0];
}) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <div className="relative h-full">
        <GlowCard 
          customSize={true}
          glowColor={
            cat.title === "Frontend" ? "blue" : 
            cat.title === "Backend" ? "green" : 
            cat.title === "Blockchain" ? "purple" : "orange"
          }
          className="!rounded-3xl !bg-black/40 backdrop-blur-xl h-full !p-0"
        >
          {/* Static gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-[0.05]`}
          />

          <div className="relative z-10 p-7">
            {/* Emoji icon removed */}

            {/* Title & subtitle */}
            <div className="mb-1">
              <h3 className="text-2xl font-bold text-white">
                {cat.title}
              </h3>
              <Badge
                variant="secondary"
                className="mt-1 bg-white/8 text-[10px] uppercase tracking-widest text-white/40"
              >
                {cat.subtitle}
              </Badge>
            </div>

            {/* Bio */}
            <p className="mb-5 mt-3 text-sm leading-relaxed text-white/50">
              {cat.bio}
            </p>

            {/* Divider */}
            <div className="mb-5 h-px bg-white/8" />

            {/* Skill pills */}
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="border-white/10 bg-white/5 text-xs font-medium text-white/70"
                >
                  {skill}
                </Badge>
              ))}
            </div>

          </div>
        </GlowCard>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main exported section
   ───────────────────────────────────────────── */
export function SkillSectionBlock() {
  return (
    <section
      aria-labelledby="skills-heading"
      className="relative w-full overflow-hidden bg-black px-4 pt-24 pb-24 sm:px-6 lg:px-10"
    >

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="mb-16 text-center"
        >


          <motion.h1
            id="skills-heading"
            className="mb-4 text-5xl font-black tracking-tight text-white md:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Skills &amp; Technologies
          </motion.h1>
        </motion.div>

        {/* 2×2 grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 items-stretch"
        >
          {skillCategories.map((cat) => (
            <SkillCategoryCard key={cat.title} cat={cat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
