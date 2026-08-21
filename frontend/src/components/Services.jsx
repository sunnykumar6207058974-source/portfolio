import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight, HiSparkles, HiRefresh } from "react-icons/hi";
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
    title: "Web Development",
    description:
      "Building fast, responsive, and modern websites using React.js, JavaScript, Tailwind CSS, and sub-second performance architectures.",
  },
  {
    id: 2,
    image: videoEditingImg,
    badge: "Visual & Motion",
    title: "Video Editing & Motion Graphics",
    description:
      "Crafting high-engagement video content, multi-track cutting, color grading, audio synchronization, and promo reels for digital brands.",
  },
  {
    id: 3,
    image: backendImg,
    badge: "APIs & Databases",
    title: "Backend API Development",
    description:
      "Creating secure, scalable backend server systems with Node.js, Express, MongoDB databases, RESTful endpoints, and authentication.",
  },
  {
    id: 4,
    image: ecommerceImg,
    badge: "Shopping Platforms",
    title: "E-Commerce Solutions",
    description:
      "Developing complete online stores with 3D product cards, cart checkout drawers, flash sale engines, and payment gateway integrations.",
  },
  {
    id: 5,
    image: uiUxImg,
    badge: "UI/UX & Mobile First",
    title: "Responsive Interface Design",
    description:
      "Designing glassmorphic, mobile-friendly user interfaces that deliver fluid user experiences across smartphone, tablet, and desktop viewports.",
  },
  {
    id: 6,
    image: deploymentImg,
    badge: "Cloud & DevOps",
    title: "Cloud Deployment & Support",
    description:
      "Deploying production-ready applications on Vercel, Netlify, and cloud servers with 99.99% uptime, CI/CD pipelines, and SEO optimization.",
  },
];

const Services = () => {
  const [services, setServices] = useState(defaultServices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    const res = await apiGetServices();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      const mapped = res.data.map((s, idx) => {
        let img = s.image;
        if (!img || img.startsWith("/assets/services/")) {
          const fallback = defaultServices[idx % defaultServices.length];
          img = fallback ? fallback.image : webDevImg;
        }
        return { ...s, id: s.id || s._id || idx + 1, image: img };
      });
      setServices(mapped);
    } else if (!res.success) {
      setError(res.error || "Could not fetch Services API");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section
      id="services"
      className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white px-4 sm:px-6 py-20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="text-cyan-600 dark:text-cyan-400 text-lg font-semibold flex items-center justify-center gap-2">
            <HiSparkles className="text-xl" />
            My Services
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-3 text-slate-900 dark:text-white tracking-tight">
            What I
            <span className="block bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 dark:from-cyan-400 dark:via-teal-300 dark:to-purple-500 bg-clip-text text-transparent">
              Offer
            </span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            High-end web development, creative video editing, backend API architecture, and digital media solutions tailored to your goals.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -8 }}
              className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 shadow-xl dark:shadow-none flex flex-col justify-between"
            >
              {/* Service Banner Image */}
              <div className="relative overflow-hidden h-52 sm:h-56 bg-slate-950">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-cyan-400 text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-700 shadow-md">
                  {service.badge}
                </span>
              </div>

              {/* Service Card Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 font-bold text-sm transition"
                >
                  <span>Get Started</span>
                  <HiArrowRight className="text-base group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;