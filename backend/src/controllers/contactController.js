import { Contact } from "../models/Contact.js";
import { sendEmailNotification, sendWelcomeEmailToClient } from "../services/emailService.js";

let memoryContacts = [
  {
    _id: "m1",
    name: "Alex Rivers",
    email: "alex@example.com",
    subject: "Web Development Project Proposal",
    message: "Hi Sunny, we want to hire you for building a custom React & Node.js application.",
    status: "unread",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "m2",
    name: "Sarah Jenkins",
    email: "sarah@techcorp.io",
    subject: "Video Editing & Motion Reel Contract",
    message: "Loved your video editing portfolio! Are you open for freelance motion graphics work?",
    status: "read",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "m3",
    name: "Rohan Sharma",
    email: "rohan@startup.in",
    subject: "Full Stack Developer Role Interview",
    message: "We reviewed your B.Tech Computer Science resume and would love to schedule a call.",
    status: "unread",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// @desc    Submit new contact form message
// @route   POST /api/contact or POST /contact
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields (name, email, subject, message) are required",
      });
    }

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
        status: "unread",
        createdAt: new Date(),
      };
      memoryContacts.unshift(savedContact);
    }

    console.log(`📩 New Contact Submission from ${name} (${email})`);

    // Return instant success response so user's client does not hang
    res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully to Sunny. He will get back to you shortly.",
      data: savedContact,
    });

    // Fire-and-forget background email notification (never blocks client HTTP response)
    (async () => {
      const results = await Promise.allSettled([
        sendEmailNotification({
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
        }),
        sendWelcomeEmailToClient({ name, email, subject, message }),
      ]);
      results.forEach((r, idx) => {
        if (r.status === "rejected") {
          console.warn(`Email task ${idx} failed:`, r.reason);
        }
      });
    })().catch((bgErr) => console.warn("Background email error:", bgErr));

    return;
  } catch (error) {
    console.error("Error in submitContactForm:", error);
    return res.status(500).json({
      success: false,
      error: "Server Error. Failed to process message.",
    });
  }
};

// @desc    Get all contact messages (Protected Admin)
// @route   GET /api/messages or GET /messages or GET /api/contact
export const getContactMessages = async (req, res) => {
  try {
    let contacts;
    try {
      contacts = await Contact.find().sort({ createdAt: -1 }).timeout(1500);
      if (!contacts || contacts.length === 0) {
        contacts = memoryContacts;
      }
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
};

// @desc    Delete contact message by ID (Protected Admin)
// @route   DELETE /api/messages/:id or DELETE /messages/:id or DELETE /api/contact/:id
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = false;
    try {
      const msg = await Contact.findByIdAndDelete(id).timeout(1500);
      if (msg) deleted = true;
    } catch {
      const initialLength = memoryContacts.length;
      memoryContacts = memoryContacts.filter((m) => m._id !== id);
      if (memoryContacts.length < initialLength) deleted = true;
    }

    if (!deleted) {
      const initialLength = memoryContacts.length;
      memoryContacts = memoryContacts.filter((m) => m._id !== id);
      if (memoryContacts.length < initialLength) deleted = true;
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Message with ID ${id} not found or already deleted`,
      });
    }

    return res.json({
      success: true,
      message: "Contact message deleted successfully",
      data: { _id: id },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
