import type { Metadata } from "next";
import Script from "next/script";
import CoffeeHouseClient from "./CoffeeHouseClient";

export const metadata: Metadata = {
  title: "3D Coffee House | Jash Techno",
  description:
    "Experience an interactive 3D coffee shop built with React Three Fiber and Next.js by Jash Techno. Explore immersive web design and realistic 3D UI.",
  alternates: {
    canonical: "https://jashtechno.com/coffee-shop",
  },
  openGraph: {
    title: "3D Coffee House | Jash Techno",
    description:
      "An immersive 3D café experience on the web. Built with React Three Fiber, Three.js, and Next.js.",
    url: "https://jashtechno.com/coffee-shop",
    siteName: "Jash Techno",
    images: [
      {
        url: "https://jashtechno.com/og/coffee-shop-preview.jpg", // put this under /public/og/
        width: 1200,
        height: 630,
        alt: "3D Coffee House scene by Jash Techno",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Coffee House | Jash Techno",
    description:
      "Interactive 3D café on the web — React Three Fiber + Next.js.",
    images: ["https://jashtechno.com/og/coffee-shop-preview.jpg"],
  },
};

export default function Page() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://jashtechno.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "3D Coffee Shop",
        item: "https://jashtechno.com/coffee-shop",
      },
    ],
  };

  return (
    <>
      {/* Breadcrumbs JSON-LD for SEO */}
      <Script
        id="ld-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CoffeeHouseClient />
    </>
  );
}
