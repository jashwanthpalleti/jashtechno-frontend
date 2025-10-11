"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Bagel Store page (web)
 * - Uses Next/Image for local assets under /public/images/bagelimages/**
 * - No Navbar here (keep Navbar only in app/layout.tsx)
 * - Tailwind for styling
 */
export default function BagelStorePage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {/* Top band for subtle depth */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-400/40 via-sky-400/60 to-blue-400/40" />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO: two side-by-side images */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left hero tile */}
          <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg md:h-80">
            <Image
              src="/images/bagelimages/bagel_images/allbagels.jpg"
              alt="Freshly baked bagels"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 grid place-items-center">
              <h1 className="text-2xl font-extrabold tracking-wide md:text-3xl">
                Freshly Baked
              </h1>
            </div>
          </div>

          {/* Right hero tile */}
          <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg md:h-80">
            <Image
              src="/images/bagelimages/bagel_images/allbagels2.jpg"
              alt="Every morning freshness"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 grid place-items-center">
              <h2 className="text-2xl font-extrabold tracking-wide md:text-3xl">
                Every Morning
              </h2>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-6 flex justify-center">
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05, opacity: 0.95 }}>
            <Link
              href="/menu"
              className="rounded-lg bg-[#facc15] px-6 py-3 font-bold text-black shadow-md transition hover:bg-yellow-300"
            >
              See Menu
            </Link>
          </motion.div>
        </div>

        {/* ABOUT */}
        <section className="mt-10 rounded-xl border border-blue-400/20 bg-[rgba(6,90,225,0.15)] p-6 shadow-lg">
          <h3 className="mb-2 text-center text-2xl font-bold text-[#facc15]">About Us</h3>
          <p className="mx-auto max-w-3xl text-center text-[#e5e7eb]">
            At <span className="font-semibold">Bagel Bliss</span>, we’ve been baking happiness
            since 1998. From sesame to gourmet cream cheese bagels, everything is made with
            fresh ingredients and a touch of love.
          </p>
        </section>

        {/* REVIEWS */}
        <section className="mt-6 rounded-xl border border-emerald-400/20 bg-[rgba(25,215,95,0.10)] p-6 shadow-lg">
          <h3 className="mb-4 text-center text-2xl font-bold text-[#facc15]">⭐ Customer Reviews</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <ReviewCard
              text='"Best bagels in town! Crispy outside, soft inside."'
              author="— Sarah L."
            />
            <ReviewCard
              text='"Their cream cheese flavors are unbeatable!"'
              author="— Mike R."
            />
            <ReviewCard
              text='"I stop by every morning on my way to work. Love this place."'
              author="— Jasmine K."
            />
          </div>
        </section>

        {/* LOCATION */}
        <section className="mt-6 rounded-xl border border-yellow-400/20 bg-[rgba(250,204,21,0.08)] p-6 shadow-lg">
          <h3 className="mb-2 text-center text-2xl font-bold text-[#facc15]">📍 Our Location</h3>
          <div className="space-y-1 text-center text-[#e5e7eb]">
            <p>123 Bagel Street, Foodtown, NY</p>
            <p>Mon–Sat: 7 AM – 6 PM</p>
            <p>Sunday: Closed</p>
          </div>

          <div className="relative mx-auto mt-4 h-48 w-full overflow-hidden rounded-lg md:h-60">
            <Image
              src="/images/bagelimages/bagel_images/bagelbg.png"
              alt="Bagel Bliss map / background"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* FOOTER for this page area (global footer still appears if you render it in layout) */}
        <footer className="mx-auto mt-8 max-w-5xl border-t border-slate-700/60 py-6 text-center">
          <p className="text-sm text-slate-300">
            © 2025 Bagel Bliss. All rights reserved.
          </p>
          <p className="mt-1 text-xs text-slate-400">Designed by Jash Techno</p>
        </footer>
      </div>
    </main>
  );
}

function ReviewCard({ text, author }: { text: string; author: string }) {
  return (
    <div className="rounded-lg bg-[#1e293b] p-4 shadow">
      <p className="mb-2 text-[15px] italic text-[#f3f4f6]">{text}</p>
      <p className="text-sm font-semibold text-[#facc15]">{author}</p>
    </div>
  );
}
