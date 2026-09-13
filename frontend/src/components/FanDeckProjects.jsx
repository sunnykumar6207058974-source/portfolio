import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  HiChevronLeft,
  HiChevronRight,
  HiPlay,
  HiPause,
  HiExternalLink,
  HiCode,
  HiCheckCircle,
} from "react-icons/hi";

const themeColors = {
  emerald: {
    orb: "radial-gradient(circle at 50% 45%, rgba(52, 211, 153, 0.55), rgba(16, 185, 129, 0.2), transparent 70%)",
    glow: "rgba(16, 185, 129, 0.35)",
    border: "border-emerald-500/40",
    activeBorder: "border-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    textGradient: "from-emerald-400 via-teal-300 to-cyan-400",
    shadow: "0 25px 60px -15px rgba(16, 185, 129, 0.4)",
    tagBg: "bg-emerald-950/40 border-emerald-800/40 text-emerald-300",
  },
  purple: {
    orb: "radial-gradient(circle at 50% 45%, rgba(217, 70, 239, 0.55), rgba(168, 85, 247, 0.2), transparent 70%)",
    glow: "rgba(168, 85, 247, 0.35)",
    border: "border-purple-500/40",
    activeBorder: "border-purple-400",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    textGradient: "from-purple-400 via-fuchsia-300 to-pink-400",
    shadow: "0 25px 60px -15px rgba(168, 85, 247, 0.4)",
    tagBg: "bg-purple-950/40 border-purple-800/40 text-purple-300",
  },
  cyan: {
    orb: "radial-gradient(circle at 50% 45%, rgba(34, 211, 238, 0.55), rgba(6, 182, 212, 0.2), transparent 70%)",
    glow: "rgba(6, 182, 212, 0.35)",
    border: "border-cyan-500/40",
    activeBorder: "border-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    textGradient: "from-cyan-400 via-teal-300 to-blue-400",
    shadow: "0 25px 60px -15px rgba(6, 182, 212, 0.4)",
    tagBg: "bg-cyan-950/40 border-cyan-800/40 text-cyan-300",
  },
  amber: {
    orb: "radial-gradient(circle at 50% 45%, rgba(251, 191, 36, 0.55), rgba(245, 158, 11, 0.2), transparent 70%)",
    glow: "rgba(245, 158, 11, 0.35)",
    border: "border-amber-500/40",
    activeBorder: "border-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    textGradient: "from-amber-400 via-orange-300 to-yellow-300",
    shadow: "0 25px 60px -15px rgba(245, 158, 11, 0.4)",
    tagBg: "bg-amber-950/40 border-amber-800/40 text-amber-300",
  },
  rose: {
    orb: "radial-gradient(circle at 50% 45%, rgba(251, 113, 133, 0.55), rgba(244, 63, 94, 0.2), transparent 70%)",
    glow: "rgba(244, 63, 94, 0.35)",
    border: "border-rose-500/40",
    activeBorder: "border-rose-400",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    textGradient: "from-rose-400 via-pink-300 to-purple-400",
    shadow: "0 25px 60px -15px rgba(244, 63, 94, 0.4)",
    tagBg: "bg-rose-950/40 border-rose-800/40 text-rose-300",
  },
};

const FanDeckProjects = ({ projects = [], onOpenProject }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = projects.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying || total === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying, handleNext, total]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  if (total === 0) return null;

  const activeProject = projects[activeIndex];
  const activeTheme =
    themeColors[activeProject?.themeKey || "cyan"] || themeColors.cyan;

  // Splayed fan geometry calculation
  const getCardTransform = (index) => {
    const diff = index - activeIndex;
    let normDiff = diff;
    if (diff > total / 2) normDiff = diff - total;
    if (diff < -total / 2) normDiff = diff + total;

    const absDiff = Math.abs(normDiff);
    const isVisible = absDiff <= 3;

    const angleStep = 9; // Degree spread per card
    const xStep = 50; // Horizontal displacement px
    const yStep = 8; // Slight vertical curve dip

    const rotate = normDiff * angleStep;
    const x = normDiff * xStep;
    const y = absDiff * absDiff * yStep;
    const zIndex = 50 - Math.round(absDiff * 10);
    const scale = Math.max(0.82, 1 - absDiff * 0.06);
    const opacity = isVisible ? Math.max(0.2, 1 - absDiff * 0.28) : 0;

    return { rotate, x, y, zIndex, scale, opacity, isVisible };
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center select-none pt-4 pb-12">
      {/* Ambient Radial Spotlight behind Active Card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-40"
        style={{
          background: activeTheme.glow,
        }}
      />

      {/* Fan Deck Splayed Stage Container */}
      <div
        className="relative w-full h-[540px] sm:h-[600px] flex items-center justify-center overflow-visible"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          const { rotate, x, y, zIndex, scale, opacity, isVisible } =
            getCardTransform(index);
          const pTheme =
            themeColors[project.themeKey || "cyan"] || themeColors.cyan;

          return (
            <motion.div
              key={project.id || index}
              animate={{
                rotate,
                x,
                y,
                scale,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                mass: 0.8,
              }}
              style={{
                transformOrigin: "50% 135%", // Shared hinge below the deck
                pointerEvents: isVisible ? "auto" : "none",
                zIndex,
              }}
              onClick={() => {
                if (!isActive) {
                  setActiveIndex(index);
                }
              }}
              className={`absolute w-[295px] sm:w-[355px] md:w-[380px] h-[500px] sm:h-[550px] rounded-[32px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden cursor-pointer backdrop-blur-xl border transition-all duration-500 shadow-2xl ${
                isActive
                  ? `bg-slate-950/95 ${pTheme.activeBorder} ring-1 ring-white/20`
                  : "bg-slate-900/85 border-slate-800 hover:border-slate-600 hover:opacity-100"
              }`}
            >
              {/* Inner Radial Aura in Center (Scrolltide Dusk/Glass style) */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: pTheme.orb,
                  opacity: isActive ? 0.9 : 0.4,
                }}
              />

              {/* Top Row: Category Slug & Project Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm font-extrabold lowercase tracking-wider text-slate-300">
                  {project.brandTag || `— ${project.category.toLowerCase()}`}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold border backdrop-blur-md ${pTheme.badge}`}
                >
                  {project.badge || project.category}
                </span>
              </div>

              {/* Center Artwork Orb & Visual Icon */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2 text-center">
                <div
                  onClick={(e) => {
                    if (isActive && onOpenProject) {
                      e.stopPropagation();
                      onOpenProject(project);
                    }
                  }}
                  className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center group/art rounded-2xl overflow-hidden cursor-pointer"
                >
                  {/* Glowing Ambient Halo */}
                  <div
                    className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 opacity-60 group-hover/art:opacity-100"
                    style={{ backgroundColor: pTheme.glow }}
                  />

                  {/* High-Impact Project Graphic */}
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    animate={{
                      scale: isActive ? [1, 1.03, 1] : 1,
                      y: isActive ? [0, -3, 0] : 0,
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 w-full h-full object-cover rounded-2xl border border-white/15 shadow-2xl filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
                  />

                  {/* Play Video Badge Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/40 opacity-0 group-hover/art:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xl shadow-lg">
                      <HiPlay className="ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Project Title */}
                <h3
                  onClick={(e) => {
                    if (isActive && onOpenProject) {
                      e.stopPropagation();
                      onOpenProject(project);
                    }
                  }}
                  className="text-lg sm:text-xl font-black text-white tracking-tight mt-3 line-clamp-1 hover:text-cyan-300 transition-colors"
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-1 line-clamp-2 px-2">
                  {project.description}
                </p>
              </div>

              {/* Tech Badges */}
              <div className="relative z-10 flex flex-wrap justify-center gap-1.5 my-1.5">
                {project.tech.slice(0, 4).map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center text-[10px] sm:text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700/80 text-slate-300 backdrop-blur-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Feature Highlight */}
              {project.features && project.features.length > 0 && (
                <div className="relative z-10 flex items-center justify-center gap-1.5 my-1 text-xs text-emerald-300/90 font-medium">
                  <HiCheckCircle className="text-emerald-400 text-sm shrink-0" />
                  <span className="truncate max-w-[240px]">{project.features[0]}</span>
                </div>
              )}

              {/* Bottom Row: Action Buttons */}
              <div className="relative z-10 pt-2 flex items-center gap-2">
                {/* Acid-Yellow Plate (Signature Scrolltide Fan Deck Element) */}
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#e2f952] hover:bg-[#d4ed35] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md transform active:scale-98"
                >
                  <HiExternalLink className="text-sm" />
                  <span>Live Demo</span>
                </a>

                {/* Details Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenProject) onOpenProject(project);
                  }}
                  className="p-2.5 px-3 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                  title="View Details & Video"
                >
                  <HiPlay className="text-sm text-cyan-400" />
                  <span>Details</span>
                </button>

                {/* Code Link */}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center"
                  title="GitHub Repository"
                >
                  <HiCode className="text-base" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fan Deck Controls & Indicators */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 w-full max-w-2xl px-4">
        {/* Previous / Play / Next Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-1.5 rounded-full shadow-lg">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Previous Project"
          >
            <HiChevronLeft className="text-xl" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-[#e2f952] transition cursor-pointer"
            aria-label={isPlaying ? "Pause Rotation" : "Auto Play Rotation"}
          >
            {isPlaying ? (
              <HiPause className="text-lg text-[#e2f952]" />
            ) : (
              <HiPlay className="text-lg" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Next Project"
          >
            <HiChevronRight className="text-xl" />
          </button>
        </div>

        {/* Interactive Thumbnail Dots & Titles Track */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          {projects.map((project, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={project.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-slate-800 text-white border border-cyan-400 shadow-md shadow-cyan-500/20 scale-105"
                    : "bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-[#e2f952] animate-pulse" : "bg-slate-600"
                  }`}
                />
                <span className="truncate max-w-[90px] sm:max-w-[120px]">
                  {project.title.split(" - ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FanDeckProjects;
