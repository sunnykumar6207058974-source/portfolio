import express from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import siteConfigRoutes from "./routes/siteConfigRoutes.js";
import extraRoutes from "./routes/extraRoutes.js";
import trackerRoutes from "../routes/trackerRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// 1. Helmet HTTP Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 2. Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});
app.use("/api", limiter);

// 3. CORS Configuration
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5176"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.includes("vercel.app") ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy restriction: Origin not allowed."));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 4. NoSQL MongoDB Injection Protection
app.use(mongoSanitize());

// 5. XSS Protection
app.use(xss());

// Serve static uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health Check Endpoints
const healthHandler = (req, res) => {
  res.json({
    status: "online",
    service: "PixelForge Express Backend API",
    developer: "Sunny Kumar",
    architecture: "src/ MVC Architecture",
    adminFeatures: [
      "Add / Edit / Delete Projects",
      "Add / Edit Services & Skills",
      "Read & Manage Contact Messages",
      "Upload Images to Cloudinary",
      "Change Hero Section & Website Info",
      "Manage Testimonials & Social Links",
      "Change SEO Settings",
    ],
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
};
app.get("/api/health", healthHandler);
app.get("/health", healthHandler);

// API Routes & Universal Dual-Mount Aliases (/api/... AND /...)
app.use("/api/auth", authRoutes);
app.use("/api", authRoutes);
app.use("/", authRoutes);

app.use("/api/contact", contactRoutes);
app.use("/contact", contactRoutes);
app.use("/api/messages", contactRoutes);
app.use("/messages", contactRoutes);

app.use("/api/projects", projectRoutes);
app.use("/projects", projectRoutes);

app.use("/api/services", serviceRoutes);
app.use("/services", serviceRoutes);

app.use("/api/skills", skillRoutes);
app.use("/skills", skillRoutes);

app.use("/api/config", siteConfigRoutes);
app.use("/config", siteConfigRoutes);
app.use("/api/settings", siteConfigRoutes);
app.use("/settings", siteConfigRoutes);

app.use("/api/tracker", trackerRoutes);
app.use("/tracker", trackerRoutes);

app.use("/api", extraRoutes);
app.use("/", extraRoutes);

// 404 Handler for Unrecognized Endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API Endpoint Not Found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
