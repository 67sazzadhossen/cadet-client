import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://192.168.0.104:3000", // LAN IP (shown in your terminal)
    "http://localhost:3000",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // সব ধরনের ডোমেইন থেকে ইমেজ লোড করার জন্য
      },
      {
        protocol: "http",
        hostname: "**", // সব ধরনের ডোমেইন থেকে ইমেজ লোড করার জন্য
      },
    ],
  },
};

export default nextConfig;
