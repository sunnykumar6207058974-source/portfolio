import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

// Connect Database
connectDB();

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 PixelForge Express Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Auth Routes: http://localhost:${PORT}/api/auth`);
  console.log(`📩 Contact Routes: http://localhost:${PORT}/api/contact`);
  console.log(`💻 Project Routes: http://localhost:${PORT}/api/projects`);
});
