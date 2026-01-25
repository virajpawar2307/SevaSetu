import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import bg from "./bg.png";
import { API_ENDPOINTS } from "../config/api";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const url = isSignup ? API_ENDPOINTS.REGISTER : API_ENDPOINTS.LOGIN;

      const body = isSignup
        ? {
            fullName: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            address: formData.address,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      // =========================
      // ✅ SIGNUP FLOW
      // =========================
      if (isSignup) {
        toast.success("✅ Account created! Please login.");
        setIsSignup(false); // 🔥 Switch to Sign In
        return;
      }

      // =========================
      // ✅ LOGIN FLOW
      // =========================
      if (data.user.isAdmin) {
        toast.error("❌ Admin cannot login here! Use Admin Login page.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("✅ Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Auth error:", err);
      toast.error(err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <Toaster />

      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.05,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
      >
        <div className="flex mb-8 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              !isSignup
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "text-gray-600"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              isSignup
                ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white"
                : "text-gray-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-6">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <AnimatePresence mode="wait">
          <motion.form
            key={isSignup ? "signup" : "signin"}
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4"
          >
            {isSignup && (
              <>
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
                <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
              </>
            )}

            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />

            {isSignup && (
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            )}

            <button type="submit" className="px-6 py-3 mt-4 text-white rounded-full bg-gradient-to-r from-pink-400 to-blue-400">
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </motion.form>
        </AnimatePresence>
      </motion.div>

      <button
        onClick={() => navigate("/admin-login")}
        className="fixed bottom-6 right-6 px-4 py-2 bg-gradient-to-r from-pink-300 to-blue-300 rounded-full shadow-lg"
      >
        Admin
      </button>
    </div>
  );
};

export default AuthPage;
