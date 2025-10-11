"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

/**
 * 🚀 Modern Image Comparison Slider
 * - Auto slides slowly
 * - Supports drag and touch
 * - Clean futuristic blue-white design
 */

export default function ImageComparison() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // 🌊 Smooth auto-slide effect (loop)
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev >= 95 ? 5 : prev + 0.5));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percent)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percent)));
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* 🌆 Image Comparison Container */}
      <div
        ref={containerRef}
        onMouseMove={handleDrag}
        onTouchMove={handleTouchMove}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl border border-sky-100 cursor-ew-resize"
      >
        {/* Before Image */}
        <Image
          src="/images/house-before.png"
          alt="Before Website"
          width={1000}
          height={600}
          className="w-full object-cover transition-all duration-300"
        />

        {/* Overlay with After Image */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden transition-all duration-300"
          style={{ width: `${position}%` }}
        >
          <Image
            src="/images/house-after.png"
            alt="After Website"
            width={1000}
            height={600}
            className="w-full object-cover"
          />
        </div>

        {/* Center Drag Line */}
        <motion.div
          animate={controls}
          className="absolute top-0 bottom-0 w-[3px] bg-sky-500 shadow-lg"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          {/* Circle Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-[10px] w-5 h-5 bg-sky-500 border-4 border-white rounded-full shadow-md"></div>
        </motion.div>

        {/* Text Labels */}
        <p className="absolute bottom-4 left-4 text-sm md:text-base font-semibold bg-white/70 text-sky-700 px-3 py-1 rounded">
          Before Website
        </p>
        <p className="absolute bottom-4 right-4 text-sm md:text-base font-semibold bg-white/70 text-sky-700 px-3 py-1 rounded">
          After Website
        </p>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition"
        onClick={() => alert("🚀 Let's build your website!")}
      >
        🚀 Get Your Website Today
      </motion.button>
    </div>
  );
}
