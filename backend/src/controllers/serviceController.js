import { Service } from "../models/Service.js";

const initialServices = [
  {
    _id: "1",
    id: 1,
    badge: "Frontend & Full-Stack",
    title: "Web Development",
    description:
      "Building fast, responsive, and modern websites using React.js, JavaScript, Tailwind CSS, and sub-second performance architectures.",
    image: "/assets/services/web_dev.png",
  },
  {
    _id: "2",
    id: 2,
    badge: "Visual & Motion",
    title: "Video Editing & Motion Graphics",
    description:
      "Crafting high-engagement video content, multi-track cutting, color grading, audio synchronization, and promo reels for digital brands.",
    image: "/assets/services/video_editing.png",
  },
  {
    _id: "3",
    id: 3,
    badge: "APIs & Databases",
    title: "Backend API Development",
    description:
      "Creating secure, scalable backend server systems with Node.js, Express, MongoDB databases, RESTful endpoints, and authentication.",
    image: "/assets/services/backend.png",
  },
  {
    _id: "4",
    id: 4,
    badge: "Shopping Platforms",
    title: "E-Commerce Solutions",
    description:
      "Developing complete online stores with 3D product cards, cart checkout drawers, flash sale engines, and payment gateway integrations.",
    image: "/assets/services/ecommerce.png",
  },
  {
    _id: "5",
    id: 5,
    badge: "UI/UX & Mobile First",
    title: "Responsive Interface Design",
    description:
      "Designing glassmorphic, mobile-friendly user interfaces that deliver fluid user experiences across smartphone, tablet, and desktop viewports.",
    image: "/assets/services/ui_ux.png",
  },
  {
    _id: "6",
    id: 6,
    badge: "Cloud & DevOps",
    title: "Cloud Deployment & Support",
    description:
      "Deploying production-ready applications on Vercel, Netlify, and cloud servers with 99.99% uptime, CI/CD pipelines, and SEO optimization.",
    image: "/assets/services/deployment.png",
  },
];

let memoryServices = [...initialServices];

// @desc    Get all services
// @route   GET /api/services or GET /services
export const getServices = async (req, res) => {
  try {
    let services;
    try {
      services = await Service.find().timeout(1500);
      if (!services || services.length === 0) {
        services = memoryServices;
      }
    } catch {
      services = memoryServices;
    }

    return res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch services" });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id or GET /services/:id
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let service;

    try {
      service = await Service.findById(id).timeout(1500);
    } catch {
      service = memoryServices.find((s) => s._id === id || s.id?.toString() === id);
    }

    if (!service) {
      service = memoryServices.find((s) => s._id === id || s.id?.toString() === id);
    }

    if (!service) {
      return res.status(404).json({ success: false, error: `Service with ID ${id} not found` });
    }

    return res.json({ success: true, data: service });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services or POST /services
export const createService = async (req, res) => {
  try {
    const { title, description, image, badge } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: "Title and description are required fields",
      });
    }

    let newService;
    try {
      newService = await Service.create({
        title,
        description,
        image: image || "/assets/services/web_dev.png",
        badge: badge || "Custom Offering",
      });
    } catch {
      newService = {
        _id: (memoryServices.length + 1).toString(),
        id: memoryServices.length + 1,
        title,
        description,
        image: image || "/assets/services/web_dev.png",
        badge: badge || "Custom Offering",
        createdAt: new Date(),
      };
      memoryServices.push(newService);
    }

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update existing service
// @route   PUT /api/services/:id or PUT /services/:id
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updatedService;
    try {
      updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true }).timeout(1500);
    } catch {
      const index = memoryServices.findIndex((s) => s._id === id || s.id?.toString() === id);
      if (index !== -1) {
        memoryServices[index] = { ...memoryServices[index], ...updateData };
        updatedService = memoryServices[index];
      }
    }

    if (!updatedService) {
      const index = memoryServices.findIndex((s) => s._id === id || s.id?.toString() === id);
      if (index !== -1) {
        memoryServices[index] = { ...memoryServices[index], ...updateData };
        updatedService = memoryServices[index];
      }
    }

    if (!updatedService) {
      return res.status(404).json({ success: false, error: `Service with ID ${id} not found` });
    }

    return res.json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete service by ID
// @route   DELETE /api/services/:id or DELETE /services/:id
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = false;
    try {
      const service = await Service.findByIdAndDelete(id).timeout(1500);
      if (service) deleted = true;
    } catch {
      const initialLength = memoryServices.length;
      memoryServices = memoryServices.filter((s) => s._id !== id && s.id?.toString() !== id);
      if (memoryServices.length < initialLength) deleted = true;
    }

    if (!deleted) {
      const initialLength = memoryServices.length;
      memoryServices = memoryServices.filter((s) => s._id !== id && s.id?.toString() !== id);
      if (memoryServices.length < initialLength) deleted = true;
    }

    if (!deleted) {
      return res.status(404).json({ success: false, error: `Service with ID ${id} not found` });
    }

    return res.json({
      success: true,
      message: "Service deleted successfully",
      data: { _id: id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
