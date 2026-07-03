// src/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===================== MONGODB CONNECTION =====================
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    console.log("📦 Connected DB name:", mongoose.connection.name);
    console.log("🌐 Connected host:", mongoose.connection.host);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📂 Collections in this DB:", collections.map(c => c.name));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ===================== TEST ROUTES =====================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ===================== HEALTH CHECK =====================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    message: "Backend is healthy",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


// This tests if User collection queries work
import User from "./model/user.model.js";
app.get("/test-user-query", async (req, res) => {
  console.log("🧪 Testing User.findOne...");
  const u = await User.findOne({});
  console.log("🧪 Query result:", u);
  res.json(u);
});

// ===================== ROUTES =====================
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// ===================== START SERVER =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
