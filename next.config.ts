import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/get-a-website", destination: "/contact", permanent: true },
      { source: "/get_a_website", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
