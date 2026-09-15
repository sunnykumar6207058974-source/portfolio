import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Generates an SVG path for the Scrolltide "Card Bookmark" silhouette
 * - Top-left stepped shoulder transitioning UP to an elevated bookmark tab
 * - Bottom-right bite notch with smooth fillet transitions
 */
function generateBookmarkPath(w, h) {
  if (w <= 0 || h <= 0) return "";
  const r = 22; // main outer corner radius
  const stepH = 18; // top shoulder drop height
  const stepW = Math.min(Math.round(w * 0.28), 125); // left shoulder width
  const f = 11; // fillet transition radius
  const biteH = 20; // bottom bite height
  const biteW = Math.min(Math.round(w * 0.26), 115); // bottom bite width from right
  const pad = 1.5; // inner stroke boundary offset

  return [
    `M ${pad},${stepH + r}`,
    // Top-left shoulder corner
    `A ${r},${r} 0 0,1 ${r + pad},${stepH}`,
    // Top-left shoulder flat
    `L ${stepW - f},${stepH}`,
    // Concave fillet into step
    `A ${f},${f} 0 0,0 ${stepW},${stepH - f}`,
    // Step vertical wall
    `L ${stepW},${f + pad}`,
    // Convex fillet into main tab top
    `A ${f},${f} 0 0,1 ${stepW + f},${pad}`,
    // Main tab top horizontal edge
    `L ${w - r - pad},${pad}`,
    // Top-right corner
    `A ${r},${r} 0 0,1 ${w - pad},${r + pad}`,
    // Right vertical edge down to bite notch
    `L ${w - pad},${h - biteH - r}`,
    // Bite top-right corner
    `A ${r},${r} 0 0,1 ${w - r - pad},${h - biteH}`,
    // Bite ceiling
    `L ${w - biteW + f},${h - biteH}`,
    // Concave fillet at inside corner of bite
    `A ${f},${f} 0 0,0 ${w - biteW},${h - biteH + f}`,
    // Bite vertical left edge down to bottom floor
    `L ${w - biteW},${h - f - pad}`,
    // Convex fillet into bottom floor
    `A ${f},${f} 0 0,1 ${w - biteW - f},${h - pad}`,
    // Bottom floor
    `L ${r + pad},${h - pad}`,
    // Bottom-left corner
    `A ${r},${r} 0 0,1 ${pad},${h - r - pad}`,
    // Close back to top-left
    `Z`,
  ].join(" ");
}

const themeConfigs = {
  cyan: {
    strokeRest: "#1e293b",
    strokeHover: "url(#cyanGrad)",
    shadowHover: "0 22px 60px -15px rgba(6, 182, 212, 0.45)",
    glowColor: "rgba(6, 182, 212, 0.4)",
    radialBloom: "radial-gradient(circle at 50% 40%, rgba(6, 182, 212, 0.45), rgba(20, 184, 166, 0.15), transparent 70%)",
    dotMain: "bg-cyan-400",
    dotSub: "bg-cyan-600/40",
    metricText: "text-cyan-400",
    barGrad: "from-cyan-500 via-teal-400 to-blue-500",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-300",
    tagBg: "bg-cyan-950/40 border-cyan-800/40 text-cyan-300",
  },
  emerald: {
    strokeRest: "#1e293b",
    strokeHover: "url(#emeraldGrad)",
    shadowHover: "0 22px 60px -15px rgba(16, 185, 129, 0.45)",
    glowColor: "rgba(16, 185, 129, 0.4)",
    radialBloom: "radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.45), rgba(5, 150, 105, 0.15), transparent 70%)",
    dotMain: "bg-emerald-400",
    dotSub: "bg-emerald-600/40",
    metricText: "text-emerald-400",
    barGrad: "from-emerald-500 via-teal-400 to-cyan-500",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-300",
    tagBg: "bg-emerald-950/40 border-emerald-800/40 text-emerald-300",
  },
  purple: {
    strokeRest: "#1e293b",
    strokeHover: "url(#purpleGrad)",
    shadowHover: "0 22px 60px -15px rgba(168, 85, 247, 0.45)",
    glowColor: "rgba(168, 85, 247, 0.4)",
    radialBloom: "radial-gradient(circle at 50% 40%, rgba(168, 85, 247, 0.45), rgba(217, 70, 239, 0.15), transparent 70%)",
    dotMain: "bg-purple-400",
    dotSub: "bg-purple-600/40",
    metricText: "text-purple-400",
    barGrad: "from-purple-500 via-fuchsia-400 to-pink-500",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-300",
    tagBg: "bg-purple-950/40 border-purple-800/40 text-purple-300",
  },
  amber: {
    strokeRest: "#1e293b",
    strokeHover: "url(#amberGrad)",
    shadowHover: "0 22px 60px -15px rgba(245, 158, 11, 0.45)",
    glowColor: "rgba(245, 158, 11, 0.4)",
    radialBloom: "radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.45), rgba(249, 115, 22, 0.15), transparent 70%)",
    dotMain: "bg-amber-400",
    dotSub: "bg-amber-600/40",
    metricText: "text-amber-400",
    barGrad: "from-amber-500 via-orange-400 to-yellow-400",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-300",
    tagBg: "bg-amber-950/40 border-amber-800/40 text-amber-300",
  },
  rose: {
    strokeRest: "#1e293b",
    strokeHover: "url(#roseGrad)",
    shadowHover: "0 22px 60px -15px rgba(244, 63, 94, 0.45)",
    glowColor: "rgba(244, 63, 94, 0.4)",
    radialBloom: "radial-gradient(circle at 50% 40%, rgba(244, 63, 94, 0.45), rgba(225, 29, 72, 0.15), transparent 70%)",
    dotMain: "bg-rose-400",
    dotSub: "bg-rose-600/40",
    metricText: "text-rose-400",
    barGrad: "from-rose-500 via-pink-400 to-purple-500",
    badgeBorder: "border-rose-500/30",
    badgeText: "text-rose-300",
    tagBg: "bg-rose-950/40 border-rose-800/40 text-rose-300",
  },
  sky: {
    strokeRest: "#1e293b",
    strokeHover: "url(#skyGrad)",
    shadowHover: "0 22px 60px -15px rgba(14, 165, 233, 0.45)",
    glowColor: "rgba(14, 165, 233, 0.4)",
    radialBloom: "radial-gradient(circle at 50% 40%, rgba(14, 165, 233, 0.45), rgba(99, 102, 241, 0.15), transparent 70%)",
    dotMain: "bg-sky-400",
    dotSub: "bg-sky-600/40",
    metricText: "text-sky-400",
    barGrad: "from-sky-500 via-blue-400 to-indigo-500",
    badgeBorder: "border-sky-500/30",
    badgeText: "text-sky-300",
    tagBg: "bg-sky-950/40 border-sky-800/40 text-sky-300",
  },
};

const BookmarkSkillCard = ({ skill, index }) => {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 380, h: 560 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDims({
          w: Math.round(rect.width),
          h: Math.round(rect.height),
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const themeKey = skill.themeKey || (["cyan", "emerald", "purple", "amber", "rose", "sky"][index % 6]);
  const theme = themeConfigs[themeKey] || themeConfigs.cyan;
  const pathD = generateBookmarkPath(dims.w, dims.h);
  const clipId = `bookmark-clip-${skill.id || index}`;

  // Tag list parsing
  const tagsList = skill.tags || (skill.skills ? skill.skills.split(",").map((s) => s.trim()).slice(0, 4) : []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="group relative select-none cursor-pointer flex flex-col justify-between transition-transform duration-500"
      style={{
        filter: isHovered ? `drop-shadow(${theme.shadowHover})` : "none",
        transition: "filter 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* SVG ClipPath Definition & Background Canvas */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={pathD} />
          </clipPath>

          <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>

          <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          <linearGradient id="roseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* Deep dark card gradient */}
          <linearGradient id={`cardBodyGrad-${index}`} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#0c111c" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
        </defs>

        {/* Card Background fill (smooth clipped to bookmark silhouette) */}
        <path
          d={pathD}
          fill={`url(#cardBodyGrad-${index})`}
          className="transition-colors duration-500"
        />

        {/* Card Outline Stroke (Scrolltide Bookmark + Bite shape) */}
        <path
          d={pathD}
          fill="none"
          stroke={isHovered ? theme.strokeHover : "#1e293b"}
          strokeWidth={isHovered ? "2" : "1.5"}
          className="transition-all duration-300"
        />
      </svg>

      {/* Card Content Container (Clipped exactly to Bookmark shape) */}
      <div
        className="relative z-10 p-4 sm:p-5 flex flex-col justify-between h-full"
        style={{ clipPath: `url(#${clipId})` }}
      >
        {/* Top Header Row in the Bookmark Tab */}
        <div className="flex items-center justify-between pt-0.5 pb-2 mb-1.5">
          {/* Left Stepped Shoulder Accent Label */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${theme.dotMain} shadow-sm animate-pulse`} />
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
              {skill.badge || "Core Skill"}
            </span>
          </div>

          {/* Right Elevated Tab Signature Tag */}
          <div className="text-right">
            <span className="text-[11px] sm:text-xs font-mono font-medium tracking-wide text-slate-400 group-hover:text-white transition-colors duration-300">
              {skill.brandTag || `— ${skill.title}®`}
            </span>
          </div>
        </div>

        {/* Inner Artwork Window (Scrolltide Bloom & Dissolve Effect) - SLEEK COMPACT BANNER */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 h-36 sm:h-44 w-full flex items-center justify-center mb-3.5 group/media shadow-inner">
          {/* Background Ambient Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-20 group-hover:opacity-100"
            style={{ background: theme.radialBloom }}
          />

          {/* Dissolve Glow Backdrop Layer */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-0 group-hover:opacity-75 blur-xl scale-110"
            style={{
              backgroundColor: theme.glowColor,
            }}
          />

          {/* Centered Skill Artwork Image */}
          <img
            src={skill.image}
            alt={skill.title}
            loading="lazy"
            decoding="async"
            className="relative z-10 w-full h-full object-cover transform transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 group-hover:contrast-115 group-hover:brightness-110"
          />

          {/* Saturated Dissolve Blend Layer */}
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-40 mix-blend-color-dodge"
            style={{ backgroundColor: theme.glowColor }}
          />

          {/* Bottom Micro-Caption inside Artwork Frame */}
          <div className="absolute inset-x-0 bottom-0 z-30 p-2.5 pt-4 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent">
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide line-clamp-1 group-hover:text-white transition-colors">
              {skill.tagline || skill.skills}
            </p>
          </div>
        </div>

        {/* Card Body Information */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Main Skill Title */}
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mb-1.5 group-hover:text-cyan-300 transition-colors duration-300">
              {skill.title}
            </h3>

            {/* Description / Summary */}
            <p className="text-xs sm:text-[13px] text-slate-400 font-medium leading-relaxed mb-3 line-clamp-1 sm:line-clamp-2">
              {skill.skills}
            </p>

            {/* Micro Tech Badges */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tagsList.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className={`text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md border backdrop-blur-xs transition-colors duration-300 ${theme.tagBg}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Mastery Progress Bar */}
          <div className="mb-2.5">
            <div className="flex justify-between items-center mb-1 text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                Mastery Level
              </span>
              <span className={`font-mono font-extrabold ${theme.metricText}`}>
                {skill.level || "90%"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: skill.level || "90%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className={`h-full rounded-full bg-gradient-to-r ${theme.barGrad} shadow-sm`}
              />
            </div>
          </div>
        </div>

        {/* Bottom Lower Floor: Three Dots & Main Bold Callout */}
        <div className="flex items-end justify-between pt-1">
          {/* Bottom-left Three Signature Scrolltide Dots (•••) */}
          <div className="flex items-center gap-1.5 pb-0.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${theme.dotMain} shadow-md transition-all duration-300 group-hover:scale-125`}
            />
            <span
              className={`w-2 h-2 rounded-full ${theme.dotSub} transition-opacity duration-300 group-hover:opacity-80`}
            />
            <span
              className={`w-2 h-2 rounded-full ${theme.dotSub} opacity-40 transition-opacity duration-300 group-hover:opacity-60`}
            />
          </div>

          {/* Large Bold Metric / Callout */}
          <div className="text-right pr-2">
            <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
              {skill.metric || skill.level}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookmarkSkillCard;
