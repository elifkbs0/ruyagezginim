import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dsmcdn.com" },
      { protocol: "https", hostname: "*.hepsiburada.net" },
      { protocol: "https", hostname: "*.hepsiburada.com" },
      { protocol: "https", hostname: "*.amazon.com" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "*.n11.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
      { protocol: "https", hostname: "*.ciceksepeti.com" },
      { protocol: "https", hostname: "*.ciceksepeti.net" },
    ],
  },
};

export default nextConfig;
