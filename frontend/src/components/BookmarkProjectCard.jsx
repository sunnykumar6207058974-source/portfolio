import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiPlay,
  HiExternalLink,
  HiCode,
  HiCheckCircle,
} from "react-icons/hi";

/**
 * Generates an SVG path for the Scrolltide "Card Bookmark" silhouette
 * - Top-left stepped shoulder transitioning UP to an elevated bookmark tab
 * - Bottom-right bite notch with smooth fillet transitions
 */
function generateBookmarkPath(w, h) {
  if (w <= 0 || h <= 0) return "";
  const r = 24; // main outer corner radius
  const stepH = 22; // top shoulder drop height
  const stepW = Math.min(Math.round(w * 0.30), 125); // left shoulder width
  const f = 13; // fillet transition radius
  const biteH = 26; // bottom bite height
  const biteW = Math.min(Math.round(w * 0.28), 120); // bottom bite width from right
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

const projectThemeConfigs = {
  emerald: {
    strokeHover: "url(#emeraldProjGrad)",
    shadowHover: "0 24px 60px -15px rgba(16, 185, 129, 0.45)",
    glowColor: "rgba(16, 185, 129, 0.35)",
    radialBloom:
      "radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.45), rgba(5, 150, 105, 0.15), transparent 70%)",
    dotMain: "bg-emerald-400",
    dotSub: "bg-emerald-600/40",
    accentText: "text-emerald-400 group-hover:text-emerald-300",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-300",
    tagBg: "bg-emerald-950/40 border-emerald-800/40 text-emerald-300",
    btnGrad: "from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20",
  },
  purple: {
    strokeHover: "url(#purpleProjGrad)",
    shadowHover: "0 24px 60px -15px rgba(168, 85, 247, 0.45)",
    glowColor: "rgba(168, 85, 247, 0.35)",
    radialBloom:
      "radial-gradient(circle at 50% 40%, rgba(168, 85, 247, 0.45), rgba(217, 70, 239, 0.15), transparent 70%)",
    dotMain: "bg-purple-400",
    dotSub: "bg-purple-600/40",
    accentText: "text-purple-400 group-hover:text-purple-300",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-300",
    tagBg: "bg-purple-950/40 border-purple-800/40 text-purple-300",
    btnGrad: "from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-fuchsia-400 text-slate-950 shadow-purple-500/20",
  },
  cyan: {
    strokeHover: "url(#cyanProjGrad)",
    shadowHover: "0 24px 60px -15px rgba(6, 182, 212, 0.45)",
    glowColor: "rgba(6, 182, 212, 0.35)",
    radialBloom:
      "radial-gradient(circle at 50% 40%, rgba(6, 182, 212, 0.45), rgba(20, 184, 166, 0.15), transparent 70%)",
    dotMain: "bg-cyan-400",
    dotSub: "bg-cyan-600/40",
    accentText: "text-cyan-400 group-hover:text-cyan-300",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-300",
    tagBg: "bg-cyan-950/40 border-cyan-800/40 text-cyan-300",
    btnGrad: "from-cyan-500 via-teal-400 to-blue-500 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-cyan-500/20",
  },
  amber: {
    strokeHover: "url(#amberProjGrad)",
    shadowHover: "0 24px 60px -15px rgba(245, 158, 11, 0.45)",
    glowColor: "rgba(245, 158, 11, 0.35)",
    radialBloom:
      "radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.45), rgba(249, 115, 22, 0.15), transparent 70%)",
    dotMain: "bg-amber-400",
    dotSub: "bg-amber-600/40",
    accentText: "text-amber-400 group-hover:text-amber-300",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-300",
    tagBg: "bg-amber-950/40 border-amber-800/40 text-amber-300",
    btnGrad: "from-amber-400 via-orange-500 to-yellow-400 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-amber-500/20",
  },
  rose: {
    strokeHover: "url(#roseProjGrad)",
    shadowHover: "0 24px 60px -15px rgba(244, 63, 94, 0.45)",
    glowColor: "rgba(244, 63, 94, 0.35)",
    radialBloom:
      "radial-gradient(circle at 50% 40%, rgba(244, 63, 94, 0.45), rgba(225, 29, 72, 0.15), transparent 70%)",
    dotMain: "bg-rose-400",
    dotSub: "bg-rose-600/40",
    accentText: "text-rose-400 group-hover:text-rose-300",
    badgeBorder: "border-rose-500/30",
    badgeText: "text-rose-300",
    tagBg: "bg-rose-950/40 border-rose-800/40 text-rose-300",
    btnGrad: "from-rose-500 via-pink-500 to-purple-500 hover:from-rose-400 hover:to-pink-400 text-slate-950 shadow-rose-500/20",
  },
};

const BookmarkProjectCard = ({
  project,
  index,
  onOpenDetails,
  isHoveredVideo,
  onHoverStart,
  onHoverEnd,
}) => {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 480, h: 680 });
  const [isCardHovered, setIsCardHovered] = useState(false);

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

  // Theme resolution
  const fallbackThemes = ["emerald", "purple", "cyan", "amber", "rose"];
  const themeKey = project.themeKey || fallbackThemes[index % fallbackThemes.length];
  const theme = projectThemeConfigs[themeKey] || projectThemeConfigs.cyan;
  const pathD = generateBookmarkPath(dims.w, dims.h);
  const clipId = `proj-bookmark-clip-${project.id || index}`;

  // Brand tag resolution (e.g. — Cartify®)
  const brandTag =
    project.brandTag ||
    `— ${project.title.split(" - ")[0].split(" ")[0]}®`;

  // Status/Index badge
  const indexStr = String(index + 1).padStart(2, "0");
  const calloutMetric = project.metric || `${indexStr} // ${project.category.toUpperCase()}`;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      onMouseEnter={() => {
        setIsCardHovered(true);
        if (onHoverStart) onHoverStart();
      }}
      onMouseLeave={() => {
        setIsCardHovered(false);
        if (onHoverEnd) onHoverEnd();
      }}
      whileHover={{ y: -7 }}
      className="group relative select-none flex flex-col justify-between transition-transform duration-500 min-h-[640px]"
      style={{
        filter: isCardHovered ? `drop-shadow(${theme.shadowHover})` : "none",
        transition:
          "filter 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* SVG Outline & Dark Gradient Background */}
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

          <linearGradient id="emeraldProjGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="purpleProjGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          <linearGradient id="cyanProjGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>

          <linearGradient id="amberProjGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          <linearGradient id="roseProjGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* Deep card dark gradient backdrop */}
          <linearGradient
            id={`projCardGrad-${index}`}
            x1="0"
            y1="0"
            x2="0.3"
            y2="1"
          >
            <stop offset="0%" stopColor="#0c111c" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
        </defs>

        {/* Card Background Fill */}
        <path
          d={pathD}
          fill={`url(#projCardGrad-${index})`}
          className="transition-colors duration-500"
        />

        {/* Card Silhouette Border Stroke */}
        <path
          d={pathD}
          fill="none"
          stroke={isCardHovered ? theme.strokeHover : "#1e293b"}
          strokeWidth={isCardHovered ? "2" : "1.5"}
          className="transition-all duration-300"
        />
      </svg>

      {/* Card Content clipped to bookmark silhouette */}
      <div
        className="relative z-10 p-5 sm:p-7 flex flex-col justify-between h-full"
        style={{ clipPath: `url(#${clipId})` }}
      >
        {/* Top Header Row on Elevated Bookmark Tab */}
        <div className="flex items-center justify-between pt-1 pb-3 mb-2">
          {/* Left Stepped Shoulder Category / Status */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${theme.dotMain} shadow-sm animate-pulse`}
            />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
              {project.category}
            </span>
          </div>

          {/* Right Elevated Tab Signature Tag */}
          <div className="text-right">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-wide text-slate-400 group-hover:text-white transition-colors duration-300">
              {brandTag}
            </span>
          </div>
        </div>

        {/* Inner Artwork / Video Frame (Scrolltide Bloom & Dissolve Effect) */}
        <div
          onClick={() => onOpenDetails && onOpenDetails(project)}
          className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 aspect-[16/10] sm:aspect-[16/9.5] flex items-center justify-center mb-5 group/media shadow-inner cursor-pointer"
        >
          {/* Ambient Radial Bloom Glow */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-25 group-hover:opacity-100"
            style={{ background: theme.radialBloom }}
          />

          {/* Dissolve Glow Backdrop */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-0 group-hover:opacity-75 blur-xl scale-110"
            style={{ backgroundColor: theme.glowColor }}
          />

          {/* Media Content: Video on hover, else High-res Image */}
          {isHoveredVideo ? (
            <video
              src={project.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="relative z-10 w-full h-full object-cover transition-transform duration-700"
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="relative z-10 w-full h-full object-cover transform transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 group-hover:contrast-115 group-hover:brightness-110"
            />
          )}

          {/* Saturated Dissolve Blend Layer */}
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-35 mix-blend-color-dodge"
            style={{ backgroundColor: theme.glowColor }}
          />

          {/* Play Icon Pill Overlay */}
          <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
            <div className="w-13 h-13 rounded-full bg-slate-950/80 border border-white/20 text-white flex items-center justify-center text-2xl shadow-2xl transform group-hover:scale-110 transition duration-300">
              <HiPlay className="ml-1 text-white" />
            </div>
          </div>

          {/* Bottom Micro-Caption inside Artwork Frame */}
          <div className="absolute inset-x-0 bottom-0 z-30 p-3 pt-6 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent">
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide line-clamp-1 group-hover:text-white transition-colors">
              {project.features && project.features.length > 0
                ? project.features[0]
                : project.description}
            </p>
          </div>
        </div>

        {/* Project Information */}
        <div className="flex-1 flex flex-col justify-between mb-3">
          <div>
            {/* Project Title */}
            <h3
              onClick={() => onOpenDetails && onOpenDetails(project)}
              className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2.5 group-hover:text-cyan-300 transition-colors duration-300 cursor-pointer line-clamp-1"
            >
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech.map((t, tIdx) => (
                <span
                  key={tIdx}
                  className={`text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-md border backdrop-blur-xs transition-colors duration-300 ${theme.tagBg}`}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Key Deliverable Highlights */}
            {project.features && project.features.length > 1 && (
              <div className="space-y-1 mb-5">
                {project.features.slice(0, 2).map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center gap-1.5 text-xs text-slate-300"
                  >
                    <HiCheckCircle className="text-emerald-400 text-sm shrink-0" />
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
            {/* Live Demo Primary */}
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 bg-gradient-to-r ${theme.btnGrad} font-extrabold py-2.5 px-3.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md`}
              title="Open Live App"
            >
              <HiExternalLink className="text-sm" />
              <span>Live Demo</span>
            </a>

            {/* Details Modal Trigger */}
            <button
              onClick={() => onOpenDetails && onOpenDetails(project)}
              className="p-2.5 px-3 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
              title="View Highlights & Video Player"
            >
              <HiPlay className="text-sm text-cyan-400" />
              <span>Details</span>
            </button>

            {/* GitHub Repo Link */}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white transition flex items-center justify-center"
              title="View GitHub Source Code"
            >
              <HiCode className="text-base" />
            </a>
          </div>
        </div>

        {/* Bottom Lower Floor: Three Dots & Bite Notch Metric Callout */}
        <div className="flex items-end justify-between pt-2">
          {/* Bottom-left Three Signature Scrolltide Dots (•••) */}
          <div className="flex items-center gap-1.5 pb-1">
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

          {/* Large Bold Metric / Signature in Bite Notch */}
          <div className="text-right pr-2">
            <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
              {calloutMetric}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookmarkProjectCard;
