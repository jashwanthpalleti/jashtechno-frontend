import type { Metadata } from "next";
import Script from "next/script";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: "Jash Techno | 3D Web & AI-Powered Experiences",
  description:
    "We build interactive 3D websites, AI-powered solutions, and full-stack web apps that turn ideas into immersive experiences.",
  openGraph: {
    title: "Jash Techno | 3D Web & AI-Powered Experiences",
    description: "Interactive 3D websites, AI-powered solutions, and full-stack apps.",
    url: "https://jashtechno.com/",
    siteName: "Jash Techno",
    images: [
      {
        url: "https://jashtechno.com/og/coffee-shop-preview.jpg",
        width: 1200,
        height: 630,
        alt: "3D Coffee House by Jash Techno",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jash Techno | 3D Web & AI-Powered Experiences",
    description: "Interactive 3D websites, AI-powered solutions, and full-stack apps.",
    images: ["https://jashtechno.com/og/coffee-shop-preview.jpg"],
  },
};

export default function Page() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jash Techno",
    url: "https://jashtechno.com/",
    logo: "https://jashtechno.com/og/logo.png",          // put a real logo under /public/og/logo.png
    sameAs: [
      "https://www.linkedin.com/in/jashwanth-p-6994928a/",
      "https://github.com/jashwanthpalleti"
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "jash@jashtechno.com",
        contactType: "customer support",
        availableLanguage: ["English"]
      }
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jash Techno",
    url: "https://jashtechno.com/",
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://jashtechno.com/search?q={query}",
      "query-input": "required name=query"
    }
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interactive 3D & AI-Powered Web Solutions",
    provider: {
      "@type": "Organization",
      name: "Jash Techno",
      url: "https://jashtechno.com/"
    },
    url: "https://jashtechno.com/",
    areaServed: "US",
    serviceType: [
      "3D Web Development",
      "React Three Fiber / Three.js",
      "Full-Stack Web Apps",
      "AI-Powered Websites"
    ],
    description:
      "We build interactive 3D websites, AI-powered solutions, and full-stack apps that turn ideas into immersive experiences.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "3D Website (React Three Fiber / Three.js)" }
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "AI-Powered Features (NLP, RAG, chatbots)" }
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Full-Stack Apps (Next.js + Django/Node)" }
        }
      ]
    }
  };

  return (
    <>
      {/* JSON-LD (OK in body; Google parses it) */}
      <Script id="ld-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Script id="ld-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Script id="ld-service" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <HomePage />
    </>
  );
}
