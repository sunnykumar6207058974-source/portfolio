import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Validation Rules for Register
const registerRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email address is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

// Validation Rules for Login
const loginRules = [
  body("email").isEmail().withMessage("Valid email address is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerRules, validateRequest, registerUser);
router.post("/login", loginRules, validateRequest, loginUser);
router.get("/me", protect, getMe);

export default router;
