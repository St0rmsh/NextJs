/* =========================================================
   RESUME SKILL CATEGORIES
   ========================================================= */

export const SKILL_CATEGORIES = {
  LANGUAGES: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C",
    "Go",
    "Rust",
  ],

  FRONTEND: [
    "React.js",
    "Next.js",
    "Redux Toolkit",
    "Tailwind CSS",
    "Framer Motion",
    "Three.js",
    "GSAP",
    "WebGL",
    "HTML5",
    "CSS3",
    "Vite",
  ],

  BACKEND: [
    "Node.js",
    "Express.js",
    "REST APIs",
    "WebSockets",
    "Socket.IO",
    "Microservices",
    "GraphQL",
    "Authentication",
    "JWT",
  ],

  DATABASES: [
    "MongoDB",
    "Redis",
    "PostgreSQL",
    "MySQL",
    "Mongoose",
    "Prisma",
  ],

  "DEVOPS & CLOUD": [
    "Docker",
    "Kubernetes",
    "CI/CD",
    "AWS",
    "GitHub Actions",
    "Nginx",
    "Linux",
  ],

  "AI & TOOLS": [
    "LangChain",
    "Gemini",
    "Tavily",
    "Git",
    "GitHub",
    "Mistral",
    "OpenAI",
    "Claude",
    "BullMQ",
    "FFmpeg",
  ],
} as const;

export type SkillCategory = keyof typeof SKILL_CATEGORIES;

/* =========================================================
   NORMALIZATION ALIASES
   ========================================================= */

const SKILL_ALIASES: Record<string, string> = {
  /* =======================================================
     LANGUAGES
     ======================================================= */

  // JavaScript
  js: "JavaScript",
  javascript: "JavaScript",

  // TypeScript
  ts: "TypeScript",
  typescript: "TypeScript",

  // Python
  python: "Python",
  py: "Python",

  // Java
  java: "Java",

  // C++
  cpp: "C++",
  "c++": "C++",

  // C
  c: "C",

  // Go
  go: "Go",
  golang: "Go",

  // Rust
  rust: "Rust",

  /* =======================================================
     FRONTEND
     ======================================================= */

  // React
  react: "React.js",
  reactjs: "React.js",
  "react js": "React.js",
  "react.js": "React.js",

  // Next.js
  next: "Next.js",
  nextjs: "Next.js",
  "next js": "Next.js",
  "next.js": "Next.js",

  // Redux
  redux: "Redux Toolkit",
  reduxtoolkit: "Redux Toolkit",
  "redux toolkit": "Redux Toolkit",
  "redux-toolkit": "Redux Toolkit",

  // Tailwind
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",

  // Framer Motion
  "framer motion": "Framer Motion",
  framermotion: "Framer Motion",
  "framer-motion": "Framer Motion",

  // Three.js
  three: "Three.js",
  threejs: "Three.js",
  "three js": "Three.js",
  "three.js": "Three.js",

  // GSAP
  gsap: "GSAP",

  // WebGL
  webgl: "WebGL",

  // HTML
  html: "HTML5",
  html5: "HTML5",

  // CSS
  css: "CSS3",
  css3: "CSS3",

  // Vite
  vite: "Vite",

  /* =======================================================
     BACKEND
     ======================================================= */

  // Node.js
  node: "Node.js",
  nodejs: "Node.js",
  "node js": "Node.js",
  "node.js": "Node.js",

  // Express.js
  express: "Express.js",
  expressjs: "Express.js",
  "express js": "Express.js",
  "express.js": "Express.js",

  // REST APIs
  rest: "REST APIs",
  "rest api": "REST APIs",
  "rest apis": "REST APIs",
  "restful api": "REST APIs",
  "restful apis": "REST APIs",
  restful: "REST APIs",

  // WebSockets
  websocket: "WebSockets",
  websockets: "WebSockets",
  "web socket": "WebSockets",
  "web sockets": "WebSockets",

  // Socket.IO
  socketio: "Socket.IO",
  "socket io": "Socket.IO",
  "socket.io": "Socket.IO",

  // Microservices
  microservices: "Microservices",

  // GraphQL
  graphql: "GraphQL",

  // Authentication
  authentication: "Authentication",
  auth: "Authentication",

  // JWT
  jwt: "JWT",

  /* =======================================================
     DATABASES
     ======================================================= */

  // MongoDB
  mongo: "MongoDB",
  mongodb: "MongoDB",
  "mongo db": "MongoDB",

  // Redis
  redis: "Redis",

  // PostgreSQL
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  "postgre sql": "PostgreSQL",

  // MySQL
  mysql: "MySQL",
  "my sql": "MySQL",

  // Mongoose
  mongoose: "Mongoose",

  // Prisma
  prisma: "Prisma",

  /* =======================================================
     DEVOPS & CLOUD
     ======================================================= */

  // Docker
  docker: "Docker",

  // Kubernetes
  kubernetes: "Kubernetes",
  k8s: "Kubernetes",

  // CI/CD
  "ci/cd": "CI/CD",
  cicd: "CI/CD",
  "ci cd": "CI/CD",

  // AWS
  aws: "AWS",
  "amazon web services": "AWS",

  // GitHub Actions
  "github actions": "GitHub Actions",
  githubactions: "GitHub Actions",

  // Nginx
  nginx: "Nginx",

  // Linux
  linux: "Linux",

  /* =======================================================
     AI & TOOLS
     ======================================================= */

  // LangChain
  langchain: "LangChain",

  // Gemini
  gemini: "Gemini",
  "google gemini": "Gemini",

  // Tavily
  tavily: "Tavily",

  // Git
  git: "Git",

  // GitHub
  github: "GitHub",

  // Mistral
  mistral: "Mistral",

  // OpenAI
  openai: "OpenAI",

  // Claude
  claude: "Claude",
  "anthropic claude": "Claude",

  // BullMQ
  bullmq: "BullMQ",

  // FFmpeg
  ffmpeg: "FFmpeg",
};

/* =========================================================
   NORMALIZE ONE SKILL
   ========================================================= */

export function normalizeSkill(skill: string): string {
  if (!skill || typeof skill !== "string") {
    return "";
  }

  const value = skill
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (!value) {
    return "";
  }

  return SKILL_ALIASES[value] || skill.trim();
}

/* =========================================================
   SKILL KEY
   Used for comparing skills safely.
   ========================================================= */

export function getSkillKey(skill: string): string {
  return normalizeSkill(skill).toLowerCase();
}

/* =========================================================
   CATEGORY LOOKUP
   ========================================================= */

const CATEGORY_LOOKUP = new Map<string, SkillCategory>();

for (const [category, skills] of Object.entries(
  SKILL_CATEGORIES
) as [SkillCategory, readonly string[]][]) {
  for (const skill of skills) {
    CATEGORY_LOOKUP.set(
      getSkillKey(skill),
      category
    );
  }
}

/* =========================================================
   GROUPED SKILL TYPE
   ========================================================= */

export interface GroupedSkills {
  category: SkillCategory | "OTHER";
  label: string;
  skills: string[];
}

/* =========================================================
   GROUP SKILLS
   ========================================================= */

export function groupSkills(
  skills: string[] = []
): GroupedSkills[] {
  const groups = new Map<
    SkillCategory | "OTHER",
    string[]
  >();

  const seen = new Set<string>();

  for (const rawSkill of skills) {
    if (!rawSkill || typeof rawSkill !== "string") {
      continue;
    }

    if (!rawSkill.trim()) {
      continue;
    }

    const skill = normalizeSkill(rawSkill);

    if (!skill) {
      continue;
    }

    const key = getSkillKey(skill);

    /*
     * Prevent duplicate skills such as:
     *
     * express + Express.js
     * nextjs + Next.js
     * react + React.js
     */
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    const category =
      CATEGORY_LOOKUP.get(key) || "OTHER";

    const existing = groups.get(category) || [];

    existing.push(skill);

    groups.set(category, existing);
  }

  const result: GroupedSkills[] = [];

  /*
   * Keep categories in the predefined resume order.
   */
  for (const category of Object.keys(
    SKILL_CATEGORIES
  ) as SkillCategory[]) {
    const categorySkills = groups.get(category);

    if (!categorySkills?.length) {
      continue;
    }

    result.push({
      category,
      label: category,
      skills: categorySkills,
    });
  }

  /*
   * Custom skills that aren't in our predefined list.
   */
  const otherSkills = groups.get("OTHER");

  if (otherSkills?.length) {
    result.push({
      category: "OTHER",
      label: "OTHER",
      skills: otherSkills,
    });
  }

  return result;
}