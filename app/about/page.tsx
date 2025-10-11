"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaPaintBrush,
  FaWhatsapp,
  FaHandshake,
} from "react-icons/fa";
import { IoRocketOutline, IoPersonCircleOutline } from "react-icons/io5";
import { MdShowChart, MdEmail } from "react-icons/md";

export default function AboutPage() {
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🌟 Hero Section */}
      <section className="flex flex-col items-center px-6 pt-16 pb-12 text-center bg-gradient-to-b from-blue-50 to-gray-50">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About Us
        </motion.h1>
        <p className="max-w-xl text-gray-600">
          Building digital solutions for small businesses with passion and purpose.
        </p>
      </section>

      {/* 🎯 Mission Section */}
      <Section title="Our Mission">
        <p className="text-center text-gray-700 leading-relaxed">
          At <span className="font-semibold text-blue-600">Jash Techno</span>, we believe every small
          business deserves a strong digital presence. Our mission is to deliver modern, affordable, and
          scalable solutions — from websites to branding — that empower entrepreneurs to grow online.
        </p>
      </Section>

      {/* 💡 Values */}
      <Section title="Our Values">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          <ValueCard
            icon={<FaHandshake className="text-blue-500 text-4xl" />}
            title="Trust"
            text="We build lasting relationships with transparency and reliability."
          />
          <ValueCard
            icon={<IoRocketOutline className="text-green-600 text-4xl" />}
            title="Innovation"
            text="We use the latest technology to craft future-ready solutions."
          />
          <ValueCard
            icon={<FaPaintBrush className="text-yellow-500 text-3xl" />}
            title="Creativity"
            text="Our designs are modern, unique, and crafted to tell your story."
          />
          <ValueCard
            icon={<MdShowChart className="text-red-600 text-4xl" />}
            title="Growth"
            text="We focus on solutions that help businesses scale sustainably."
          />
        </div>
      </Section>

      {/* 👤 Founder Section */}
      <Section title="Meet the Founder">
        <p className="text-center text-gray-700 leading-relaxed">
          <span className="font-semibold text-blue-600">Jashwanth Palleti</span>, CEO of{" "}
          <span className="font-semibold text-blue-600">Jash Techno</span>, is passionate about empowering
          small businesses through technology. With expertise in web development, digital marketing, and
          AI, he ensures every client receives solutions that blend creativity with performance.
        </p>
        <p className="text-center text-gray-700 mt-3">
          🎓 He holds a <span className="font-semibold text-blue-600">Master’s in Computer Science</span>{" "}
          from <span className="font-semibold text-blue-600">Rowan University</span>.
        </p>

        {/* Instagram link */}
        <motion.a
          href="https://www.instagram.com/jashtechno/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center mt-5 text-pink-600 font-semibold hover:text-pink-700"
          whileHover={{ scale: 1.05 }}
        >
          <FaInstagram className="text-2xl mr-2" />
          @jashtechno
        </motion.a>
      </Section>

      {/* 📞 Contact Section */}
      <Section
        title="Get in Touch"
        refProp={contactRef}
        className="bg-yellow-50 border border-yellow-200"
      >
        <div className="space-y-3">
          <ContactRow icon={<IoPersonCircleOutline className="text-blue-600 text-2xl" />} text="Jashwanth Palleti" />
          <ContactRow icon={<MdEmail className="text-red-600 text-2xl" />} text="jash@jashtechno.com" />
          <ContactRow icon={<FaWhatsapp className="text-green-600 text-xl" />} text="+1 8562000159 (WhatsApp)" />
        </div>
      </Section>

      {/* 🚀 CTA */}
      <section className="text-center bg-blue-700 py-12 px-6 text-white rounded-t-3xl">
        <h3 className="text-2xl font-bold mb-4">
          Ready to grow your business with us?
        </h3>
        <button
          onClick={scrollToContact}
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition"
        >
          Contact Us 🚀
        </button>
      </section>
    </div>
  );
}

/* ---------- Sub Components ---------- */
function Section({
  title,
  children,
  refProp,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  refProp?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <section
      ref={refProp as React.RefObject<HTMLDivElement>}
      className={`max-w-5xl mx-auto my-10 px-6 py-8 bg-white rounded-2xl shadow-md ${className}`}
    >
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">{title}</h2>
      {children}
    </section>
  );
}


function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-gray-100 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition">
      <div className="flex justify-center mb-3">{icon}</div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center justify-center gap-3 border-b border-gray-200 py-2">
      {icon}
      <p className="text-gray-700 text-base">{text}</p>
    </div>
  );
}
