// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://jashtechno.com/sitemap.xml",
    host: "https://jashtechno.com",
  };
}
