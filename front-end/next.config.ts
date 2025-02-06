import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Intercept calls to /api
        destination: "http://localhost:5000/api/:path*", // Forward them to backend
      },
    ];
  },
};

export default nextConfig;