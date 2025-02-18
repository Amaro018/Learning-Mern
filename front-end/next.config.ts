import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Intercept calls to /api
        destination: "https://learning-mern-chi.vercel.app//api/:path*", // Forward them to backend
      },
    ];
  },

  images: {
    domains: ["res.cloudinary.com"], // Allow images from Cloudinary
},
};

export default nextConfig;