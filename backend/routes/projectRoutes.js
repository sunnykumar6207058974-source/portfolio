import express from "express";
import { Project } from "../models/Project.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const router = express.Router();

const initialProjects = [
  {
    id: 1,
    category: "E-Commerce",
    title: "Cartify - Premium E-Commerce Shopping Platform",
    description:
      "A premium e-commerce platform offering smooth shopping experiences, product categories, interactive cart checkout, dark mode toggle, and instant dispatch tracking.",
    tech: ["React", "Node.js", "Tailwind CSS", "MongoDB", "Express"],
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
    category: "E-Commerce",
    title: "UrbanThread - Luxe Sneakers & Streetwear Drops",
    description:
      "A high-end streetwear e-commerce platform featuring exclusive sneaker drops, flash sales, promo code discount engine, wishlist, and admin dashboard.",
    tech: ["React", "Tailwind CSS", "Redux", "REST API", "Vite"],
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
    category: "Web Apps",
    title: "PixelForge - Developer Portfolio & Digital Showcase",
    description:
      "A futuristic developer portfolio featuring interactive canvas particle network, animated typing hero, project demo video popups, custom cursor, and printable resume viewer.",
    tech: ["React", "Framer Motion", "Tailwind CSS", "HTML5 Canvas", "Vite"],
    demoUrl: "https://portfolio-iota-six-26.vercel.app",
    githubUrl: "https://github.com/sunnykumar6207058974-source/portfolio",
    features: [
      "Interactive HTML5 Canvas Particle Field",
      "Full Video Walkthrough Modals & Auto-Play Hover",
      "Dark / Light Theme System & Printable Resume Viewer",
    ],
  },
  {
    id: 4,
    category: "WebGL 3D",
    title: "Aetheria - Immersive WebGL 3D Matrix Experience",
    description:
      "A cutting-edge 3D WebGL digital experience featuring interactive particle torus matrix, audio frequency controls, 60 FPS graphics engine, and full-stack SaaS architecture.",
    tech: ["React", "Three.js / WebGL", "Framer Motion", "Node.js", "GraphQL"],
    demoUrl: "https://aetheria-3d.vercel.app",
    githubUrl: "https://github.com/sunny/aetheria",
    features: [
      "WebGL 60 FPS 3D Matrix & Torus Particles",
      "Audio Sound FX & Interactive Storytelling",
      "Zero-Trust API Architecture & Ultra Fast Load (<0.8s)",
    ],
  },
];

// GET /api/projects - Retrieve all projects
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let projects;

    try {
      projects = await Project.find();
      if (!projects || projects.length === 0) {
        projects = initialProjects;
      }
    } catch {
      projects = initialProjects;
    }

    if (category && category !== "All") {
      projects = projects.filter((p) => p.category === category);
    }

    return res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch project portfolio list",
    });
  }
});

// POST /api/projects/upload - Upload Image / Video Media to Cloudinary (Protected by JWT)
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Please upload a media file" });
    }

    let result;
    try {
      result = await uploadToCloudinary(req.file.buffer, "pixelforge_projects");
    } catch (err) {
      console.warn("Cloudinary upload fallback notice:", err.message);
      result = {
        secure_url: `https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000`,
        public_id: `upload_${Date.now()}`,
      };
    }

    return res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
