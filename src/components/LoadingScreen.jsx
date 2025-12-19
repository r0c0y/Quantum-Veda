import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAR_SAMPLES = ["*", ".", "✦", "✧", "°", "+", "·"];

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState("blackhole"); // blackhole, logo, exit
  const [stars, setStars] = useState([]);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  // ASCII Blackhole/Donut Animation
  useEffect(() => {
    if (phase !== "blackhole") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 80;
    const height = 40;
    let A = 0;
    let B = 0;

    const renderFrame = () => {
      const output = [];
      const zbuffer = [];

      // Initialize buffers
      for (let i = 0; i < width * height; i++) {
        output[i] = " ";
        zbuffer[i] = 0;
      }

      // Donut rendering algorithm - BIGGER SIZE with better orientation
      for (let j = 0; j < 6.28; j += 0.07) {
        for (let i = 0; i < 6.28; i += 0.02) {
          const sinA = Math.sin(A);
          const cosA = Math.cos(A);
          const sinB = Math.sin(B);
          const cosB = Math.cos(B);

          const sini = Math.sin(i);
          const cosi = Math.cos(i);
          const sinj = Math.sin(j);
          const cosj = Math.cos(j);

          const h = cosj + 2;
          const D = 1 / (sini * h * sinA + sinj * cosA + 5);
          const t = sini * h * cosA - sinj * sinA;

          // Better orientation - tilted for full visibility
          const x = Math.floor(width / 2 + 40 * D * (cosi * h * cosB - t * sinB));
          const y = Math.floor(height / 2 + 20 * D * (cosi * h * sinB + t * cosB));
          const o = x + width * y;
          const N = Math.floor(
            8 *
            ((sinj * sinA - sini * cosj * cosA) * cosB -
              sini * cosj * sinA -
              sinj * cosA -
              cosi * cosj * sinB)
          );

          if (height > y && y > 0 && x > 0 && width > x && D > zbuffer[o]) {
            zbuffer[o] = D;
            output[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
          }
        }
      }

      // Convert to string
      let result = "";
      for (let k = 0; k < width * height; k++) {
        result += k % width ? output[k] : "\n";
      }

      canvas.textContent = result;

      // Different rotation speeds for better visibility
      A += 0.05;
      B += 0.03;
    };

    // Animation loop
    const interval = setInterval(renderFrame, 50);

    // Transition to logo after 6 seconds
    const timer = setTimeout(() => {
      setPhase("logo");
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [phase]);

  // Progress bar animation
  useEffect(() => {
    if (phase !== "blackhole") return;

    const duration = 6000; // 6 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
      }
    }, interval);

    return () => clearInterval(progressInterval);
  }, [phase]);

  // Generate twinkling stars
  useEffect(() => {
    const newStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      char: STAR_SAMPLES[Math.floor(Math.random() * STAR_SAMPLES.length)],
      delay: Math.random() * 2,
    }));
    setStars(newStars);
  }, []);

  const handleEnter = () => {
    if (phase === "logo") {
      setPhase("exit");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-[100] bg-near-black flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${phase === "logo" ? "cursor-pointer" : ""
          }`}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        onClick={handleEnter}
      >
        {/* Twinkling Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((star) => (
            <motion.span
              key={star.id}
              className="absolute text-white/40 text-xs"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + (star.id % 2),
                repeat: Infinity,
                delay: star.delay,
              }}
            >
              {star.char}
            </motion.span>
          ))}
        </div>

        {/* Phase 1: ASCII Blackhole Animation */}
        {phase === "blackhole" && (
          <motion.div
            className="relative z-10 flex flex-col items-center w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Donut Animation */}
            <pre
              ref={canvasRef}
              className="text-soft-teal font-mono text-[6px] md:text-[8px] leading-[0.7] md:leading-[0.8] select-none mb-8"
              style={{
                textShadow: "0 0 10px rgba(94, 234, 212, 0.5)",
              }}
            />

            {/* Progress Bar - Between donut and text */}
            <div className="w-full max-w-md mb-6 px-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 font-mono text-xs tracking-wider uppercase">
                  Initializing
                </span>
                <span className="text-soft-teal font-mono text-sm font-bold">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-soft-teal via-white to-soft-teal rounded-full"
                  style={{
                    width: `${progress}%`,
                    boxShadow: "0 0 20px rgba(94, 234, 212, 0.6)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Status Text */}
            <motion.p
              className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Quantum Systems Online...
            </motion.p>
          </motion.div>
        )}

        {/* Phase 2: Logo and Interaction - SIMPLIFIED */}
        {phase === "logo" && (
          <motion.div
            className="flex flex-col items-center relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Simple logo - no glowing ring */}
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <img
                src="/logo.jpg"
                alt="TQV Logo"
                className="w-40 h-40 object-contain rounded-full mb-6 p-2 relative z-10"
              />
            </motion.div>

            <motion.h1
              className="text-5xl text-white font-display font-bold tracking-widest mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              QUANTUM VEDA
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="h-8 mt-4"
            >
              <p className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
                Click anywhere to enter
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Phase 3: Background Wipe */}
        {phase === "exit" && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
