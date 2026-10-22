import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load .env explicitly here
dotenv.config();

// console.log("CLOUDINARY CHECK:", {
//   cloud: process.env.CLOUDINARY_CLOUD_NAME,
//   key: process.env.CLOUDINARY_API_KEY,
//   secret: process.env.CLOUDINARY_API_SECRET ? "exists" : "missing",
// });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File uploaded successfully, remove local temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    // Print the actual error so you can debug
    console.error("Cloudinary upload failed:", error);

    // Clean up local temp file on failure
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };