import express from "express";
import { body } from "express-validator";
import { Contact } from "../models/Contact.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { sendEmail, sendWelcomeEmailToClient } from "../utils/sendEmail.js";

const router = express.Router();
const memoryContacts = [];

// Validation Rules for Contact Submission
const contactValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email address is required"),
  body("subject").notEmpty().withMessage("Subject is required"),
  body("message").isLength({ min: 5 }).withMessage("Message must be at least 5 characters long"),
];

// POST /api/contact - Submit new message
router.post("/", contactValidationRules, validateRequest, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    let savedContact;
    try {
      savedContact = await Contact.create({ name, email, subject, message });
    } catch {
      savedContact = {
        _id: Date.now().toString(),
        name,
        email,
        subject,
        message,
        createdAt: new Date(),
      };
      memoryContacts.push(savedContact);
    }

    console.log(`📩 New Contact Submission from ${name} (${email})`);

    // Trigger Nodemailer email notification alert to Sunny
    try {
      await sendEmail({
        to: process.env.EMAIL_USER || "sunnykumar6207058974@gmail.com",
        subject: `[PixelForge Contact] ${subject} from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `
          <h2>📩 New Contact Message Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #06b6d4;">${message}</blockquote>
        `,
      });
    } catch (err) {
      console.warn("Email alert notification warning:", err.message);
    }

    // Trigger Welcoming Auto-Reply Email to the Client
    try {
      await sendWelcomeEmailToClient({ name, email, subject, message });
    } catch (clientErr) {
      console.warn("Client welcome auto-reply notice:", clientErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully to Sunny. He will get back to you shortly.",
      data: savedContact,
    });
  } catch (error) {
    console.error("Error in POST /api/contact:", error);
    return res.status(500).json({
      success: false,
      error: "Server Error. Failed to process message.",
    });
  }
});

// GET /api/contact - Retrieve all contact submissions (Protected by JWT)
router.get("/", protect, async (req, res) => {
  try {
    let contacts;
    try {
      contacts = await Contact.find().sort({ createdAt: -1 });
    } catch {
      contacts = memoryContacts;
    }

    return res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch contact messages",
    });
  }
});

export default router;
