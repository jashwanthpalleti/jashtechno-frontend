"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REVEAL_THRESHOLD = 18;
const MAX_ROT = 42;
const SENSITIVITY = 0.55;

// fixed sizes (px)
const HEADER_HEIGHT = 120;
const CUP_SIZE = 72;
const SHADOW_W = 90;
const SHADOW_H = 8;

export default function CoffeeShopHero() {
  const [rot, setRot] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const draggingRef = useRef(false);
  const startX = useRef(0);
  const startRot = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    startX.current = e.clientX;
    startRot.current = rot;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startX.current;
    const next = startRot.current + dx * SENSITIVITY;
    const clamped = Math.max(-MAX_ROT, Math.min(MAX_ROT, next));
    setRot(clamped);

    if (!revealed && Math.abs(clamped) >= REVEAL_THRESHOLD) {
      setRevealed(true);
      window.dispatchEvent(new CustomEvent("coffee:reveal-nav"));
    }
  };

  const stopDragging = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false; // no spring-back
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setRot((r) => Math.max(-MAX_ROT, r - 6));
    if (e.key === "ArrowRight") setRot((r) => Math.min(MAX_ROT, r + 6));
    if ((e.key === "Enter" || e.key === " ") && Math.abs(rot) >= REVEAL_THRESHOLD) {
      setRevealed(true);
      window.dispatchEvent(new CustomEvent("coffee:reveal-nav"));
    }
  };

  return (
    <section
      className="relative w-full border-b border-stone-200 bg-gradient-to-b from-stone-100 to-stone-200"
      style={{ height: HEADER_HEIGHT }}
    >
      {/* Optional slide-down nav */}
      <AnimatePresence>
        {revealed && (
          <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="fixed inset-x-0 top-0 z-[60] mx-auto w-full border-b border-stone-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/65"
            role="navigation"
            aria-label="Coffee Nav"
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2">
              <div className="font-extrabold tracking-tight text-stone-800 text-sm">
                Coffee House
              </div>
              <ul className="hidden md:flex items-center gap-6 text-stone-700 text-sm">
                <li><a href="#menu" className="hover:text-stone-900">Menu</a></li>
                <li><a href="#story" className="hover:text-stone-900">Our Story</a></li>
                <li><a href="#visit" className="hover:text-stone-900">Visit</a></li>
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Left label */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[50] select-none">
        <h1 className="text-xl font-extrabold text-stone-900 leading-none">Coffee House</h1>
        <p className="mt-1 text-xs text-stone-600">Drag to rotate</p>
      </div>

      {/* Cup cluster — right side */}
      <div className="absolute inset-y-0 right-6 grid place-items-center">
        <div
          className="relative select-none touch-none cursor-grab"
          role="button"
          aria-label="Coffee cup — drag handle to rotate"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onPointerLeave={stopDragging}
          style={{ width: CUP_SIZE + 40, height: CUP_SIZE + 20 }}
        >
          {/* Shadow (fixed) */}
          <motion.div
            style={{
              width: SHADOW_W,
              height: SHADOW_H,
              left: "50%",
              transform: "translateX(-50%)",
              filter: `blur(${Math.abs(rot) * 0.04}px)`,
              bottom: -4,
            }}
            className="absolute rounded-full bg-black/10"
          />

          {/* Cup (fixed) */}
          <motion.div
            style={{
              width: CUP_SIZE,
              height: CUP_SIZE,
              rotate: rot,
              transformOrigin: "70% 50%",
            }}
            className="relative"
          >
            <CupSVG className="h-full w-full drop-shadow-2xl" />
            {/* Handle hotspot (fixed) */}
            <div
              className="absolute -translate-y-1/2"
              style={{ right: 6, top: "50%", width: 30, height: 30 }}
              aria-hidden="true"
              title="Grab handle"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* SVG cup */
function CupSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 320" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e7e5e4" />
        </linearGradient>
      </defs>
      <g>
        <rect x="70" y="60" rx="24" ry="24" width="140" height="180" fill="url(#cup)" stroke="#d6d3d1" strokeWidth="2"/>
        <rect x="95" y="80" rx="8" ry="8" width="90" height="10" fill="#d6d3d1" opacity=".7"/>
        <ellipse cx="140" cy="60" rx="64" ry="14" fill="#4a2c2a" />
        <ellipse cx="140" cy="60" rx="70" ry="18" fill="none" stroke="#a8a29e" strokeWidth="4"/>
        <path d="M210 110 q50 20 50 60 t-50 60" fill="none" stroke="#cfc9c4" strokeWidth="18" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
