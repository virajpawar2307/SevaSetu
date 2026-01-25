import express from "express";
import { protect, requireAdmin } from "../middleware/auth.middleware.js";
import {
  createComplaint,
  getComplaints,
  updateComplaint,
  rejectComplaint,
  deleteComplaint,
} from "../controller/complaint.controller.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "SevaSetuComplaints", allowed_formats: ["jpg", "jpeg", "png"] },
});
const upload = multer({ storage });

const router = express.Router();

// User routes
router.post("/", protect, upload.single("photo"), createComplaint);
router.get("/", protect, getComplaints);

// Admin routes
router.put("/:id", protect, requireAdmin, updateComplaint);
router.put("/reject/:id", protect, requireAdmin, rejectComplaint);
router.delete("/:id", protect, requireAdmin, deleteComplaint);

export default router;
