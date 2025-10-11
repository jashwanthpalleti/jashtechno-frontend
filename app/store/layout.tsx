// app/store/layout.tsx
import type { Metadata } from "next";
import "../globals.css";
import NavbarForBagels from "../components/NavbarForBagels"; // note: relative, forward slashes

export const metadata: Metadata = {
  title: "Bagel Bliss • Jash Techno",
  description: "Freshly baked bagels every morning.",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  // DO NOT return <html> or <body> here
  return (
    <>
      <NavbarForBagels />
      <main>{children}</main>
    </>
  );
}
