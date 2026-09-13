import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
    textGradient: "from-cyan-400 via-teal-300 to-blue-400",
    shadow: "0 25px 60px -15px rgba(6, 182, 212, 0.4)",
  },
  purple: {
    orb: "radial-gradient(circle at 50% 45%, rgba(217, 70, 239, 0.55), rgba(168, 85, 247, 0.2), transparent 70%)",
    glow: "rgba(168, 85, 247, 0.35)",
    border: "border-purple-500/40",
    activeBorder: "border-purple-400",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    textGradient: "from-purple-400 via-fuchsia-300 to-pink-400",
    shadow: "0 25px 60px -15px rgba(168, 85, 247, 0.4)",
  },
  emerald: {
    orb: "radial-gradient(circle at 50% 45%, rgba(52, 211, 153, 0.55), rgba(16, 185, 129, 0.2), transparent 70%)",
    glow: "rgba(16, 185, 129, 0.35)",
    border: "border-emerald-500/40",
    activeBorder: "border-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    textGradient: "from-emerald-400 via-teal-300 to-cyan-400",
    shadow: "0 25px 60px -15px rgba(16, 185, 129, 0.4)",
  },
  amber: {
    orb: "radial-gradient(circle at 50% 45%, rgba(251, 191, 36, 0.55), rgba(245, 158, 11, 0.2), transparent 70%)",
    glow: "rgba(245, 158, 11, 0.35)",
    border: "border-amber-500/40",
    activeBorder: "border-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    textGradient: "from-amber-400 via-orange-300 to-yellow-300",
    shadow: "0 25px 60px -15px rgba(245, 158, 11, 0.4)",
  },
  rose: {
    orb: "radial-gradient(circle at 50% 45%, rgba(251, 113, 133, 0.55), rgba(244, 63, 94, 0.2), transparent 70%)",
    glow: "rgba(244, 63, 94, 0.35)",
    border: "border-rose-500/40",
    activeBorder: "border-rose-400",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    textGradient: "from-rose-400 via-pink-300 to-purple-400",
    shadow: "0 25px 60px -15px rgba(244, 63, 94, 0.4)",
  },
  sky: {
    orb: "radial-gradient(circle at 50% 45%, rgba(56, 189, 248, 0.55), rgba(14, 165, 233, 0.2), transparent 70%)",
    glow: "rgba(14, 165, 233, 0.35)",
    border: "border-sky-500/40",
    activeBorder: "border-sky-400",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    textGradient: "from-sky-400 via-blue-300 to-indigo-400",
    shadow: "0 25px 60px -15px rgba(14, 165, 233, 0.4)",
  },
};

const FanDeckServices = ({ services = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = services.length;

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
    }, 3800);
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

  const activeService = services[activeIndex];
  const activeTheme = themeColors[activeService?.themeKey || "cyan"] || themeColors.cyan;

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
        className="relative w-full max-w-4xl h-[560px] sm:h-[620px] flex items-center justify-center overflow-visible"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {services.map((service, index) => {
          // Calculate angular distance and offset from activeIndex
          let diff = index - activeIndex;

          // Shortest wrap calculation for circular fan
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          const isActive = diff === 0;
          const isVisible = Math.abs(diff) <= 2;
          const sTheme = themeColors[service.themeKey || "cyan"] || themeColors.cyan;

          // Calculate fan rotation and translation around shared hinge below deck
          // Each card rotates about pivot (50% 125%)
          const rotationAngle = diff * 15; // 15 deg per card spread
          const xOffset = diff * (typeof window !== "undefined" && window.innerWidth < 640 ? 45 : 95);
          const yOffset = Math.abs(diff) * (typeof window !== "undefined" && window.innerWidth < 640 ? 12 : 22) + (isActive ? -24 : 0);
          const scale = isActive ? 1.05 : Math.max(0.85, 1 - Math.abs(diff) * 0.08);
          const zIndex = 30 - Math.abs(diff) * 5;
          const opacity = isVisible ? (isActive ? 1 : Math.max(0.4, 0.95 - Math.abs(diff) * 0.25)) : 0;

          return (
            <motion.div
              key={service.id || index}
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
                }
              }}
              className={`absolute w-[290px] sm:w-[350px] md:w-[370px] h-[480px] sm:h-[530px] rounded-[32px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden cursor-pointer backdrop-blur-xl border transition-all duration-500 shadow-2xl ${
                isActive
                  ? `bg-slate-950/95 ${sTheme.activeBorder} ring-1 ring-white/20`
                  : "bg-slate-900/85 border-slate-800 hover:border-slate-600 hover:opacity-100"
              }`}
            >
              {/* Inner Radial Aura in Center (Scrolltide Dusk/Glass style) */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: sTheme.orb,
                  opacity: isActive ? 0.9 : 0.4,
                }}
              />

              {/* Top Row: Category Slug & Service Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm font-extrabold lowercase tracking-wider text-slate-300">
                  {service.slug || service.title.toLowerCase().split(" ")[0]}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold border backdrop-blur-md ${sTheme.badge}`}
                >
                  {service.badge}
                </span>
              </div>

              {/* Center Artwork Orb & Visual Icon */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2 text-center">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
                  {/* Glowing Ambient Halo */}
                  <div
                    className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 opacity-60 group-hover:opacity-100"
                    style={{ backgroundColor: sTheme.glow }}
                  />

                  {/* 3D Service Hologram Badge */}
                  <motion.img
                    src={service.image}
                    alt={service.title}
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

                {/* Service Main Title */}
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2 line-clamp-1">
                  {service.title}
                </h3>

                {/* Micro Description */}
                <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 mt-1 px-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Deliverables / Feature Pills (Active Card only) */}
                {isActive && service.deliverables && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex flex-wrap items-center justify-center gap-1.5 mt-3"
                  >
                    {service.deliverables.slice(0, 3).map((item, dIdx) => (
                      <span
                        key={dIdx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700/60 text-[10px] sm:text-[11px] font-mono text-slate-300"
                      >
                        <HiCheckCircle className="text-cyan-400 text-xs shrink-0" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Bottom Row: Acid-Yellow Plate CTA Button (Signature Scrolltide Fan Deck Element) */}
              <div className="relative z-10 pt-2">
                {isActive ? (
                  <Link
                    to="/contact"
                    className="w-full py-3 px-5 rounded-2xl bg-[#e2f952] hover:bg-[#d8f53a] text-slate-950 font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#e2f952]/20 hover:scale-[1.02] active:scale-98 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Request Service</span>
                    <HiArrowRight className="text-base" />
                  </Link>
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

      {/* Interactive Controls Bar (Previous, Pagination, Play/Pause, Next) */}
      <div className="mt-8 flex items-center justify-center gap-3 z-20">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Service"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800 hover:border-slate-700 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          <HiChevronLeft className="text-xl" />
        </button>

        {/* Play / Pause Auto Advance Toggle Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause Auto-play" : "Play Auto-play"}
          className={`h-10 px-3 sm:px-4 rounded-full border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
            isPlaying
              ? "bg-[#e2f952]/20 border-[#e2f952]/50 text-[#e2f952]"
              : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          {isPlaying ? <HiPause className="text-sm" /> : <HiPlay className="text-sm" />}
          <span>{isPlaying ? "Autoplay ON" : "Autoplay"}</span>
        </button>

        {/* Pagination Indicator Pill (e.g. 2 / 6) */}
        <div className="px-4 py-2 rounded-full bg-slate-900/95 border border-slate-800 text-slate-200 font-mono text-xs sm:text-sm font-black shadow-inner tracking-wider">
          <span className="text-[#e2f952]">{activeIndex + 1}</span>
          <span className="text-slate-500 mx-1.5">/</span>
          <span>{total}</span>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next Service"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-[#e2f952] text-slate-950 font-bold border border-white hover:border-[#e2f952] flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          <HiChevronRight className="text-xl" />
        </button>
      </div>

      {/* Thumbnail Dot Navigation Bar */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {services.map((_, dotIdx) => (
          <button
            key={dotIdx}
            onClick={() => setActiveIndex(dotIdx)}
            aria-label={`Jump to service ${dotIdx + 1}`}
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

export default FanDeckServices;
