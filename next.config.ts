import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://192.168.1.185:3000"],
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "http", hostname: "202.79.51.253" },
      { protocol: "http", hostname: "202.79.51.253", port: "9229" },
    ],
  },
};

export default withPWA({
  dest: "public",
})(nextConfig);
