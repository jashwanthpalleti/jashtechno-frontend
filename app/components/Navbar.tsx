"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/" },
    { label: "Our Works", href: "/works" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-sky-600/90 backdrop-blur border-b border-white/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* Logo → Home */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Jash Techno"
            width={160}
            height={55}
            priority
            className="h-10 w-auto md:h-14"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`font-medium transition ${
                    active ? "text-white" : "text-white/90 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/contact"
              className="ml-2 rounded-md bg-yellow-400 px-4 py-2 font-semibold text-black shadow hover:bg-yellow-300 transition"
            >
              Get a Website
            </Link>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-white md:hidden"
        >
          <span className="text-2xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="overflow-hidden md:hidden"
          >
            <div className="space-y-1 border-top border-white/10 bg-sky-800 px-4 pb-4 pt-2">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-3 py-2 transition ${
                      active
                        ? "bg-sky-700 text-white"
                        : "text-white/90 hover:bg-sky-700 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Link
                href="/get-a-website"
                onClick={() => setOpen(false)}
                className="mt-2 inline-block rounded-md bg-yellow-400 px-4 py-2 font-semibold text-black shadow hover:bg-yellow-300 transition"
              >
                Get a Website
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
