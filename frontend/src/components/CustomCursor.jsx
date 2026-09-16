import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    // Check if device is a touch screen
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track interactive hover state using efficient event delegation (zero DOM overhead)
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target &&
        target.closest &&
        target.closest("a, button, input, textarea, select, [role='button'], .cursor-pointer")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Inner Precision Dot */}
      <motion.div
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isClicked ? 0.6 : isHovered ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 1200, damping: 50, mass: 0.1 }}
        className="fixed w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80 pointer-events-none"
      />

      {/* Outer Magnetic Trailing Ring */}
      <motion.div
        animate={{
          x: mousePosition.x - 18,
          y: mousePosition.y - 18,
          scale: isClicked ? 0.7 : isHovered ? 1.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className={`fixed w-9 h-9 rounded-full border pointer-events-none transition-colors duration-200 ${
          isHovered
            ? "border-cyan-400 bg-cyan-500/20 backdrop-blur-xs shadow-md shadow-cyan-500/30"
            : darkMode
            ? "border-cyan-400/60 bg-transparent"
            : "border-cyan-600/60 bg-transparent"
        }`}
      />
    </div>
  );
};

export default CustomCursor;
