"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-all border-b",
        scrolled
          ? "backdrop-blur bg-[#FAF6F1]/70 border-[#E7DCCD]"
          : "bg-transparent border-transparent",
      ].join(" ")}
      role="banner"
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3"
        aria-label="Coffee shop"
      >
        <Link
          href="/coffee-shop"
          className="flex items-center gap-2 font-semibold tracking-tight text-[#2B1E16]"
        >
          <span className="inline-block h-3 w-3 rounded-full bg-[#6B8E6E]" />
          Coffee House
        </Link>

        <ul className="flex items-center gap-4 text-sm">
          <li>
            <a href="#story" className="rounded-xl px-3 py-2 text-[#5B4636] hover:text-[#2B1E16]">
              Story
            </a>
          </li>
          <li>
            <a href="#menu" className="rounded-xl px-3 py-2 text-[#5B4636] hover:text-[#2B1E16]">
              Menu
            </a>
          </li>
          <li>
            <a href="#visit" className="rounded-xl px-3 py-2 text-[#5B4636] hover:text-[#2B1E16]">
              Visit
            </a>
          </li>
          <li>
            <a
              href="#order"
              className="rounded-2xl bg-[#2B1E16] px-4 py-2 font-semibold text-[#FAF6F1] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Order Ahead
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
