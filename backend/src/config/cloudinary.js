import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME || "pixelforge_cloud",
  api_key: process.env.CLOUDINARY_KEY || process.env.CLOUDINARY_API_KEY || "1234567890",
  api_secret: process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET || "pixelforge_cloudinary_secret",
});

export const uploadToCloudinary = async (fileInput, folder = "pixelforge_uploads") => {
  try {
    // If file path is passed from Multer diskStorage
    if (typeof fileInput === "string" && fs.existsSync(fileInput)) {
      const result = await cloudinary.uploader.upload(fileInput, {
        folder,
        resource_type: "auto",
      });
      // Optionally clean up local temp file
      try { fs.unlinkSync(fileInput); } catch {}
      return result;
    }

    // If buffer is passed from Multer memoryStorage
    if (Buffer.isBuffer(fileInput)) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(fileInput);
      });
    }

    throw new Error("Invalid file input for Cloudinary upload");
  } catch (error) {
    console.warn(`ℹ️ Cloudinary Notice: ${error.message}`);
    throw error;
  }
};

export default cloudinary;
