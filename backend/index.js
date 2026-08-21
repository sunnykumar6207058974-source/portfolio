import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect Database
connectDB();

// CORS & Body Parsing Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "PixelForge Express Backend API",
    developer: "Sunny Kumar",
    stack: [
      "Node.js & Express.js",
      "MongoDB & Mongoose",
      "JWT Authentication",
      "bcryptjs Password Hashing",
      "Cloudinary & Multer File Uploads",
      "Express-Validator Rules",
      "Nodemailer Email Alerts",
    ],
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Express Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API Endpoint Not Found",
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 PixelForge Express Backend running on http://localhost:${PORT}`);
  console.log(`🔑 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`📩 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`💻 Projects API: http://localhost:${PORT}/api/projects`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
