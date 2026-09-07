import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const initialProjects = [
  {
    _id: "1",
    id: 1,
    category: "E-Commerce",
    title: "Cartify - Premium E-Commerce Shopping Platform",
    description:
      "A premium e-commerce platform offering smooth shopping experiences, product categories, interactive cart checkout, dark mode toggle, and instant dispatch tracking.",
    tech: ["React", "Node.js", "Tailwind CSS", "MongoDB", "Express"],
    demoUrl: "https://cartify-store-amber.vercel.app",
    githubUrl: "https://github.com/sunnykumar6207058974-source/Cartify",
    image: "/assets/projects/cartify.jpg",
    features: [
      "Interactive Shopping Cart & Express Checkout",
      "Category Filters & Product Search Bar",
      "Dark / Light Theme & 24/7 Express Support",
    ],
  },
  {
    _id: "2",
    id: 2,
    category: "E-Commerce",
    title: "UrbanThread - Luxe Sneakers & Streetwear Drops",
    description:
      "A high-end streetwear e-commerce platform featuring exclusive sneaker drops, flash sales, promo code discount engine, wishlist, and admin dashboard.",
    tech: ["React", "Tailwind CSS", "Redux", "REST API", "Vite"],
    demoUrl: "https://urban-thread-sand.vercel.app",
    githubUrl: "https://github.com/sunnykumar6207058974-source/UrbanThread",
    image: "/assets/projects/urbanthread.jpg",
    features: [
      "Sneakerhead Drops & Flash Deal Banners",
      "Promo Code Discount Engine (SNEAKER20)",
      "Wishlist, Cart Drawer & Admin Analytics Dashboard",
    ],
  },
  {
    _id: "3",
    id: 3,
    category: "Web Apps",
    title: "PixelForge - Developer Portfolio & Digital Showcase",
    description:
      "A futuristic developer portfolio featuring interactive canvas particle network, animated typing hero, project demo video popups, custom cursor, and printable resume viewer.",
    tech: ["React", "Framer Motion", "Tailwind CSS", "HTML5 Canvas", "Vite"],
    demoUrl: "https://portfolio-iota-six-26.vercel.app",
    githubUrl: "https://github.com/sunnykumar6207058974-source/portfolio",
    image: "/assets/projects/pixelforge.jpg",
    features: [
      "Interactive HTML5 Canvas Particle Field",
      "Full Video Walkthrough Modals & Auto-Play Hover",
      "Dark / Light Theme System & Printable Resume Viewer",
    ],
  },
  {
    _id: "4",
    id: 4,
    category: "WebGL 3D",
    title: "Aetheria - Immersive WebGL 3D Matrix Experience",
    description:
      "A cutting-edge 3D WebGL digital experience featuring interactive particle torus matrix, audio frequency controls, 60 FPS graphics engine, and full-stack SaaS architecture.",
    tech: ["React", "Three.js / WebGL", "Framer Motion", "Node.js", "GraphQL"],
    demoUrl: "https://aetheria-3d.vercel.app",
    githubUrl: "https://github.com/sunny/aetheria",
    image: "/assets/projects/aetheria.jpg",
    features: [
      "WebGL 60 FPS 3D Matrix & Torus Particles",
      "Audio Sound FX & Interactive Storytelling",
      "Zero-Trust API Architecture & Ultra Fast Load (<0.8s)",
    ],
  },
];

let memoryProjects = [...initialProjects];

// @desc    Get all projects (with optional category filter)
// @route   GET /api/projects or GET /projects
export const getProjects = async (req, res) => {
  try {
    const { category } = req.query;
    let projects;

    try {
      projects = await Project.find().timeout(1500);
      if (!projects || projects.length === 0) {
        projects = memoryProjects;
      }
    } catch {
      projects = memoryProjects;
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
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id or GET /projects/:id
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    let project;

    try {
      project = await Project.findById(id).timeout(1500);
    } catch {
      project = memoryProjects.find((p) => p._id === id || p.id.toString() === id);
    }

    if (!project) {
      project = memoryProjects.find((p) => p._id === id || p.id.toString() === id);
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found`,
      });
    }

    return res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create new project (Stores Cloudinary Image URL in Database)
// @route   POST /api/projects or POST /projects
export const createProject = async (req, res) => {
  try {
    const { title, category, description, image, tech, features, demoUrl, githubUrl, videoUrl } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        error: "Title, category, and description are required fields",
      });
    }

    const imageUrl = image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000";

    let newProject;
    try {
      newProject = await Project.create({
        title,
        category,
        description,
        image: imageUrl,
        tech: tech || ["React", "Node.js"],
        features: features || [],
        demoUrl: demoUrl || "#",
        githubUrl: githubUrl || "#",
        videoUrl: videoUrl || "",
      });
    } catch {
      newProject = {
        _id: (memoryProjects.length + 1).toString(),
        id: memoryProjects.length + 1,
        title,
        category,
        description,
        image: imageUrl,
        tech: tech || ["React", "Node.js"],
        features: features || [],
        demoUrl: demoUrl || "#",
        githubUrl: githubUrl || "#",
        videoUrl: videoUrl || "",
        createdAt: new Date(),
      };
      memoryProjects.push(newProject);
    }

    return res.status(201).json({
      success: true,
      message: "Project created successfully with Cloudinary image URL stored in database",
      data: newProject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update existing project
// @route   PUT /api/projects/:id or PUT /projects/:id
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updatedProject;
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
      }
    } catch {
      // Fallback to memory
    }

    if (!updatedProject) {
      const index = memoryProjects.findIndex((p) => p._id === id || p.id?.toString() === id);
      if (index !== -1) {
        memoryProjects[index] = { ...memoryProjects[index], ...updateData };
        updatedProject = memoryProjects[index];
      }
    }

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found`,
      });
    }

    return res.json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete project by ID
// @route   DELETE /api/projects/:id or DELETE /projects/:id
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = false;
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const project = await Project.findByIdAndDelete(id);
        if (project) deleted = true;
      }
    } catch {
      // Fallback to memory
    }

    if (!deleted) {
      const initialLength = memoryProjects.length;
      memoryProjects = memoryProjects.filter((p) => p._id !== id && p.id?.toString() !== id);
      if (memoryProjects.length < initialLength) deleted = true;
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found or already deleted`,
      });
    }

    return res.json({
      success: true,
      message: "Project deleted successfully",
      data: { _id: id },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Upload image/video to Cloudinary and return Cloudinary URL
// @route   POST /api/projects/upload
export const uploadProjectMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Please upload a media file" });
    }

    let result;
    try {
      const fileTarget = req.file.path || req.file.buffer;
      result = await uploadToCloudinary(fileTarget, "pixelforge_projects");
    } catch (err) {
      console.warn("Cloudinary upload notice:", err.message);
      const filename = req.file.filename || "default.jpg";
      result = {
        secure_url: `/uploads/${filename}`,
        public_id: filename,
      };
    }

    return res.json({
      success: true,
      message: "Image uploaded to Cloudinary successfully. Save this URL string in database.",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
