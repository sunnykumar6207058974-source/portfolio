import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { seedDatabase } from "./seeder.js";

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pixelforge";
    
    // Attempt local/external MongoDB connection with short timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (error) {
    console.warn(`⚠️ Local MongoDB daemon not running (${error.message}).`);
    console.log("⚡ Starting MongoMemoryServer (In-Memory MongoDB Database)...");

    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB Memory Database Connected: ${conn.connection.host}`);
      console.log(`🗄️ Connected Database URI: ${uri}`);

      await seedDatabase();
    } catch (memErr) {
      console.error("❌ MongoMemoryServer Error:", memErr.message);
    }
  }
};
