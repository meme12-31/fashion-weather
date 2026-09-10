import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/fashion-weather",
  reactCompiler: true,
  allowedDevOrigins: [
    "192.168.3.12",
    "localhost:3000",
    "192.168.3.12:3000",
  ],
};

export default nextConfig;
