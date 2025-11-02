// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://jashtechno.com/", lastModified: now },
    { url: "https://jashtechno.com/coffee-shop", lastModified: now },
    { url: "https://jashtechno.com/contact", lastModified: now },
    { url: "https://jashtechno.com/menu", lastModified: now },
    { url: "https://jashtechno.com/pricing", lastModified: now },
    { url: "https://jashtechno.com/works", lastModified: now },
  ];
}
