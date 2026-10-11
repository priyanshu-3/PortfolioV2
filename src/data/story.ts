export type MilestoneKind =
  | "books" // school
  | "laptop" // studying computer science
  | "trophy" // prizes
  | "scan" // skin cancer detection
  | "briefcase" // internship
  | "phone" // infant-care app
  | "cap" // graduation
  | "agents" // multi-agent pipeline
  | "tower" // telecom
  | "envelope"; // get in touch

export interface Milestone {
  id: string;
  period: string;
  /** Short label above the title, e.g. "Education" or "Project" */
  category: string;
  title: string;
  subtitle: string;
  text: string;
  tags?: string[];
  github?: string;
  /** Which 3D object marks this point on the path */
  kind: MilestoneKind;
}

// In date order; facts come from public/Resume Mehra Priyanshu.pdf
export const milestones: Milestone[] = [
  {
    id: "school",
    period: "2019 – 2022",
    category: "Education",
    title: "School Years",
    subtitle: "Army Public School, Hempur · Uttarakhand",
    text: "Where it all started. Class X (CBSE) with 82.4%, then Class XII (CBSE) with 78.6%.",
    kind: "books",
  },
  {
    id: "vtu",
    period: "Nov 2022",
    category: "Education",
    title: "Computer Science at VTU",
    subtitle: "Visvesvaraya Technological University · Bengaluru",
    text: "Began a Bachelor of Engineering in Computer Science and Engineering, and started building real software.",
    kind: "laptop",
  },
  {
    id: "first-wins",
    period: "2022 – 2025",
    category: "Achievements",
    title: "First Wins",
    subtitle: "Competitions, 100+ DSA problems and a full-stack build",
    text: "Won 1st prize in a Code Debugging Session and 2nd in a Python for Data Science Workshop, solved 100+ problems on LeetCode, and built a Drug Inventory & Supply Chain Tracking platform with end-to-end traceability across 6 roles.",
    tags: ["React.js", "Node.js", "MongoDB", "LeetCode"],
    github: "https://github.com/priyanshu-3/Drug-Inventory",
    kind: "trophy",
  },
  {
    id: "skin-cancer",
    period: "Nov 2025",
    category: "Project",
    title: "Skin Cancer Detection System",
    subtitle: "Full-stack AI web app · 2nd place, Project and Research Expo 2025",
    text: "Ensemble ML models reaching 85–90% test accuracy, 10+ Flask REST APIs, explainable AI with confidence scoring, and automated PDF medical reports.",
    tags: ["Python", "Flask", "React", "XGBoost"],
    github: "https://github.com/priyanshu-3/SkinCare",
    kind: "scan",
  },
  {
    id: "mindmatrix",
    period: "Feb – May 2026",
    category: "Experience",
    title: "Software Engineering Intern",
    subtitle: "MindMatrix · Bengaluru",
    text: "Built a mobile-first infant-care app with Spring Boot and Room DB, automated immunization tracking with WorkManager and Supabase, and helped speed up feature delivery by 15%.",
    tags: ["Spring Boot", "Android", "Supabase", "Gemini API"],
    kind: "briefcase",
  },
  {
    id: "shishu-sneh",
    period: "May 2026",
    category: "Project",
    title: "Shishu-Sneh",
    subtitle: "Smart Baby's First Year Guide",
    text: "An offline-first infant healthcare app: immunization tracking against India's NIS schedule, a Gemini-powered nutrition engine, and growth-trend dashboards.",
    tags: ["Spring Boot", "Room DB", "Supabase", "Gemini API"],
    github: "https://github.com/priyanshu-3/Shishu-Sneh",
    kind: "phone",
  },
  {
    id: "graduation",
    period: "May 2026",
    category: "Education",
    title: "Graduated",
    subtitle: "B.E. Computer Science and Engineering · VTU",
    text: "Finished my degree with a CGPA of 7.8 / 10.",
    kind: "cap",
  },
  {
    id: "agents",
    period: "Aug 2026",
    category: "Project",
    title: "Multi-Agent Dev Pipeline",
    subtitle: "Planner · Builder · Reviewer",
    text: "An autonomous RAG-based multi-agent system that turns requirement docs into GitHub issues, draft PRs and inline code reviews, with a 5-round review cap and human escalation.",
    tags: ["Python", "Gemini API", "RAG", "GitHub API"],
    github: "https://github.com/priyanshu-3/dev-agent-pipeline",
    kind: "agents",
  },
  {
    id: "tecnotree",
    period: "Sep 2026 – Present",
    category: "Experience",
    title: "Graduate Engineer Trainee",
    subtitle: "Tecnotree · Bengaluru",
    text: "Working on the Billing module of a telecom billing platform (DCBS), migrating its Scala APIs to Java Spring Boot while keeping full functional parity.",
    tags: ["Java", "Spring Boot", "Scala"],
    kind: "tower",
  },
  {
    id: "next",
    period: "Open to work",
    category: "Contact",
    title: "What's Next?",
    subtitle: "Your project could be the next chapter",
    text: "I'm open to new projects and collaborations. Let's write the next chapter together.",
    kind: "envelope",
  },
];
