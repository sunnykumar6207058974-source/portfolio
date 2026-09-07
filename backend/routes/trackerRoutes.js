import express from "express";
import mongoose from "mongoose";
import { ClientTracker } from "../models/ClientTracker.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fallback initial trackers for seamless demo
let inMemoryTrackers = [
  {
    _id: "demo_ut_2026",
    clientName: "Alex Johnson",
    clientEmail: "alex.j@example.com",
    clientPhone: "+1 (555) 019-9944",
    projectName: "UrbanThread - Luxe E-Commerce & Sneakerhead Drop",
    trackingCode: "UT-2026",
    progress: 75,
    status: "In Progress",
    currentPhase: "Payment Gateway Integration & Order Processing",
    startDate: "2026-08-20",
    estimatedDelivery: "15 Sep 2026",
    livePreviewUrl: "https://urban-thread-sand.vercel.app",
    figmaUrl: "https://figma.com",
    scope: [
      "Responsive Streetwear Storefront UI",
      "Flash Deal Countdown Banners",
      "Dynamic Cart & Promo Coupon Engine",
      "Razorpay Online Payment Gateway",
      "Admin Analytics & Inventory Management",
    ],
    milestones: [
      {
        _id: "m1",
        title: "Phase 1: Architecture & UI/UX Wireframing",
        description: "Complete design system, typography, dark/light theme, and layout components.",
        status: "completed",
        completedDate: "25 Aug 2026",
      },
      {
        _id: "m2",
        title: "Phase 2: Product Catalog & Cart Drawer",
        description: "Product list, instant category filters, quick view modals, and cart persistence.",
        status: "completed",
        completedDate: "02 Sep 2026",
      },
      {
        _id: "m3",
        title: "Phase 3: Checkout & Payment Gateway",
        description: "Multi-address selection, order summary, and Razorpay modal integration.",
        status: "in-progress",
        completedDate: "",
      },
      {
        _id: "m4",
        title: "Phase 4: Admin Dashboard & Order Tracking",
        description: "Order confirmation emails, shipment status updates, and sales analytics.",
        status: "pending",
        completedDate: "",
      },
      {
        _id: "m5",
        title: "Phase 5: Final QA, Security Audit & Production Launch",
        description: "Cross-browser testing, mobile responsiveness, Lighthouse performance optimization.",
        status: "pending",
        completedDate: "",
      },
    ],
    activityLog: [
      {
        _id: "log1",
        title: "Razorpay Payment Gateway Setup",
        description: "Integrated online payment gateway with dynamic INR currency conversion and auto order verification.",
        tag: "Payment",
        previewUrl: "https://urban-thread-sand.vercel.app",
        date: new Date("2026-09-07T11:00:00Z"),
      },
      {
        _id: "log2",
        title: "Cart Coupon Discount Engine Added",
        description: "Implemented real-time coupon codes (e.g. SNEAKER20) with automated price recalculations.",
        tag: "Feature",
        previewUrl: "",
        date: new Date("2026-09-05T14:30:00Z"),
      },
      {
        _id: "log3",
        title: "Multi-Address Delivery Selector",
        description: "Added saved addresses modal allowing one-click selection for checkout.",
        tag: "UI / Design",
        previewUrl: "",
        date: new Date("2026-09-03T16:00:00Z"),
      },
    ],
    isActive: true,
  },
];

// GET /api/tracker/:code - Public client tracking view
router.get("/:code", async (req, res) => {
  try {
    const raw = (req.params.code || "").trim();
    // Normalize unicode dashes (en-dash, em-dash, minus) to standard ASCII hyphen
    const cleanCode = raw
      .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-")
      .trim()
      .toUpperCase();
    const alphaNumeric = cleanCode.replace(/[^A-Z0-9]/g, "");

    let tracker;

    // If MongoDB is connected and ready
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        tracker = await ClientTracker.findOne({
          $or: [
            { trackingCode: cleanCode },
            { trackingCode: new RegExp(`^${cleanCode}$`, "i") },
            { trackingCode: new RegExp(`^${alphaNumeric}$`, "i") },
          ],
        }).maxTimeMS(1200);
      } catch {
        // ignore db error, fallback to in-memory
      }
    }

    if (!tracker) {
      tracker = inMemoryTrackers.find((t) => {
        const tCode = (t.trackingCode || "").toUpperCase();
        const tAlpha = tCode.replace(/[^A-Z0-9]/g, "");
        const pName = (t.projectName || "").toUpperCase();
        const cName = (t.clientName || "").toUpperCase();

        return (
          tCode === cleanCode ||
          tAlpha === alphaNumeric ||
          tCode.includes(cleanCode) ||
          pName.includes(cleanCode) ||
          cName.includes(cleanCode) ||
          (alphaNumeric.length >= 3 && (tAlpha.includes(alphaNumeric) || pName.replace(/[^A-Z0-9]/g, "").includes(alphaNumeric)))
        );
      });
    }

    if (!tracker) {
      return res.status(404).json({
        success: false,
        error: "No active project found with this tracking code. Please verify the code or contact Sunny.",
      });
    }

    return res.json({
      success: true,
      data: tracker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve project tracking status.",
    });
  }
});

// GET /api/tracker - Admin retrieve all client trackers
router.get("/", protect, async (req, res) => {
  try {
    let trackers = [];
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        trackers = await ClientTracker.find().sort({ updatedAt: -1 }).maxTimeMS(300);
      } catch {}
    }

    if (!trackers || trackers.length === 0) {
      trackers = inMemoryTrackers;
    }

    return res.json({
      success: true,
      count: trackers.length,
      data: trackers,
    });
  } catch (error) {
    return res.json({
      success: true,
      count: inMemoryTrackers.length,
      data: inMemoryTrackers,
    });
  }
});

// POST /api/tracker - Create new client tracker (Admin)
router.post("/", protect, async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      projectName,
      trackingCode,
      progress,
      status,
      currentPhase,
      startDate,
      estimatedDelivery,
      livePreviewUrl,
      figmaUrl,
      scope,
      milestones,
    } = req.body;

    if (!clientName || !projectName || !trackingCode) {
      return res.status(400).json({
        success: false,
        error: "Client Name, Project Name, and Tracking Code are required.",
      });
    }

    const code = trackingCode.trim().toUpperCase();

    const newTrackerData = {
      clientName,
      clientEmail: clientEmail || "",
      clientPhone: clientPhone || "",
      projectName,
      trackingCode: code,
      progress: progress !== undefined ? Number(progress) : 10,
      status: status || "In Progress",
      currentPhase: currentPhase || "Planning & Architecture",
      startDate: startDate || new Date().toISOString().split("T")[0],
      estimatedDelivery: estimatedDelivery || "TBD",
      livePreviewUrl: livePreviewUrl || "",
      figmaUrl: figmaUrl || "",
      scope: Array.isArray(scope) ? scope : [],
      milestones: Array.isArray(milestones) && milestones.length > 0
        ? milestones
        : [
            { title: "Planning & Architecture", status: "completed", completedDate: "Day 1" },
            { title: "UI Components & Frontend", status: "in-progress" },
            { title: "Backend API & Database", status: "pending" },
            { title: "Testing & Deployment", status: "pending" },
          ],
      activityLog: [
        {
          title: "Project Initialized",
          description: "Project repository created and architecture finalized.",
          tag: "Feature",
          date: new Date(),
        },
      ],
      isActive: true,
    };

    let savedTracker = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        savedTracker = await ClientTracker.create(newTrackerData);
      } catch (dbErr) {}
    }

    if (!savedTracker) {
      newTrackerData._id = `tracker_${Date.now()}`;
      inMemoryTrackers.unshift(newTrackerData);
      savedTracker = newTrackerData;
    }

    return res.status(201).json({
      success: true,
      message: "Client project tracker created successfully!",
      data: savedTracker,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create client tracker.",
    });
  }
});

// PUT /api/tracker/:id/progress - Update progress slider & status (Admin)
router.put("/:id/progress", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, status, currentPhase } = req.body;

    let updated = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        updated = await ClientTracker.findByIdAndUpdate(
          id,
          {
            ...(progress !== undefined && { progress: Number(progress) }),
            ...(status && { status }),
            ...(currentPhase && { currentPhase }),
          },
          { new: true }
        ).maxTimeMS(300);
      } catch {}
    }

    if (!updated) {
      const idx = inMemoryTrackers.findIndex((t) => t._id === id || t.trackingCode === id);
      if (idx !== -1) {
        if (progress !== undefined) inMemoryTrackers[idx].progress = Number(progress);
        if (status) inMemoryTrackers[idx].status = status;
        if (currentPhase) inMemoryTrackers[idx].currentPhase = currentPhase;
        if (Number(progress) >= 100) {
          inMemoryTrackers[idx].milestones.forEach((m) => {
            m.status = "completed";
            if (!m.completedDate) m.completedDate = "Delivered";
          });
        }
        updated = inMemoryTrackers[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, error: "Tracker not found" });
    }

    return res.json({
      success: true,
      message: "Progress updated successfully!",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to update project progress.",
    });
  }
});

// POST /api/tracker/:id/log - Add an activity update / changelog (Admin)
router.post("/:id/log", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tag, previewUrl } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: "Log title is required" });
    }

    const newLog = {
      title,
      description: description || "",
      tag: tag || "Feature",
      previewUrl: previewUrl || "",
      date: new Date(),
    };

    let updated = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        updated = await ClientTracker.findByIdAndUpdate(
          id,
          { $push: { activityLog: { $each: [newLog], $position: 0 } } },
          { new: true }
        ).maxTimeMS(300);
      } catch {}
    }

    if (!updated) {
      const idx = inMemoryTrackers.findIndex((t) => t._id === id || t.trackingCode === id);
      if (idx !== -1) {
        newLog._id = `log_${Date.now()}`;
        inMemoryTrackers[idx].activityLog.unshift(newLog);
        updated = inMemoryTrackers[idx];
      }
    }

    return res.json({
      success: true,
      message: "Activity update posted successfully!",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to post activity update.",
    });
  }
});

// PUT /api/tracker/:id/milestones - Update milestones (Admin)
router.put("/:id/milestones", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { milestones } = req.body;

    if (!Array.isArray(milestones)) {
      return res.status(400).json({ success: false, error: "Milestones must be an array" });
    }

    let updated = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        updated = await ClientTracker.findByIdAndUpdate(
          id,
          { milestones },
          { new: true }
        ).maxTimeMS(300);
      } catch {}
    }

    if (!updated) {
      const idx = inMemoryTrackers.findIndex((t) => t._id === id || t.trackingCode === id);
      if (idx !== -1) {
        inMemoryTrackers[idx].milestones = milestones;
        updated = inMemoryTrackers[idx];
      }
    }

    return res.json({
      success: true,
      message: "Milestones updated successfully!",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to update milestones.",
    });
  }
});

// PUT /api/tracker/:id/scope - Update agreed project scope deliverables (Admin)
router.put("/:id/scope", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { scope } = req.body;

    if (!Array.isArray(scope)) {
      return res.status(400).json({ success: false, error: "Scope must be an array of features" });
    }

    let updated = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        updated = await ClientTracker.findByIdAndUpdate(
          id,
          { scope },
          { new: true }
        ).maxTimeMS(300);
      } catch {}
    }

    if (!updated) {
      const idx = inMemoryTrackers.findIndex((t) => t._id === id || t.trackingCode === id);
      if (idx !== -1) {
        inMemoryTrackers[idx].scope = scope;
        updated = inMemoryTrackers[idx];
      }
    }

    return res.json({
      success: true,
      message: "Agreed Scope & Features updated successfully!",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to update scope deliverables.",
    });
  }
});

// DELETE /api/tracker/:id - Delete tracker (Admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        await ClientTracker.findByIdAndDelete(id).maxTimeMS(300);
      } catch {}
    }

    inMemoryTrackers = inMemoryTrackers.filter((t) => t._id !== id && t.trackingCode !== id);

    return res.json({
      success: true,
      message: "Tracker removed successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to delete tracker.",
    });
  }
});

export default router;
