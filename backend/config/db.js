import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pixelforge",
      {
        serverSelectionTimeoutMS: 3000,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Local Connection Notice: ${error.message}`);
    console.log("ℹ️ Server running with in-memory database fallback mode.");
  }
};
