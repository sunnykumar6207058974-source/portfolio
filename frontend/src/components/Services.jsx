import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiSparkles, HiArrowRight, HiViewGrid, HiCheckCircle } from "react-icons/hi";
import { RiPlayList2Fill } from "react-icons/ri";
import FanDeckServices from "./FanDeckServices";
import { apiGetServices } from "../services/api";

import webDevImg from "../assets/services/web_dev.png";
import videoEditingImg from "../assets/services/video_editing.png";
import backendImg from "../assets/services/backend.png";
import ecommerceImg from "../assets/services/ecommerce.png";
import uiUxImg from "../assets/services/ui_ux.png";
import deploymentImg from "../assets/services/deployment.png";

const defaultServices = [
  {
    id: 1,
    image: webDevImg,
    badge: "Frontend & Full-Stack",
    slug: "web dev",
    themeKey: "cyan",
    title: "Web Development",
    description:
      "Building fast, responsive, and modern websites using React.js, JavaScript, Tailwind CSS, and sub-second performance architectures.",
    deliverables: ["React.js / Next.js", "Sub-second Loading", "Tailwind CSS", "SEO & Meta tags"],
  },
  {
    id: 2,
    image: videoEditingImg,
    badge: "Visual & Motion",
    slug: "motion fx",
    themeKey: "purple",
    title: "Video Editing & Motion Graphics",
    description:
      "Crafting high-engagement video content, multi-track cutting, color grading, audio synchronization, and promo reels for digital brands.",
    deliverables: ["Color Grading", "Promo Reels", "Sound Design", "4K Rendering"],
  },
  {
    id: 3,
    image: backendImg,
    badge: "APIs & Databases",
    slug: "backend api",
    themeKey: "emerald",
    title: "Backend API Development",
    description:
      "Creating secure, scalable backend server systems with Node.js, Express, MongoDB databases, RESTful endpoints, and authentication.",
    deliverables: ["Node & Express", "MongoDB Schemas", "JWT Security", "REST & GraphQL"],
  },
  {
    id: 4,
    image: ecommerceImg,
    badge: "Shopping Platforms",
    slug: "e-commerce",
    themeKey: "amber",
    title: "E-Commerce Solutions",
    description:
      "Developing complete online stores with 3D product cards, cart checkout drawers, flash sale engines, and payment gateway integrations.",
    deliverables: ["Checkout Drawer", "Payment Gateway", "Cart State", "Inventory Sync"],
  },
  {
    id: 5,
    image: uiUxImg,
    badge: "UI/UX & Mobile First",
    slug: "ui/ux design",
    themeKey: "rose",
    title: "Responsive Interface Design",
    description:
      "Designing glassmorphic, mobile-friendly user interfaces that deliver fluid user experiences across smartphone, tablet, and desktop viewports.",
    deliverables: ["Figma to Code", "Mobile Responsive", "Micro-animations", "Glassmorphic UI"],
  },
  {
    id: 6,
    image: deploymentImg,
    badge: "Cloud & DevOps",
    slug: "cloud deploy",
    themeKey: "sky",
    title: "Cloud Deployment & Support",
    description:
      "Deploying production-ready applications on Vercel, Netlify, and cloud servers with 99.99% uptime, CI/CD pipelines, and SEO optimization.",
    deliverables: ["Vercel & Netlify", "Docker Containers", "CI/CD Workflows", "99.9% Uptime"],
  },
];

const Services = () => {
  const [services, setServices] = useState(defaultServices);
  const [viewMode, setViewMode] = useState("fandeck"); // "fandeck" | "grid"

  const fetchServices = async () => {
    try {
      const res = await apiGetServices();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((s, idx) => {
          let img = s.image;
          if (!img || img.startsWith("/assets/services/")) {
            const fallback = defaultServices[idx % defaultServices.length];
            img = fallback ? fallback.image : webDevImg;
          }
          const defaultRef = defaultServices[idx % defaultServices.length] || {};
          return {
            ...defaultRef,
            ...s,
            id: s.id || s._id || idx + 1,
            image: img,
            slug: defaultRef.slug || s.title.toLowerCase().split(" ")[0],
            themeKey: defaultRef.themeKey || (["cyan", "purple", "emerald", "amber", "rose", "sky"][idx % 6]),
            deliverables: defaultRef.deliverables || ["Custom Architecture", "High Performance", "Clean Code"],
          };
        });
        setServices(mapped);
      }
    } catch {
      // Keep rich defaults
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section
      id="services"
      className="relative min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white px-4 sm:px-6 lg:px-8 py-24 transition-colors duration-300 overflow-hidden"
    >
      {/* Background Decorative Gradient Meshes */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-purple-500/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10">
          {/* Scrolltide Style Micro Capsule Pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-mono font-semibold text-yellow-500 dark:text-yellow-300 backdrop-blur-md mb-4 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[#e2f952] animate-pulse shadow-sm shadow-[#e2f952]" />
            <span className="tracking-widest uppercase">Scrolltide Fan Deck Interaction</span>
            <span className="text-yellow-400">✦</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08]"
          >
            What I{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              Offer
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            A hand of campaign cards splayed open from a bottom hinge — browse services with interactive 3D rotation and direct project requests.
          </motion.p>

          {/* View Mode Switcher Pills (Fan Deck vs Full Grid) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 inline-flex items-center gap-1.5 p-1 rounded-full bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 shadow-inner"
          >
            <button
              onClick={() => setViewMode("fandeck")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                viewMode === "fandeck"
                  ? "bg-[#e2f952] text-slate-950 shadow-md scale-102"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <RiPlayList2Fill className="text-base" />
              <span>Fan Deck (Interactive)</span>
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md scale-102"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <HiViewGrid className="text-base" />
              <span>Grid View</span>
            </button>
          </motion.div>
        </div>

        {/* Dynamic View: Fan Deck vs Grid */}
        <AnimatePresence mode="wait">
          {viewMode === "fandeck" ? (
            <motion.div
              key="fandeck-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <FanDeckServices services={services} />
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-12"
            >
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-yellow-400/60 dark:hover:border-yellow-400/60 transition-all duration-300 shadow-xl dark:shadow-none flex flex-col justify-between p-6 sm:p-7 relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
                      {service.slug}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border border-slate-700 bg-slate-900 text-yellow-400">
                      {service.badge}
                    </span>
                  </div>

                  {/* Service Visual Banner */}
                  <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800/80 my-4 group-hover:border-yellow-400/50 transition-all duration-500 shadow-md">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-yellow-400 transition">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.deliverables.map((d, dIdx) => (
                      <span
                        key={dIdx}
                        className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        <HiCheckCircle className="text-emerald-500 text-xs shrink-0" />
                        <span>{d}</span>
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="w-full py-3 px-4 rounded-xl bg-[#e2f952] hover:bg-[#d8f53a] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                  >
                    <span>Request Service</span>
                    <HiArrowRight className="text-base" />
                  </Link>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Footer Banner */}
        <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800/80 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <HiSparkles className="text-[#e2f952]" />
            <span>Click any card or use arrow keys/autoplay to fan through services</span>
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-500 hover:text-cyan-400 hover:underline"
          >
            <span>Have a custom project requirement? Let's talk</span>
            <HiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;