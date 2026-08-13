import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // ScrollTrigger pins are re-created twice under StrictMode double-invoke
  devIndicators: false,
};

export default nextConfig;
