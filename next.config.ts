import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://192.168.1.185:3000"],
  // 👇 THIS FIXES THE ERROR
  turbopack: {},
};

export default withPWA({
  dest: "public",
})(nextConfig);
