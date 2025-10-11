"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BAGEL_BRAND = "🥯 Bagel Bliss";

const links = [
  { label: "Home", href: "/store" },
  { label: "Menu", href: "/menu" }, // or "/bagel-store/menu" if you make a nested route
  { label: "Specials", href: "/menu?category=Trending" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function NavbarForBagels() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    // simple active check; for query links, just highlight when base path matches
    const base = href.split("?")[0];
    return pathname === href || pathname === base || pathname.startsWith(base + "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* Brand */}
        <Link href="/store" className="text-white text-lg font-extrabold tracking-wide">
          {BAGEL_BRAND}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`transition ${
                  isActive(l.href) ? "text-yellow-300" : "text-white/90 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="#"
              className="ml-2 rounded-md bg-white px-4 py-2 font-semibold text-black shadow hover:bg-gray-100 transition"
              onClick={(e) => e.preventDefault()}
            >
              Order Now
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
            <div className="space-y-1 border-t border-white/10 bg-slate-900/70 px-4 pb-4 pt-2 backdrop-blur">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2 transition ${
                    isActive(l.href)
                      ? "bg-white/10 text-yellow-300"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                }}
                className="mt-2 inline-block rounded-md bg-white px-4 py-2 font-semibold text-black shadow hover:bg-gray-100 transition"
              >
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
