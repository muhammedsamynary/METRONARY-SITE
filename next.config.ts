import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images: allow optimization of local public/ assets (no remotePatterns needed yet)
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Output: standalone for clean production deployment later
  // output: "standalone", // Uncomment when deploying to server
};

export default nextConfig;
