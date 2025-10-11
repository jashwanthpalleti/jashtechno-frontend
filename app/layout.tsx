// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";   // ⬅️ client component is OK inside layout
import Footer from "./components/Footer";   // ⬅️ optional
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jash Techno",
  description: "Modern websites that grow your business.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0EA5E9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        
        <Navbar />      {/* ⬅️ shown on every page */}
        {children}
        <Toaster position="top-center" reverseOrder={false} />
        <Footer />      {/* ⬅️ optional global footer */}
      </body>
    </html>
  );
}
