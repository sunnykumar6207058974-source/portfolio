import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, refreshToken, getMe, getUserProfile, logoutUser } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateMiddleware.js";

const router = express.Router();

const registerRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email address is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email address is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Authentication Endpoints
router.post("/register", registerRules, validateRequest, registerUser);
router.post("/login", loginRules, validateRequest, loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, getUserProfile);
router.get("/me", protect, getMe);

export default router;
