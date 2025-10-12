// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next"
// ✅ Vercel Analytics + Speed Insights
import { Analytics } from "@vercel/analytics/next";

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
        <Navbar />
        {children}

        {/* Toasts */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* 📈 Analytics & performance (place near end of body) */}
        <Analytics />
        <SpeedInsights />

        <Footer />
      </body>
    </html>
  );
}
