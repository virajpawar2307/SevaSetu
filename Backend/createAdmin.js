import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./src/model/user.model.js";

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    const existingAdmin = await User.findOne({ email: "admin@sevasetu.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists!");
      process.exit(0);
    }

    const admin = new User({
      fullName: "Admin User",
      username: "admin",
      email: "admin@sevasetu.com",
      password: "admin123",
      address: "City Admin",
      isAdmin: true,
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@sevasetu.com, Password: admin123");
    process.exit(0);
  } catch (err) {
    console.error("🔥 Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
