import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getSiteConfig, updateSiteConfig, uploadResume } from "../controllers/siteConfigController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".pdf";
    cb(null, `Sunny_Kumar_Resume_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
});

router.get("/", getSiteConfig);
router.put("/", protect, updateSiteConfig);
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

export default router;
