import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import bg from "./bg.png";
import { API_ENDPOINTS } from "../config/api";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [loading, setLoading] = useState(false); // 🔥 added
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
  if (loading) return;

  if (isSignup && formData.password !== formData.confirmPassword) {
    return toast.error("Passwords do not match");
  }

  try {
    setLoading(true);

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

    // 🔥 HANDLE 204 NO CONTENT
    if (res.status === 204) {
      toast.success(isSignup ? "✅ Account created!" : "✅ Logged in!");
      navigate("/dashboard");
      return;
    }

    // 🔥 SAFELY TRY TO PARSE JSON
    let data = {};
    const text = await res.text();
    if (text) data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    // ❌ Block admin login here
    if (!isSignup && data.user?.isAdmin) {
      toast.error("❌ Admin cannot login here! Use Admin Login page.");
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    toast.success(isSignup ? "✅ Account created!" : "✅ Logged in!");

    navigate("/dashboard");
  } catch (err) {
    console.error("Auth error:", err);
    toast.error(err.message || "Network error");
  } finally {
    setLoading(false);
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
          filter: "brightness(1.2)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
      >
        <div className="flex mb-8 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              !isSignup
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              isSignup
                ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <AnimatePresence mode="wait">
          <motion.form
            key={isSignup ? "signup" : "signin"}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: isSignup ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignup ? -30 : 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col space-y-4"
          >
            {isSignup && (
              <>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required className="px-4 py-3 rounded-xl bg-gray-50 border" />
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="px-4 py-3 rounded-xl bg-gray-50 border" />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="px-4 py-3 rounded-xl bg-gray-50 border" />
              </>
            )}

            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="px-4 py-3 rounded-xl bg-gray-50 border" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="px-4 py-3 rounded-xl bg-gray-50 border" />

            {isSignup && (
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required className="px-4 py-3 rounded-xl bg-gray-50 border" />
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="px-6 py-3 mt-4 text-white font-semibold rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 shadow-lg hover:shadow-xl transition-transform duration-300"
            >
              {loading ? "Please wait..." : isSignup ? "Sign Up" : "Sign In"}
            </motion.button>
          </motion.form>
        </AnimatePresence>
      </motion.div>

      <motion.button
        onClick={() => navigate("/admin-login")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 px-4 py-2 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all z-50 backdrop-blur-sm"
      >
        Admin
      </motion.button>
    </div>
  );
};

export default AuthPage;
