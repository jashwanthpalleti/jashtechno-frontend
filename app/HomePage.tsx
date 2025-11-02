"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AnimatedPressable from "./components/AnimatedPressable";
import ImageComparison from "./components/ImageComparison";
import {
  IoFlashOutline,
  IoCafeOutline,
  IoGlobeOutline,
  IoBrush,
  IoBandageOutline,
} from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { FaPaintBrush } from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* HERO */}
      
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-100 to-white border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
              >
                Something beyond your business <br /> for your business
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="mt-5 text-lg text-gray-600 max-w-xl"
              >
                We craft modern websites & digital solutions to grow your business.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <AnimatedPressable onClick={() => router.push("/contact")}>
                  <div className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-8 rounded-lg shadow-md transition">
                    Get Started
                  </div>
                </AnimatedPressable>

                {/* NEW: Pricing Plans button */}
                <AnimatedPressable onClick={() => router.push("#")}>
                  <div
                    className="inline-block bg-white hover:bg-gray-100 text-sky-700 font-semibold py-3 px-8 rounded-lg shadow-md border border-sky-200 transition"
                    aria-label="View Pricing Plans"
                  >
                    Pricing Plans
                  </div>
                </AnimatedPressable>
              </motion.div>
            </div>

            {/* Slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl shadow-2xl border border-sky-100 overflow-hidden bg-white"
            >
              <ImageComparison />
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why" className="relative py-24 bg-gradient-to-br from-white to-sky-50 border-y-8 border-sky-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-sky-700 mb-3">Why Choose Us?</h2>
            <div className="h-1 w-24 bg-sky-400 mx-auto rounded-full"></div>
          </div>

          {/* 2 x 2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <BlueCard
              icon={<IoFlashOutline className="text-5xl text-sky-600" />}
              title="Fast Delivery"
              text="We build and launch projects on time, so your business never waits."
            />
            <BlueCard
              icon={<MdAttachMoney className="text-5xl text-green-600" />}
              title="Affordable Pricing"
              text="Professional services at startup-friendly prices — no hidden costs."
            />
            <BlueCard
              icon={<FaPaintBrush className="text-5xl text-yellow-500" />}
              title="Modern Designs"
              text="Sleek, user-friendly websites tailored to your brand identity."
            />
            <BlueCard
              icon={<IoBandageOutline className="text-5xl text-blue-500" />}
              title="Ongoing Support"
              text="We stay with you after launch to ensure your success."
            />
          </div>
        </div>

        {/* subtle glow bars */}
        <div className="absolute inset-x-0 top-0 h-[8px] bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 blur-md opacity-60"></div>
        <div className="absolute inset-x-0 bottom-0 h-[8px] bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 blur-md opacity-60"></div>
      </section>

      {/* OUR WORKS */}
      <section id="works" className="py-24 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-sky-700 text-center mb-14">
            Our Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <WorkCard
              icon={<IoGlobeOutline className="text-4xl text-sky-600" />}
              title="Websites"
              text="From landing pages to e-commerce, we create stunning websites that convert visitors into customers."
            />
            <WorkCard
              icon={<IoBrush className="text-4xl text-orange-500" />}
              title="Branding"
              text="Logos, brand kits, and design systems that make you stand out in the crowd."
            />
            <WorkCard
              icon={<IoCafeOutline className="text-4xl text-yellow-500" />}
              title="Bagel Store Website"
              text="A sleek dark & gold styled website designed for a local bagel shop."
              button={{
                label: "View Project",
                onClick: () => router.push("/works"),
              }}
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-white border-t border-sky-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-sky-700 text-center mb-14">
            What Our Clients Say
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <Testimonial
              quote="Jash Techno built us a beautiful website in record time. Our sales grew 150% after launch!"
              author="Happy Client"
            />
            <Testimonial
              quote="Affordable and professional. They treated my small business like it was a big brand."
              author="Startup Owner"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 bg-gradient-to-r from-sky-600 to-sky-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Let’s build your website today 🚀
          </h2>
          <AnimatedPressable onClick={() => router.push("/contact")}>
            <div className="bg-white text-sky-700 font-bold py-3 px-10 rounded-full shadow-lg hover:bg-gray-100 transition inline-block">
              Contact Us
            </div>
          </AnimatedPressable>
        </div>
      </section>
    </>
  );
}

/* ======================= helpers ======================= */

function BlueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="bg-white border border-sky-100 rounded-2xl p-10 shadow-[0_10px_25px_rgba(56,189,248,0.15)] hover:shadow-[0_15px_30px_rgba(56,189,248,0.25)] transition-all text-center"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{text}</p>
    </motion.div>
  );
}

function WorkCard({
  icon,
  title,
  text,
  button,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  button?: { label: string; onClick: () => void };
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl border border-sky-100 text-center"
    >
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-5">{text}</p>
      {button && (
        <AnimatedPressable onClick={button.onClick}>
          <div className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-6 rounded-lg shadow-md transition">
            {button.label}
          </div>
        </AnimatedPressable>
      )}
    </motion.div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-sky-50 rounded-2xl p-8 shadow-md border border-sky-100"
    >
      <p className="italic text-gray-800 mb-3 text-lg leading-relaxed">“{quote}”</p>
      <p className="font-semibold text-sky-700">{author}</p>
    </motion.div>
  );
}
