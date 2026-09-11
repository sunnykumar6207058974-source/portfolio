import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSparkles } from "react-icons/hi";

const LoadingScreen = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const loadingMessages = [
    "Initializing PixelForge Engine...",
    "Loading Assets & Components...",
    "Preparing Interactive Demos...",
    "Welcome to Sunny's Portfolio ✨",
  ];

  useEffect(() => {
    // Progress counter interval
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.floor(Math.random() * 8) + 5;
        return Math.min(prev + diff, 100);
      });
    }, 55);

    // Text message interval
    const messageTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 450);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100 && onFinished) {
      const timeout = setTimeout(() => {
        onFinished();
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [progress, onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[99999] bg-slate-950 text-white flex flex-col items-center justify-center p-6 overflow-hidden select-none"
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Center Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        {/* Brand Text Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-8"
        >
          <img
            src="/logo.png"
            alt="PixelForge Logo"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-400/60 shadow-lg shadow-cyan-500/30"
          />
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
            PixelForge
          </span>
        </motion.div>

        {/* Progress Number */}
        <div className="text-5xl sm:text-6xl font-black text-cyan-400 font-mono tracking-tighter mb-4">
          {progress}%
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-6 border border-slate-800 p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 rounded-full shadow-md shadow-cyan-400/50"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.1 }}
          />
        </div>

        {/* Cycling Loading Message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-xs sm:text-sm text-slate-400 font-mono tracking-wide min-h-[1.5rem]"
          >
            {loadingMessages[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Footer Tag */}
      <div className="absolute bottom-8 text-xs text-slate-600 font-medium">
        Designed & Developed by Sunny Kumar
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
