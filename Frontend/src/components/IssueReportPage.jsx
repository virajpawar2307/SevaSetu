import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, MessageCircle, CornerUpLeft, Send, Camera, Loader2, CheckCircle } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

const IssueReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCategory = location.state?.selectedCategory || "Infrastructure";

  const [category, setCategory] = useState(initialCategory);
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  // Handle photo upload and preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert("Photo is too large. Maximum size is 10 MB.");
      return;
    }
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !area || !description || !photo) {
      alert("Please fill in all required fields.");
      return;
    }

    if (photo.size > MAX_FILE_SIZE) {
      alert("Photo is too large. Maximum size is 10 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("area", area);
    formData.append("description", description);
    formData.append("photo", photo);

    try {
      setStatus("loading");
      const token = localStorage.getItem("token");
      const res = await fetch(API_ENDPOINTS.COMPLAINTS, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setStatus("idle");
        alert(data.message || "Failed to submit complaint");
      }
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Server error. Please try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center px-4 py-16 relative"
    >
      {/* Overlay for loading/success */}
      <AnimatePresence>
        {status !== "idle" && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-50"
          >
            {status === "loading" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/80 p-6 rounded-2xl shadow-lg flex flex-col items-center gap-3"
              >
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-gray-700 font-semibold text-lg">
                  Submitting your complaint...
                </p>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/90 p-6 rounded-2xl shadow-lg flex flex-col items-center gap-3"
              >
                <CheckCircle className="text-green-500" size={50} />
                <p className="text-gray-800 font-semibold text-lg">
                  Submitted Successfully!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          className="relative mb-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-lg">
            Report an Issue
          </h1>
          <p className="text-gray-600 mt-2">
            Help us improve your city by reporting issues.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/30"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/30 shadow-inner focus:ring-2 focus:ring-blue-400 transition-all"
              >
                <option value="Infrastructure">Infrastructure</option>
                <option value="Water & Sanitation">Water & Sanitation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Area / Location
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  placeholder="e.g., Park St, Sector 5"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-white/30 shadow-inner focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <div className="relative">
                <MessageCircle
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Provide details about the issue..."
                  rows="4"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-white/30 shadow-inner focus:ring-2 focus:ring-blue-400 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Upload Photo
              </label>
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-all bg-white/50 backdrop-blur-sm">
                <input
                  type="file"
                  className="hidden"
                  onChange={handlePhotoChange}
                  accept="image/*"
                />
                <div className="flex flex-col items-center text-gray-500">
                  <Camera size={28} className="mb-2" />
                  {photo ? "Change Photo" : "Click to Upload"}
                </div>
              </label>
              {photoPreview && (
                <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <motion.button
              type="button"
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={status !== "idle"}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-medium bg-gray-200 text-gray-700 shadow-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <CornerUpLeft size={18} />
                Go Back
              </div>
            </motion.button>

            <motion.button
              type="submit"
              disabled={status !== "idle"}
              whileHover={status === "idle" ? { scale: 1.05 } : {}}
              whileTap={status === "idle" ? { scale: 0.95 } : {}}
              className={`w-full sm:w-auto px-8 py-3 rounded-full text-sm font-semibold text-white shadow-lg transition-all ${
                status !== "idle"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {status === "loading" ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                {status === "loading" ? "Submitting..." : "Submit"}
              </div>
            </motion.button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default IssueReportPage;
