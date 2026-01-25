import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// Protect routes (user/admin)
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith?.("Bearer "))
      return res.status(401).json({ message: "Not authorized: No token" });

    const token = authHeader.split(" ")[1]?.trim();
    if (!token) return res.status(401).json({ message: "Token missing" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Not authorized" });
  }
};

// Admin-only middleware
export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin access required" });
  next();
};
