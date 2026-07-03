import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  Droplets,
  MoreHorizontal,
  Sparkles,
  User,
  FileText,
  LogOut,
  Eye,
  MessageCircle,
  Home,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const categoryIcons = {
  Infrastructure: Building,
  "Water & Sanitation": Droplets,
  Other: MoreHorizontal,
};

const UserDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedThought, setSelectedThought] = useState(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const categories = [
    { id: 1, name: "Infrastructure", desc: "Roads, lights, buildings" },
    { id: 2, name: "Water & Sanitation", desc: "Clean water, drainage" },
    { id: 3, name: "Other", desc: "Any other civic issue" },
  ];

  const faqs = [
    { q: "What is SevaSetu?", a: "SevaSetu is a platform to report civic issues and connect with authorities." },
    { q: "How to report an issue?", a: "Select a category, provide details, and submit your report." },
    { q: "Is this service free?", a: "Yes, SevaSetu is completely free to use." },
    { q: "Can I track my issue?", a: "Yes, you can track updates on your submitted issues." },
    { q: "Do I need to sign up?", a: "You need an account to submit and track issues." },
    { q: "Who responds to issues?", a: "Local authorities and civic bodies linked with SevaSetu." },
  ];

  const thoughts = [
    { id: 1, icon: Eye, message: "Be the eyes of your city; see a problem, own the solution. 👁️" },
    { id: 2, icon: MessageCircle, message: "Civic duty isn't just voting—it's speaking up for your street. 🗣️" },
    { id: 3, icon: Home, message: "Your neighborhood is a shared project; contribute your voice daily. 🏘️" },
    { id: 4, icon: Globe, message: "Small actions create the big bridge to a better tomorrow. 🌉" },
  ];

  const thoughtPositions = [
    { top: "8%", left: "10%" },
    { top: "10%", left: "65%" },
    { top: "18%", left: "25%" },
    { top: "12%", left: "80%" },
  ];

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    toast.success(`Selected category: ${catName}`);
    navigate("/report", { state: { selectedCategory: catName } });
  };

const handleSignOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  toast.success("Signed out successfully!");

  setTimeout(() => {
    navigate("/", { replace: true });
  }, 800);
};

  const handleReportedIssues = () => {
    navigate("/My-reports");
  };

  // Background particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 35 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
      }));
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 182, 193, 0.3)";
        ctx.shadowColor = "rgba(236,72,153,0.4)";
        ctx.shadowBlur = 8;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    drawParticles();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (selectedThought !== null) {
      const timer = setTimeout(() => setSelectedThought(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [selectedThought]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen px-4 sm:px-6 md:px-10 py-16 font-sans overflow-hidden text-gray-900"
      style={{ background: "linear-gradient(135deg, #fdf6f7, #e3f2fd)" }}
    >
      <Toaster />
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Gradient blobs */}
      <div className="absolute top-[-20%] left-[-15%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse delay-2000" />
      <div className="absolute top-[20%] right-[10%] w-[220px] sm:w-[300px] h-[220px] sm:h-[300px] bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-1000" />

      {/* Profile Dropdown */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 bg-white/70 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            <User className="w-5 h-5 text-gray-800" />
            <span className="hidden sm:inline font-medium text-gray-900">Profile</span>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-44 sm:w-48 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
              >
                <button
                  onClick={handleReportedIssues}
                  className="w-full flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100 transition-all gap-2 text-sm sm:text-base"
                >
                  <FileText className="w-4 h-4" /> Reported Issues
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100 transition-all gap-2 text-sm sm:text-base"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-14 sm:mb-20 relative z-10">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="inline-block px-8 sm:px-10 py-5 sm:py-6 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 shadow-xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest text-white drop-shadow-[0_0_18px_rgba(236,72,153,0.5)]">
            SevaSetu
          </h1>
        </motion.div>
        <p className="mt-5 text-lg sm:text-xl md:text-2xl font-light text-gray-700">
          Your Bridge to Better Civic Services
        </p>
      </div>

      {/* Floating Awareness Icons (Hidden on small screens) */}
      <div className="hidden md:block">
        {thoughts.map((thought, idx) => {
          const Icon = thought.icon;
          return (
            <div
              key={thought.id}
              className="absolute cursor-pointer z-20"
              style={{ top: thoughtPositions[idx].top, left: thoughtPositions[idx].left }}
              onClick={() => setSelectedThought(selectedThought === thought.id ? null : thought.id)}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2 + idx * 0.3 }}
                className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg"
              >
                <Icon className="w-6 h-6 text-indigo-500" />
              </motion.div>

              <AnimatePresence>
                {selectedThought === thought.id && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: -10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -10 }}
                    className="absolute mt-2 p-3 w-64 bg-pink-50 rounded-2xl shadow-lg text-gray-900 text-sm border border-gray-200"
                  >
                    {thought.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto relative z-10 px-2 sm:px-4 md:px-6">
        <div className="mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-10 text-center text-gray-800">
            Select a Category
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, index) => {
              const IconComponent = categoryIcons[cat.name];
              return (
                <motion.div
                  key={cat.id}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover={{ scale: 1.03, boxShadow: "0 12px 25px rgba(236,72,153,0.2)" }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="relative p-6 sm:p-8 rounded-3xl cursor-pointer transition-all bg-white/70 backdrop-blur-lg border border-transparent shadow-md hover:border-pink-300/50 hover:ring-1 hover:ring-pink-300/50"
                >
                  <div className="flex items-center space-x-4 mb-3 sm:mb-4">
                    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-full">
                      <IconComponent className="h-6 w-6 text-indigo-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{cat.name}</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700">{cat.desc}</p>
                </motion.div>
              );
            })}
          </div>
          {selectedCategory && (
            <p className="mt-10 sm:mt-12 text-center font-semibold text-base sm:text-lg text-gray-700">
              You've selected:{" "}
              <span className="underline font-bold text-gray-900">{selectedCategory}</span>
            </p>
          )}
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-10 text-center text-gray-800">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(236,72,153,0.15)" }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative p-5 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-transparent shadow-md transition-all hover:ring-1 hover:ring-pink-300/30"
              >
                <div className="flex items-start mb-2">
                  <Sparkles className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1 mr-3" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{faq.q}</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
