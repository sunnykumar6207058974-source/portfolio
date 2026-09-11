import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiPlay, HiExternalLink, HiCode, HiSparkles, HiRefresh } from "react-icons/hi";
import { apiGetProjects } from "../services/api";
import { trackProjectView } from "../utils/analytics";

import cartifyImg from "../assets/projects/cartify.jpg";
import urbanthreadImg from "../assets/projects/urbanthread.jpg";
import pixelforgeImg from "../assets/projects/pixelforge.jpg";
import aetheriaImg from "../assets/projects/aetheria.jpg";

const defaultProjects = [
  {
    id: 1,
    _id: "1",
    category: "E-Commerce",
    image: cartifyImg,
    title: "Cartify - Premium E-Commerce Shopping Platform",
    description:
      "A premium e-commerce platform offering smooth shopping experiences, product categories, interactive cart checkout, dark mode toggle, and instant dispatch tracking.",
    tech: ["React", "Node.js", "Tailwind CSS", "MongoDB", "Express"],
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    demoUrl: "https://cartify-store-amber.vercel.app",
    githubUrl: "https://github.com/sunnykumar6207058974-source/Cartify",
    features: [
      "Interactive Shopping Cart & Express Checkout",
      "Category Filters & Product Search Bar",
      "Dark / Light Theme & 24/7 Express Support",
    ],
  },
  {
    id: 2,
    _id: "2",
    category: "E-Commerce",
    image: urbanthreadImg,
    title: "UrbanThread - Luxe Sneakers & Streetwear Drops",
    description:
      "A high-end streetwear e-commerce platform featuring exclusive sneaker drops, flash sales, promo code discount engine, wishlist, and admin dashboard.",
    tech: ["React", "Tailwind CSS", "Redux", "REST API", "Vite"],
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    demoUrl: "https://urban-thread-sand.vercel.app",
    githubUrl: "https://github.com/sunnykumar6207058974-source/UrbanThread",
    features: [
      "Sneakerhead Drops & Flash Deal Banners",
      "Promo Code Discount Engine (SNEAKER20)",
      "Wishlist, Cart Drawer & Admin Analytics Dashboard",
    ],
  },
  {
    id: 3,
    _id: "3",
    category: "Web Apps",
    image: pixelforgeImg,
    title: "PixelForge - Developer Portfolio & Digital Showcase",
    description:
      "A futuristic developer portfolio featuring interactive canvas particle network, animated typing hero, project demo video popups, custom cursor, and printable resume viewer.",
    tech: ["React", "Framer Motion", "Tailwind CSS", "HTML5 Canvas", "Vite"],
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    demoUrl: "https://pixelforge-dev.vercel.app",
    githubUrl: "https://github.com/sunnykumar6207058974-source/PixelForge",
    features: [
      "Interactive 3D Matrix Canvas Particle Grid",
      "Video Lightbox Player with Framer Motion Dialog",
      "Executive Resume Printable PDF & Dynamic Dark Theme",
    ],
  },
  {
    id: 4,
    _id: "4",
    category: "WebGL 3D",
    image: aetheriaImg,
    title: "Aetheria - WebGL 3D Matrix Interactive Experience",
    description:
      "A cutting-edge WebGL 3D interactive matrix showcase with particle physics, bloom post-processing, spatial audio, and camera pan animations.",
    tech: ["Three.js", "WebGL", "GSAP", "Tailwind CSS", "Node.js"],
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    demoUrl: "https://aetheria-matrix.vercel.app",
    githubUrl: "https://github.com/sunnykumar6207058974-source/Aetheria",
    features: [
      "Real-time Three.js Particle Physics Engine",
      "Post-Processing Bloom Filters & Spatial Audio",
      "Zero-Trust API Architecture & Ultra Fast Load (<0.8s)",
    ],
  },
];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [projects, setProjects] = useState(defaultProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    trackProjectView(project.id || project._id, project.title);
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    const res = await apiGetProjects();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      // Map API project image fallback if local
      const mapped = res.data.map((p, idx) => {
        let img = p.image;
        if (!img || img.startsWith("/assets/projects/")) {
          const fallback = defaultProjects[idx % defaultProjects.length];
          img = fallback ? fallback.image : cartifyImg;
        }
        return { ...p, id: p.id || p._id || idx + 1, image: img };
      });
      setProjects(mapped);
    } else if (!res.success) {
      setError(res.error || "Could not connect to Projects API");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = ["All", "E-Commerce", "Web Apps", "WebGL 3D"];

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <section
      id="portfolio"
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-4 sm:px-6 py-20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <p className="text-cyan-600 dark:text-cyan-400 text-lg font-semibold flex items-center justify-center gap-2">
            <HiSparkles className="text-xl" />
            My Projects
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-3 text-slate-900 dark:text-white tracking-tight">
            Featured
            <span className="block bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 dark:from-cyan-400 dark:via-teal-300 dark:to-purple-500 bg-clip-text text-transparent">
              Projects & Showcase
            </span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Explore my top 4 featured web applications: Cartify, UrbanThread, PixelForge, and Aetheria. Hover to play demo previews or click to view details.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 scale-105"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500 dark:hover:border-cyan-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <motion.div layout className="grid md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden group hover:border-cyan-500 dark:hover:border-cyan-400 hover:-translate-y-2 transition-all duration-300 shadow-xl dark:shadow-none flex flex-col justify-between"
              >
                {/* Image & Video Hover Container */}
                <div
                  className="overflow-hidden h-64 sm:h-72 relative cursor-pointer bg-slate-950"
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  onClick={() => handleOpenProject(project)}
                >
                  {hoveredProjectId === project.id ? (
                    <video
                      src={project.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover transition duration-500"
                    />
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                  )}

                  {/* Play Overlay Icon */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center text-3xl shadow-xl shadow-cyan-500/50 transform group-hover:scale-110 transition duration-300">
                      <HiPlay className="ml-1" />
                    </div>
                  </div>

                  <span className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    {project.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">
                      {project.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((t, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2.5 pt-5 border-t border-slate-100 dark:border-slate-800/80">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-2.5 px-3.5 rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
                      title="Open Live Project"
                    >
                      <HiExternalLink className="text-base" />
                      Live Demo
                    </a>

                    <button
                      onClick={() => handleOpenProject(project)}
                      className="p-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition cursor-pointer flex items-center gap-1.5 text-sm font-medium"
                      title="View Details & Highlights"
                    >
                      <HiPlay className="text-base text-cyan-500" />
                      <span>Details</span>
                    </button>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
                      title="View GitHub Repository"
                    >
                      <HiCode className="text-lg" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Video Preview & Details Modal Popup */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden z-10 my-auto"
              >
                {/* Modal Header Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {selectedProject.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500 transition cursor-pointer"
                  >
                    <HiX className="text-xl" />
                  </button>
                </div>

                {/* Modal Main Banner Image */}
                <div className="relative bg-slate-950 h-64 sm:h-80 w-full overflow-hidden">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Modal Info & Feature Highlights */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                      About Project
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Feature Highlights */}
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
                      Key Highlights & Architecture:
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {selectedProject.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="text-cyan-500 font-bold">✔</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer CTAs */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((tech, i) => (
                        <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md shadow-cyan-500/20"
                      >
                        <HiExternalLink className="text-lg" />
                        Live Demo
                      </a>

                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial border border-slate-300 dark:border-slate-700 hover:border-cyan-500 text-slate-800 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold px-6 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition"
                      >
                        <HiCode className="text-lg" />
                        Source Code
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portfolio;