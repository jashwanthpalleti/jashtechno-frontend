import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// ⬇️ Adjust this import to match your project
// Common paths/names: "@/components/Navbar" or "@/components/NavBar"
// Update the import path below to match the correct relative path and filename (case-sensitive)
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Jash Techno",
  description: "Web design & growth studio",
};

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

