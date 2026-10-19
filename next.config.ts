import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Join Us was merged into Contact Us; query strings and #donor / #doctor carry over.
  async redirects() {
    return [{ source: "/join-us", destination: "/contact-us", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
