import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import man1 from "./man1.png";
import bg from "./bg.png";

const Frontpage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Particle effect using canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
      }));
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 182, 193, 0.6)";
        ctx.shadowColor = "rgba(138,43,226,0.85)";
        ctx.shadowBlur = 20;
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

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden
      bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100"
    >
      {/* Inline CSS for gradient animation */}
      <style>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-move 6s ease infinite;
        }
      `}</style>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Textured Pattern Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          backgroundPositionY: "-50px",
          opacity: 0.08,
        }}
      />

      {/* Mesh Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-2000" />
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/70 z-0" />

      {/* Neon/Holographic Title */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-6 text-4xl md:text-6xl font-extrabold tracking-widest
          text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
          animate-gradient drop-shadow-[0_0_20px_rgba(138,43,226,0.85)] relative z-20"
      >
        SevaSetu
        <span
          className="absolute left-1/2 -bottom-2 w-20 h-1 rounded-full
            bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
            transform -translate-x-1/2 animate-pulse"
        />
      </motion.h1>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col md:flex-row items-center justify-between
          px-6 md:px-16 lg:px-24 py-16 w-full max-w-7xl space-y-10 md:space-y-0"
      >
        {/* Left Text Section */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900
              drop-shadow-[0_0_10px_rgba(255,182,193,0.5)]"
          >
            Empowering Communities,&nbsp;
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              Building Better Places
            </span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-gray-700 max-w-lg mx-auto md:mx-0 leading-relaxed"
          >
            SevaSetu connects citizens with local authorities to report, track,
            and resolve community issues – making neighborhoods safer, cleaner,
            and stronger.
          </motion.p>

          <motion.button
            onClick={() => navigate("/auth")}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 25px rgba(236,72,153,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="px-7 py-3 text-lg font-semibold text-white
              bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
              rounded-full shadow-lg hover:shadow-xl"
          >
            Get Started
          </motion.button>
        </div>

        {/* Right Hero Image */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="flex-1 flex justify-center"
        >
          <img
            src={man1}
            alt="SevaSetu App"
            className="w-4/5 max-w-md rounded-3xl shadow-2xl border-4 border-white/60"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Frontpage;
