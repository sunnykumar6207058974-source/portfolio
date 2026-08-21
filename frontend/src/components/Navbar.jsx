import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiMenu,
  HiX,
  HiSun,
  HiMoon,
  HiDownload,
  HiHome,
  HiUser,
  HiCode,
  HiCog,
  HiFolder,
  HiMail,
  HiDocumentText,
  HiSparkles,
} from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { fetchSiteConfig, resolveResumeUrl } from "../utils/resume";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("/Sunny_Kumar_Resume.pdf");
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    fetchSiteConfig().then((cfg) => {
      if (cfg?.websiteInfo?.resumeUrl) {
        setResumeUrl(resolveResumeUrl(cfg.websiteInfo.resumeUrl));
      }
    });
  }, []);

  // Auto-close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Lock background scrolling when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  const navLinks = [
    { name: "Home", path: "/", icon: HiHome },
    { name: "About", path: "/about", icon: HiUser },
    { name: "Skills", path: "/skills", icon: HiCode },
    { name: "Services", path: "/services", icon: HiCog },
    { name: "Projects", path: "/projects", icon: HiFolder },
    { name: "Resume", path: "/resume", icon: HiDocumentText },
    { name: "Contact", path: "/contact", icon: HiMail },
    { name: "Admin", path: "/admin", icon: HiSparkles },
  ];

  return (
    <>
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3.5 sm:py-4">

          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-purple-500 bg-clip-text text-transparent cursor-pointer tracking-tight"
          >
            PixelForge
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `cursor-pointer font-medium transition text-sm lg:text-base ${
                    isActive
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Dark/Light Theme"
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              {darkMode ? <HiSun className="text-xl" /> : <HiMoon className="text-xl text-slate-700" />}
            </button>

            {/* Direct Download Resume Button */}
            <a
              href={resumeUrl}
              download="Sunny_Kumar_Resume.pdf"
              className="hidden lg:inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-4 py-2 rounded-full font-bold transition text-sm cursor-pointer shadow-sm"
            >
              <HiDownload />
              Download Resume
            </a>

            <Link
              to="/contact"
              className="cursor-pointer border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 px-5 py-2 rounded-full font-semibold transition text-sm lg:text-base shadow-sm"
            >
              Hire Me
            </Link>
          </nav>

          {/* Mobile Header Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 md:hidden">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-yellow-400 flex items-center justify-center transition cursor-pointer active:scale-95"
            >
              {darkMode ? <HiSun className="text-xl" /> : <HiMoon className="text-xl text-slate-700" />}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center text-2xl transition cursor-pointer active:scale-95"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Animated Fullscreen Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[60] md:hidden flex flex-col">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Slide Down Menu Box */}
            <motion.div
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-20 pb-8 px-6 shadow-2xl flex flex-col justify-between max-h-[85vh] overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                    Navigation Menu
                  </span>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <HiX className="text-xl" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {navLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-[0.98] ${
                            isActive
                              ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`
                        }
                      >
                        <Icon className="text-xl" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons inside Drawer */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <a
                  href={resumeUrl}
                  download="Sunny_Kumar_Resume.pdf"
                  className="flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-cyan-500/20 active:scale-[0.98] transition"
                >
                  <HiDownload className="text-lg" />
                  Download Resume (PDF)
                </a>

                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center border border-cyan-500 text-cyan-600 dark:text-cyan-400 py-3.5 rounded-2xl font-extrabold text-sm active:scale-[0.98] transition"
                >
                  Hire Me Now
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation Dock for Mobile Phones */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden pointer-events-auto">
        <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-full px-3 py-2 shadow-2xl flex items-center justify-around">
          {navLinks.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center p-2 rounded-full transition-all active:scale-90 ${
                    isActive
                      ? "text-cyan-600 dark:text-cyan-400 font-bold scale-110"
                      : "text-slate-500 dark:text-slate-400 hover:text-cyan-500"
                  }`
                }
              >
                <Icon className="text-xl" />
                <span className="text-[10px] font-medium mt-0.5">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navbar;