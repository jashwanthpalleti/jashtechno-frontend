import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async rewrites() { return []; } // don’t touch /api/*
};
export default nextConfig;
