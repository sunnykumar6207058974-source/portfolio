import { useState, useEffect } from "react";
import {
  HiDownload,
  HiPrinter,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiExternalLink,
  HiCode,
  HiGlobeAlt,
} from "react-icons/hi";
import profilePhoto from "../assets/profile.jpg";
import { fetchSiteConfig, resolveResumeUrl } from "../utils/resume";
import { apiGetProjects } from "../services/api";

const ResumePage = () => {
  const [profile, setProfile] = useState({
    name: "Sunny Kumar",
    title: "Full-Stack Web Developer | AI & Machine Learning | Video Editor",
    email: "sunnykumar6207058974@gmail.com",
    phone: "+91 8340112045",
    location: "India",
    portfolioUrl: "https://portfolio-iota-six-26.vercel.app",
    githubUrl: "https://github.com/sunnykumar6207058974-source",
    bio: "Results-driven Full-Stack Web Developer and Software Engineer specializing in scalable MERN architectures, Artificial Intelligence & Machine Learning integrations, and high-impact digital media.",
    resumeUrl: "/Sunny_Kumar_Resume.pdf",
  });

  const [projects, setProjects] = useState([
    {
      title: "1. Cartify - Premium E-Commerce Platform",
      year: "2026",
      desc: "Built a full-stack e-commerce platform with product category management, interactive shopping cart, dark mode toggle, and instant dispatch tracking.",
      demoUrl: "https://cartify-store-amber.vercel.app",
      githubUrl: "https://github.com/sunnykumar6207058974-source/Cartify",
    },
    {
      title: "2. UrbanThread - Luxe Sneakers & Streetwear Drops",
      year: "2026",
      desc: "Developed a high-end streetwear e-commerce platform featuring sneaker drops, flash deal banners, promo code engine, wishlist, and admin analytics dashboard.",
      demoUrl: "https://urban-thread-sand.vercel.app",
      githubUrl: "https://github.com/sunnykumar6207058974-source/UrbanThread",
    },
    {
      title: "3. PixelForge - Developer Portfolio & Showcase",
      year: "2026",
      desc: "Created an interactive developer portfolio featuring an HTML5 canvas particle background, theme switching context, video demo popups, custom cursor, and printable resume viewer.",
      demoUrl: "https://portfolio-iota-six-26.vercel.app",
      githubUrl: "https://github.com/sunnykumar6207058974-source/portfolio",
    },
    {
      title: "4. Aetheria - Immersive WebGL 3D Matrix Experience",
      year: "2026",
      desc: "Architected a 3D WebGL digital experience with 60 FPS matrix torus particles, audio sound FX, zero-trust API security, and ultra-fast sub-second loading speeds.",
      demoUrl: "https://aetheria-3d.vercel.app",
      githubUrl: "https://github.com/sunny/aetheria",
    },
  ]);

  useEffect(() => {
    fetchSiteConfig().then((cfg) => {
      if (cfg) {
        const wInfo = cfg.websiteInfo || {};
        const hSec = cfg.heroSection || {};
        setProfile((prev) => ({
          ...prev,
          name: wInfo.name || hSec.name || prev.name,
          title: wInfo.headline || hSec.headline || prev.title,
          email: wInfo.email || prev.email,
          phone: wInfo.phone || prev.phone,
          location: wInfo.location || prev.location,
          bio: wInfo.bio || prev.bio,
          resumeUrl: resolveResumeUrl(wInfo.resumeUrl || prev.resumeUrl),
        }));
      }
    });

    apiGetProjects()
      .then((res) => {
        const items = res && res.data ? res.data : res;
        if (Array.isArray(items) && items.length > 0) {
          const formatted = items.map((p, idx) => ({
            title: `${idx + 1}. ${p.title}`,
            year: "2026",
            desc: p.description || p.category || "Full-stack project showcase.",
            demoUrl: p.demoUrl,
            githubUrl: p.githubUrl,
          }));
          setProjects(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {profile.name} - Curriculum Vitae
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.title}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300 hover:border-cyan-500 font-semibold text-sm transition cursor-pointer"
            >
              <HiPrinter className="text-lg" />
              Print / Save
            </button>

            <a
              href={profile.resumeUrl}
              download="Sunny_Kumar_Resume.pdf"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-md shadow-cyan-500/20"
            >
              <HiDownload className="text-lg" />
              Download PDF
            </a>
          </div>
        </div>

        {/* Printable Resume Sheet Container */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl print:shadow-none print:border-none print:p-0">
          {/* Resume Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={profilePhoto}
                alt={`${profile.name} Resume Profile`}
                className="w-32 h-44 sm:w-36 sm:h-48 rounded-2xl object-cover object-top border-2 border-cyan-400/80 p-0.5 shadow-lg shrink-0"
              />
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {profile.name}
                </h2>
                <p className="text-cyan-600 dark:text-cyan-400 font-bold text-base sm:text-lg mt-1">
                  {profile.title}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <HiMail className="text-cyan-500 text-lg shrink-0" />
              <a href={`mailto:${profile.email}`} className="hover:text-cyan-500 truncate">
                {profile.email}
              </a>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <HiPhone className="text-cyan-500 text-lg shrink-0" />
              <a href={`tel:${profile.phone}`} className="hover:text-cyan-500">
                {profile.phone}
              </a>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <HiGlobeAlt className="text-cyan-500 text-lg shrink-0" />
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-500 truncate font-semibold"
                title="Live Portfolio Website"
              >
                Live Portfolio
              </a>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <HiCode className="text-cyan-500 text-lg shrink-0" />
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-500 truncate font-semibold"
                title="GitHub Profile"
              >
                GitHub Profile
              </a>
            </div>
          </div>

          {/* Professional Summary / Objective */}
          <div className="py-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Professional Summary
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
              Results-driven Full-Stack Web Developer and Software Engineer specializing in scalable MERN architectures, Artificial Intelligence & Machine Learning integrations, and high-impact digital media.
            </p>
          </div>

          {/* Skills Breakdown */}
          <div className="py-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Core Skills & Technologies
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                  💻 Full-Stack Development:
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  React.js, JavaScript (ES6+), Node.js, Express.js, Tailwind CSS, HTML5/CSS3, REST APIs, MongoDB, Git/GitHub, Vercel, Vite.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                  🤖 Artificial Intelligence & ML:
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Python, Machine Learning Fundamentals, Scikit-Learn, Generative AI & LLM APIs, Prompt Engineering, Predictive Modeling, AI Automation.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                  🎬 Video Editing & Media:
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Video Cutting & Trimming, Motion Graphics, Audio Synchronization, Color Grading, Storyboarding, Social Media Clips & Reel Editing.
                </p>
              </div>
            </div>
          </div>

          {/* Key Projects */}
          <div className="py-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Featured Projects
            </h3>
            <div className="space-y-4 text-xs sm:text-sm">
              {projects.map((proj, i) => (
                <div key={i} className="pb-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 font-bold text-slate-900 dark:text-white">
                    <span className="text-sm sm:text-base">{proj.title}</span>
                    <div className="flex items-center gap-3 text-xs">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1 transition"
                        >
                          <HiExternalLink className="text-sm" />
                          Live Demo
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-cyan-500 font-medium flex items-center gap-1 transition"
                        >
                          <HiCode className="text-sm" />
                          GitHub
                        </a>
                      )}
                      <span className="text-slate-400 font-normal">{proj.year}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {proj.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="pt-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Education
            </h3>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                B.Tech in Computer Science & Engineering
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Focused on Artificial Intelligence & Machine Learning, Web Architecture, Software Engineering, and Digital Media.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
