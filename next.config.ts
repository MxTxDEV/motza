import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 828, 1080, 1440, 1920, 2400],
    imageSizes: [96, 160, 256, 384],
  },
  poweredByHeader: false,
};

export default nextConfig;
