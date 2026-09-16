import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  HiChevronLeft,
  HiChevronRight,
  HiPlay,
  HiPause,
  HiArrowRight,
  HiCheckCircle,
} from "react-icons/hi";

const themeColors = {
  cyan: {
    orb: "radial-gradient(circle at 50% 45%, rgba(34, 211, 238, 0.55), rgba(6, 182, 212, 0.2), transparent 70%)",
    glow: "rgba(6, 182, 212, 0.35)",
    border: "border-cyan-500/40",
    activeBorder: "border-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    barGrad: "from-cyan-500 via-teal-400 to-blue-500",
    metricText: "text-cyan-400",
    shadow: "0 25px 60px -15px rgba(6, 182, 212, 0.45)",
  },
  emerald: {
    orb: "radial-gradient(circle at 50% 45%, rgba(52, 211, 153, 0.55), rgba(16, 185, 129, 0.2), transparent 70%)",
    glow: "rgba(16, 185, 129, 0.35)",
    border: "border-emerald-500/40",
    activeBorder: "border-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    barGrad: "from-emerald-500 via-teal-400 to-cyan-500",
    metricText: "text-emerald-400",
    shadow: "0 25px 60px -15px rgba(16, 185, 129, 0.45)",
  },
  purple: {
    orb: "radial-gradient(circle at 50% 45%, rgba(217, 70, 239, 0.55), rgba(168, 85, 247, 0.2), transparent 70%)",
    glow: "rgba(168, 85, 247, 0.35)",
    border: "border-purple-500/40",
    activeBorder: "border-purple-400",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    barGrad: "from-purple-500 via-fuchsia-400 to-pink-500",
    metricText: "text-purple-400",
    shadow: "0 25px 60px -15px rgba(168, 85, 247, 0.45)",
  },
  amber: {
    orb: "radial-gradient(circle at 50% 45%, rgba(251, 191, 36, 0.55), rgba(245, 158, 11, 0.2), transparent 70%)",
    glow: "rgba(245, 158, 11, 0.35)",
    border: "border-amber-500/40",
    activeBorder: "border-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    barGrad: "from-amber-500 via-orange-400 to-yellow-400",
    metricText: "text-amber-400",
    shadow: "0 25px 60px -15px rgba(245, 158, 11, 0.45)",
  },
  rose: {
    orb: "radial-gradient(circle at 50% 45%, rgba(251, 113, 133, 0.55), rgba(244, 63, 94, 0.2), transparent 70%)",
    glow: "rgba(244, 63, 94, 0.35)",
    border: "border-rose-500/40",
    activeBorder: "border-rose-400",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    barGrad: "from-rose-500 via-pink-400 to-purple-500",
    metricText: "text-rose-400",
    shadow: "0 25px 60px -15px rgba(244, 63, 94, 0.45)",
  },
  sky: {
    orb: "radial-gradient(circle at 50% 45%, rgba(56, 189, 248, 0.55), rgba(14, 165, 233, 0.2), transparent 70%)",
    glow: "rgba(14, 165, 233, 0.35)",
    border: "border-sky-500/40",
    activeBorder: "border-sky-400",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    barGrad: "from-sky-500 via-blue-400 to-indigo-500",
    metricText: "text-sky-400",
    shadow: "0 25px 60px -15px rgba(14, 165, 233, 0.45)",
  },
};

const FanDeckSkills = ({ skills = [], onSelectSkill }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = skills.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay interval
  useEffect(() => {
    if (!isPlaying || total === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3600);
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

  const activeSkill = skills[activeIndex];
  const activeTheme = themeColors[activeSkill?.themeKey || "cyan"] || themeColors.cyan;

  return (
    <div className="relative w-full flex flex-col items-center select-none pt-4 pb-12">
      {/* Dynamic Ambient Background Aura */}
      <motion.div
        animate={{
          background: activeTheme.orb,
        }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[500px] pointer-events-none blur-3xl opacity-60 -z-10 rounded-full"
      />

      {/* Fan Deck Stage Container */}
      <div
        className="relative w-full max-w-4xl h-[570px] sm:h-[630px] flex items-center justify-center overflow-visible"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {skills.map((skill, index) => {
          let diff = index - activeIndex;

          // Shortest circular wrap
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          const isActive = diff === 0;
          const isVisible = Math.abs(diff) <= 2;
          const sTheme = themeColors[skill.themeKey || "cyan"] || themeColors.cyan;

          // Rotation angle and translation about shared bottom hinge
          const rotationAngle = diff * 15;
          const xOffset = diff * (typeof window !== "undefined" && window.innerWidth < 640 ? 45 : 95);
          const yOffset = Math.abs(diff) * (typeof window !== "undefined" && window.innerWidth < 640 ? 12 : 22) + (isActive ? -24 : 0);
          const scale = isActive ? 1.05 : Math.max(0.85, 1 - Math.abs(diff) * 0.08);
          const zIndex = 30 - Math.abs(diff) * 5;
          const opacity = isVisible ? (isActive ? 1 : Math.max(0.4, 0.95 - Math.abs(diff) * 0.25)) : 0;

          const tagsList = skill.tags || (skill.skills ? skill.skills.split(",").map((s) => s.trim()).slice(0, 3) : []);

          return (
            <motion.div
              key={skill.id || index}
              animate={{
                rotate: rotationAngle,
                x: xOffset,
                y: yOffset,
                scale,
                opacity,
                zIndex,
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
              }}
              onClick={() => {
                if (!isActive) {
                  setActiveIndex(index);
                } else if (onSelectSkill) {
                  onSelectSkill(skill);
                }
              }}
              className={`absolute w-[290px] sm:w-[350px] md:w-[370px] h-[490px] sm:h-[540px] rounded-[32px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden cursor-pointer backdrop-blur-xl border transition-all duration-500 shadow-2xl ${
                isActive
                  ? `bg-slate-950/95 ${sTheme.activeBorder} ring-1 ring-white/20`
                  : "bg-slate-900/85 border-slate-800 hover:border-slate-600 hover:opacity-100"
              }`}
            >
              {/* Inner Radial Aura in Center */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: sTheme.orb,
                  opacity: isActive ? 0.9 : 0.4,
                }}
              />

              {/* Top Row: Category Slug & Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm font-extrabold lowercase tracking-wider text-slate-300">
                  {skill.title.toLowerCase().split(" ")[0]}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold border backdrop-blur-md ${sTheme.badge}`}
                >
                  {skill.badge}
                </span>
              </div>

              {/* Center Artwork Orb & Visual Icon */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2 text-center">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
                  {/* Glowing Ambient Halo */}
                  <div
                    className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 opacity-60"
                    style={{ backgroundColor: sTheme.glow }}
                  />

                  {/* 3D Skill Hologram Badge */}
                  <motion.img
                    src={skill.image}
                    alt={skill.title}
                    animate={{
                      scale: isActive ? [1, 1.04, 1] : 1,
                      y: isActive ? [0, -4, 0] : 0,
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* Skill Title */}
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 line-clamp-1">
                  {skill.title}
                </h3>

                {/* Subtitle / Tagline */}
                <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 mt-1 px-2 leading-relaxed">
                  {skill.tagline || skill.skills}
                </p>

                {/* Feature Tags & Mastery Bar (Active Card) */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="w-full mt-3 px-2"
                  >
                    {/* Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-1 mb-2.5">
                      {tagsList.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700/60 text-[10px] font-mono text-slate-300"
                        >
                          <HiCheckCircle className="text-cyan-400 text-xs shrink-0" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>

                    {/* Mini Mastery Bar */}
                    <div className="w-full bg-slate-900/90 rounded-full h-2 overflow-hidden border border-slate-800 p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: skill.level || "90%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${sTheme.barGrad}`}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bottom Row: Acid-Yellow Plate (Signature Scrolltide Fan Deck Element) */}
              <div className="relative z-10 pt-2">
                {isActive ? (
                  <div className="w-full py-3 px-5 rounded-2xl bg-[#e2f952] hover:bg-[#d8f53a] text-slate-950 font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#e2f952]/20 hover:scale-[1.02] active:scale-98 cursor-pointer uppercase tracking-wider">
                    <span>{skill.metric || `${skill.level || "90%"} Mastery`}</span>
                    <HiArrowRight className="text-base" />
                  </div>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 font-mono text-xs text-center font-bold">
                    Click to Inspect
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Controls Bar (Previous, Autoplay, Pagination, Next) */}
      <div className="mt-8 flex items-center justify-center gap-3 z-20">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Skill"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800 hover:border-slate-700 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          <HiChevronLeft className="text-xl" />
        </button>

        {/* Play / Pause Auto Advance Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause Auto-advance" : "Play Auto-advance"}
          className={`h-10 px-3 sm:px-4 rounded-full border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
            isPlaying
              ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/30"
              : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          {isPlaying ? <HiPause className="text-sm" /> : <HiPlay className="text-sm" />}
          <span>{isPlaying ? "Autoplay ON" : "Autoplay"}</span>
        </button>

        {/* Pagination Indicator Pill */}
        <div className="px-4 py-2 rounded-full bg-slate-900/95 border border-slate-800 text-slate-200 font-mono text-xs sm:text-sm font-black shadow-inner tracking-wider">
          <span className="text-blue-400">{activeIndex + 1}</span>
          <span className="text-slate-500 mx-1.5">/</span>
          <span>{total}</span>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next Skill"
          className="w-10 h-10 rounded-full bg-white hover:bg-blue-600 hover:text-white text-slate-950 font-bold border border-white hover:border-blue-600 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          <HiChevronRight className="text-xl" />
        </button>
      </div>

      {/* Thumbnail Indicator Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {skills.map((_, dotIdx) => (
          <button
            key={dotIdx}
            onClick={() => setActiveIndex(dotIdx)}
            aria-label={`Jump to skill ${dotIdx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              dotIdx === activeIndex
                ? "w-8 bg-[#e2f952] shadow-sm shadow-[#e2f952]"
                : "w-2 bg-slate-800 hover:bg-slate-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FanDeckSkills;
