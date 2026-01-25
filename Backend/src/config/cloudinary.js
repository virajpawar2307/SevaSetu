// src/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage to handle file uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SevaSetuComplaints", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file types
  },
});

export { cloudinary, storage };
