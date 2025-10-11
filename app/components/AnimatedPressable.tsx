"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedPressableProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ✅ Web version of AnimatedPressable
 * Smooth hover & tap animations using Framer Motion.
 * Works perfectly in Next.js with TypeScript.
 */
const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  onClick,
  className = "",
  style = {},
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05, opacity: 0.95 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className={`inline-block cursor-pointer ${className}`}
      style={style}
      role="button"               // ✅ Accessibility
      tabIndex={0}                // ✅ Keyboard focus
      onKeyDown={(e) => e.key === "Enter" && onClick?.()} // ✅ Enter key support
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPressable;
