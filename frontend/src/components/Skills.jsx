import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiSparkles, HiRefresh } from "react-icons/hi";
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
    title: "Frontend Development",
    skills: "React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Vite",
    level: "95%",
  },
  {
    id: 2,
    image: backendSkillImg,
    badge: "Server Architecture",
    title: "Backend Development",
    skills: "Node.js, Express.js, REST APIs, GraphQL, Microservices",
    level: "90%",
  },
  {
    id: 3,
    image: videoSkillImg,
    badge: "Creative Media",
    title: "Video Editing & Motion Graphics",
    skills: "Adobe Premiere, DaVinci Resolve, Motion FX, Sound Design",
    level: "92%",
  },
  {
    id: 4,
    image: databaseSkillImg,
    badge: "Data & Storage",
    title: "Database Systems",
    skills: "MongoDB, Mongoose, MySQL, Firebase Firestore, PostgreSQL",
    level: "85%",
  },
  {
    id: 5,
    image: aiMlSkillImg,
    badge: "AI Systems",
    title: "AI & Machine Learning",
    skills: "Python, OpenAI APIs, Prompt Engineering, Neural Networks",
    level: "80%",
  },
  {
    id: 6,
    image: toolsCloudSkillImg,
    badge: "DevOps & Cloud",
    title: "Tools & Cloud Deployment",
    skills: "Git, GitHub, Vercel, Netlify, Docker, CI/CD Pipelines",
    level: "90%",
  },
];

const Skills = () => {
  const [skills, setSkills] = useState(defaultSkills);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    const res = await apiGetSkills();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      const mapped = res.data.map((sk, idx) => {
        let img = sk.image;
        if (!img || img.startsWith("/assets/skills/")) {
          const fallback = defaultSkills[idx % defaultSkills.length];
          img = fallback ? fallback.image : frontendSkillImg;
        }
        return { ...sk, id: sk.id || sk._id || idx + 1, image: img };
      });
      setSkills(mapped);
    } else if (!res.success) {
      setError(res.error || "Could not fetch Skills API");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <section
      id="skills"
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-4 sm:px-6 py-20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-cyan-600 dark:text-cyan-400 text-lg font-semibold flex items-center justify-center gap-2">
            <HiSparkles className="text-xl" />
            My Skills
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-3 text-slate-900 dark:text-white tracking-tight">
            Technologies &
            <span className="block bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 dark:from-cyan-400 dark:via-teal-300 dark:to-purple-500 bg-clip-text text-transparent">
              Creative Expertise
            </span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            A comprehensive overview of my software engineering stack, video production tools, and cloud deployment capabilities.
          </p>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              whileHover={{ y: -8 }}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 shadow-xl dark:shadow-none flex flex-col justify-between"
            >
              {/* Skill Banner Image */}
              <div className="relative overflow-hidden h-52 sm:h-56 bg-slate-950">
                <img
                  src={skill.image}
                  alt={skill.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-950/30 to-transparent" />
                <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-cyan-400 text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-700 shadow-md">
                  {skill.badge}
                </span>
              </div>

              {/* Skill Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">
                    {skill.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                    {skill.skills}
                  </p>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Mastery Progress</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono">{skill.level}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/80">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: skill.level }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 dark:from-cyan-400 dark:via-teal-300 dark:to-purple-500 rounded-full shadow-md shadow-cyan-500/30"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;