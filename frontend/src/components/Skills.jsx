import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi";
import BookmarkSkillCard from "./BookmarkSkillCard";
import { apiGetSkills } from "../services/api";

import frontendSkillImg from "../assets/skills/frontend.png";
import backendSkillImg from "../assets/skills/backend.png";
import videoSkillImg from "../assets/skills/video.png";
import databaseSkillImg from "../assets/skills/database.png";
import aiMlSkillImg from "../assets/skills/ai_ml.png";
import toolsCloudSkillImg from "../assets/skills/tools_cloud.png";

const defaultSkills = [
  {
    id: 1,
    image: frontendSkillImg,
    badge: "UI & Web Frontend",
    brandTag: "— Nova Frontend®",
    category: "Frontend",
    tagline: "Pixel-perfect reactive interfaces & high-framerate motion.",
    title: "Frontend Development",
    skills: "React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Vite, Next.js",
    tags: ["React.js", "Tailwind CSS", "JavaScript", "Next.js", "Vite"],
    level: "95%",
    metric: "95% Mastery",
    themeKey: "cyan",
  },
  {
    id: 2,
    image: backendSkillImg,
    badge: "Server Architecture",
    brandTag: "— Core Backend®",
    category: "Backend",
    tagline: "High-throughput REST APIs, microservices & scalable engines.",
    title: "Backend Development",
    skills: "Node.js, Express.js, REST APIs, GraphQL, Microservices, JWT Auth",
    tags: ["Node.js", "Express.js", "REST APIs", "GraphQL", "JWT"],
    level: "90%",
    metric: "90% Mastery",
    themeKey: "emerald",
  },
  {
    id: 3,
    image: videoSkillImg,
    badge: "Creative Media",
    brandTag: "— Motion Studio®",
    category: "Creative Media",
    tagline: "Cinematic color grading, dynamic sound design & VFX.",
    title: "Video Editing & Motion Graphics",
    skills: "Adobe Premiere, DaVinci Resolve, After Effects, Motion FX, Sound Design",
    tags: ["Premiere Pro", "DaVinci", "After Effects", "Motion FX"],
    level: "92%",
    metric: "92% Mastery",
    themeKey: "purple",
  },
  {
    id: 4,
    image: databaseSkillImg,
    badge: "Data & Storage",
    brandTag: "— Nexus Storage®",
    category: "Data & Cloud",
    tagline: "Resilient schemas, ACID transactions & high-speed caching.",
    title: "Database Systems",
    skills: "MongoDB, Mongoose, MySQL, Firebase Firestore, PostgreSQL, Redis",
    tags: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Mongoose"],
    level: "85%",
    metric: "85% Mastery",
    themeKey: "amber",
  },
  {
    id: 5,
    image: aiMlSkillImg,
    badge: "AI Systems",
    brandTag: "— Neural Forge®",
    category: "AI Systems",
    tagline: "LLM integrations, prompt engineering & neural pipelines.",
    title: "AI & Machine Learning",
    skills: "Python, OpenAI APIs, Prompt Engineering, LangChain, Neural Networks",
    tags: ["Python", "OpenAI APIs", "Prompt Eng.", "LangChain"],
    level: "80%",
    metric: "80% Mastery",
    themeKey: "rose",
  },
  {
    id: 6,
    image: toolsCloudSkillImg,
    badge: "DevOps & Cloud",
    brandTag: "— Cloud Deploy®",
    category: "Data & Cloud",
    tagline: "Automated CI/CD pipelines, containerization & edge CDN.",
    title: "Tools & Cloud Deployment",
    skills: "Git, GitHub, Vercel, Netlify, Docker, CI/CD Pipelines, Linux",
    tags: ["Git/GitHub", "Vercel", "Docker", "CI/CD", "Linux"],
    level: "90%",
    metric: "90% Mastery",
    themeKey: "sky",
  },
];

const categoryFilters = [
  "All",
  "Frontend",
  "Backend",
  "Creative Media",
  "Data & Cloud",
  "AI Systems",
];

const Skills = () => {
  const [skills, setSkills] = useState(defaultSkills);
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchSkills = async () => {
    try {
      const res = await apiGetSkills();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((sk, idx) => {
          let img = sk.image;
          if (!img || img.startsWith("/assets/skills/")) {
            const fallback = defaultSkills[idx % defaultSkills.length];
            img = fallback ? fallback.image : frontendSkillImg;
          }
          const defaultRef = defaultSkills[idx % defaultSkills.length] || {};
          return {
            ...defaultRef,
            ...sk,
            id: sk.id || sk._id || idx + 1,
            image: img,
            brandTag: defaultRef.brandTag || `— ${sk.title || "Skill"}®`,
            tagline: defaultRef.tagline || sk.skills || "Mastery in core development workflows.",
            themeKey: defaultRef.themeKey || (["cyan", "emerald", "purple", "amber", "rose", "sky"][idx % 6]),
            category: defaultRef.category || "Frontend",
            tags: defaultRef.tags || (sk.skills ? sk.skills.split(",").map((s) => s.trim()).slice(0, 4) : []),
            metric: defaultRef.metric || `${sk.level || "90%"} Mastery`,
          };
        });
        setSkills(mapped);
      }
    } catch {
      // Keep rich defaults
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section
      id="skills"
      className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-4 sm:px-6 lg:px-8 py-24 transition-colors duration-300 overflow-hidden"
    >
      {/* Background Ambient Cyber Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Section Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08]"
          >
            Technologies &{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
              Creative Expertise
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore core technical capabilities across full-stack engineering, scalable backend architecture, database systems, and creative media.
          </motion.p>

          {/* Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {categoryFilters.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-cyan-400 dark:border-white shadow-lg shadow-cyan-500/20 scale-105"
                      : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Card Bookmark Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9 items-stretch pt-2 pb-12"
        >
          {filteredSkills.map((skill, idx) => (
            <BookmarkSkillCard
              key={skill.id || idx}
              skill={skill}
              index={idx}
            />
          ))}
        </motion.div>

        {/* Footer Bottom Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <HiSparkles className="text-[#e2f952]" />
            <span>Interactive Bookmark Cards — Hover to inspect bloom & live mastery metrics</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;