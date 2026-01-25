console.log("🔥🔥🔥 AUTH CONTROLLER FILE LOADED 🔥🔥🔥");

import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { sendEmail } from "../utils/sendmails.js";

// ===================== CREATE TOKEN =====================
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );
};

// ===================== REGISTER =====================
export const register = async (req, res) => {
  try {
    console.log("📬 Register route hit:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, username, email, password, address } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already registered" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already taken" });

    const user = new User({ fullName, username, email, password, address });
    await user.save();

   try {
  await sendEmail(user.email, "Welcome", "Welcome to SevaSetu");
} catch (err) {
  console.error("⚠️ Email failed, ignoring:", err.message);
}

    const token = createToken(user);
    console.log("✅ User registered:", email);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (err) {
    console.error("🔥 Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== USER LOGIN =====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📬 Login route hit:", email);

    const user = await User.findOne({ email });
    console.log("👀 User found:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("🔐 Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);
    console.log(`✅ ${user.isAdmin ? "Admin" : "User"} logged in:`, email);

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
      },
      token,
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== ADMIN LOGIN =====================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟥🟥🟥 ADMIN LOGIN HIT FROM NEW CODE 🟥🟥🟥", email);

    const admin = await User.findOne({ email });
    console.log("👀 User fetched from DB:", admin);

    if (!admin) {
      console.log("❌ No user with this email");
      return res.status(401).json({ message: "Admin not found" });
    }

    console.log("🔎 isAdmin value:", admin.isAdmin);

    if (!admin.isAdmin) {
      console.log("❌ User is not admin");
      return res.status(403).json({ message: "Not an admin account" });
    }

    const isMatch = await admin.comparePassword(password);
    console.log("🔐 Admin password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Wrong admin password");
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = createToken(admin);
    console.log("✅ Admin logged in:", email);

    return res.json({
      message: "Admin login successful",
      user: {
        id: admin._id,
        fullName: admin.fullName,
        username: admin.username,
        email: admin.email,
        isAdmin: true,
      },
      token,
    });
  } catch (err) {
    console.error("🔥 Admin login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
