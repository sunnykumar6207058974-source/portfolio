import express from "express";
import { body } from "express-validator";
import {
  submitContactForm,
  getContactMessages,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateMiddleware.js";

const router = express.Router();

const contactValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email address is required"),
  body("subject").notEmpty().withMessage("Subject is required"),
  body("message").isLength({ min: 5 }).withMessage("Message must be at least 5 characters long"),
];

router.post("/", contactValidationRules, validateRequest, submitContactForm);
router.get("/", protect, getContactMessages);
router.delete("/:id", protect, deleteContactMessage);

export default router;
