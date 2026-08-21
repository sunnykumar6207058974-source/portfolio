import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";
import { HiDownload, HiMail, HiPhone } from "react-icons/hi";
import profilePhoto from "../assets/profile.jpg";
import { fetchSiteConfig, resolveResumeUrl } from "../utils/resume";

const Hero = () => {
  const [resumeUrl, setResumeUrl] = useState("/Sunny_Kumar_Resume.pdf");

  useEffect(() => {
    fetchSiteConfig().then((cfg) => {
      if (cfg?.websiteInfo?.resumeUrl) {
        setResumeUrl(resolveResumeUrl(cfg.websiteInfo.resumeUrl));
      }
    });
  }, []);
  return (
    <section
      id="home"
      className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center pt-20 sm:pt-24 pb-12 overflow-hidden transition-colors duration-300"
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
        >
          {/* Intro Status Pill with Type Animation */}
          <div className="inline-flex max-w-full flex-wrap items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-500 animate-pulse shrink-0" />
            <span>Hi, I'm Sunny Kumar 👋</span>
            <span className="text-slate-300 dark:text-slate-700 hidden xs:inline">|</span>
            <TypeAnimation
              sequence={[
                "Full-Stack Web Developer",
                2000,
                "Creative Video Editor",
                2000,
                "React & Node.js Specialist",
                2000,
                "UI/UX Visual Creator",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-slate-700 dark:text-slate-300 font-medium truncate"
            />
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
            Sunny Kumar
            <span className="block min-h-[1.3em] bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 dark:from-cyan-400 dark:via-teal-300 dark:to-blue-500 bg-clip-text text-transparent mt-1">
              <TypeAnimation
                sequence={[
                  "Web Developer & Video Editor",
                  2200,
                  "Building High-End Web Apps",
                  2200,
                  "Crafting Engaging Video Content",
                  2200,
                  "Interactive SaaS & Media Platforms",
                  2200,
                ]}
                wrapper="span"
                speed={45}
                repeat={Infinity}
                cursor={true}
              />
            </span>
          </h1>

          {/* Professional Summary */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Passionate and versatile <strong className="text-cyan-600 dark:text-cyan-400 font-semibold">Full-Stack Web Developer</strong> and <strong className="text-cyan-600 dark:text-cyan-400 font-semibold">Video Editor</strong> with a strong foundation in building modern, high-performance web applications and crafting engaging visual media. Skilled in React.js, Node.js, Tailwind CSS, and creative video editing to deliver impactful digital products.
          </p>

          {/* Quick Contact Chips */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <a
              href="mailto:sunnykumar6207058974@gmail.com"
              className="flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
            >
              <HiMail className="text-cyan-500 text-base" />
              <span>sunnykumar6207058974@gmail.com</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a
              href="tel:+918340112045"
              className="flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
            >
              <HiPhone className="text-cyan-500 text-base" />
              <span>+91 8340112045</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3.5 sm:gap-4 items-stretch sm:items-center">
            <Link
              to="/projects"
              className="cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-0.5 text-center text-sm sm:text-base"
            >
              View My Work
            </Link>

            <a
              href={resumeUrl}
              download="Sunny_Kumar_Resume.pdf"
              className="inline-flex items-center justify-center gap-2 border border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 hover:bg-cyan-500 hover:text-slate-950 dark:hover:bg-cyan-400 dark:hover:text-slate-950 shadow-sm text-sm sm:text-base cursor-pointer"
            >
              <HiDownload className="text-lg" />
              Download Resume
            </a>

            <Link
              to="/contact"
              className="cursor-pointer border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-800 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm text-center text-sm sm:text-base"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>

        {/* Right Content - Profile Picture Card + Live Typing Code Snippet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center justify-center relative w-full"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-full max-w-full sm:max-w-md"
          >
            {/* Ambient Profile Glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000" />
            
            {/* User Profile Photo Card */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-cyan-400/50 bg-slate-950 flex flex-col items-center">
              <img
                src={profilePhoto}
                alt="Sunny Kumar - Full-Stack Web Developer & Video Editor"
                fetchPriority="high"
                decoding="async"
                className="w-full h-[460px] sm:h-[530px] object-cover object-top rounded-t-2xl sm:rounded-t-3xl hover:scale-[1.02] transition duration-700"
              />
              <div className="w-full bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-4 sm:p-5 text-left border-t border-slate-800/80">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Sunny Kumar</h3>
                <p className="text-xs sm:text-sm text-cyan-400 font-medium">Web Developer & Professional Video Editor</p>
              </div>
            </div>

            {/* Live Typing Code Snippet Box */}
            <div className="mt-4 sm:mt-6 bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-[11px] sm:text-xs font-mono text-cyan-400 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
                <span className="text-slate-500 text-[10px] ml-2">sunny.resume.config.ts</span>
              </div>
              <p className="text-slate-300">
                <span className="text-purple-400">const</span> candidate = &#123;
              </p>
              <p className="pl-3 sm:pl-4 text-cyan-300">
                name: <span className="text-emerald-400">"Sunny Kumar"</span>,
              </p>
              <p className="pl-3 sm:pl-4 text-cyan-300">
                phone: <span className="text-amber-400">"+91 8340112045"</span>,
              </p>
              <p className="pl-3 sm:pl-4 text-cyan-300">
                email: <span className="text-teal-300">"sunnykumar6207058974@gmail.com"</span>,
              </p>
              <p className="pl-3 sm:pl-4 text-cyan-300">
                roles:{" "}
                <TypeAnimation
                  sequence={[
                    '"Web Developer & Video Editor"',
                    1800,
                    '"React.js & Node.js Developer"',
                    1800,
                    '"Creative Motion Media Creator"',
                    1800,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="text-cyan-400 font-semibold"
                />
              </p>
              <p className="text-slate-300">&#125;;</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;