# 🚀 PixelForge Backend API

Enterprise Express.js backend for **PixelForge Portfolio**, built with **Node.js**, **MongoDB**, **JWT Authentication**, **Cloudinary**, **bcryptjs**, **Express-Validator**, and **Nodemailer**.

---

## 📁 Architecture Directory Structure

```
backend/
├── src/
│   ├── config/
│   │     database.js        # MongoDB Mongoose Connection
│   │     cloudinary.js      # Cloudinary SDK Configuration & Upload Stream
│   │
│   ├── controllers/
│   │     authController.js    # Register, bcrypt Login & JWT Profile
│   │     projectController.js # Projects List & Media Uploads
│   │     contactController.js # Contact Form Submissions & Email Alerts
│   │
│   ├── models/
│   │     User.js            # User Schema with bcryptjs Hashing
│   │     Project.js         # Project Schema
│   │     Contact.js         # Contact Message Schema
│   │
│   ├── routes/
│   │     authRoutes.js       # /api/auth (register, login, me)
│   │     projectRoutes.js    # /api/projects (GET list, POST upload)
│   │     contactRoutes.js    # /api/contact (POST form, GET list)
│   │
│   ├── middleware/
│   │     auth.js            # JWT Bearer Token Verification
│   │     upload.js          # Multer File Storage Middleware
│   │     errorHandler.js    # Global Express Error Handler
│   │
│   ├── utils/
│   │     generateToken.js   # JWT Token Generation Helper
│   │
│   ├── services/
│   │     emailService.js    # Nodemailer Transporter Service
│   │
│   ├── app.js               # Express Application Setup & Routes
│   └── server.js            # Main Server Entry Point
│
├── uploads/                 # Local Media Upload Storage
├── .env                     # Environment Variables Configuration
├── package.json             # NPM Dependencies & Scripts
└── README.md                # Documentation
```

---

## 📡 API Endpoints Summary

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Public | API Server status & uptime check |
| `/api/auth/register` | `POST` | Public | Register user/admin with bcrypt hashed password |
| `/api/auth/login` | `POST` | Public | Login user & return JWT token |
| `/api/auth/me` | `GET` | Private | Retrieve logged-in profile (Requires `Bearer <JWT_TOKEN>`) |
| `/api/contact` | `POST` | Public | Submit contact message & trigger Nodemailer email alert |
| `/api/contact` | `GET` | Private | Admin view contact message list |
| `/api/projects` | `GET` | Public | Retrieve project portfolio list |
| `/api/projects/upload` | `POST` | Private | Upload image/video media file to Cloudinary / Local storage |

---

## 🛠️ How to Run

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   # Server listens on http://localhost:5001
   ```
