import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The production vercel.app alias serves the same pages; send it to the real domain
  // so Google doesn't index duplicates. Preview deployments use other hostnames.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ruyagezginim.vercel.app" }],
        destination: "https://www.ruyagezginim.com/:path*",
        permanent: true,
      },
      ...["/black-friday", "/efsane-cuma", "/efsane-kasim", "/kasim-firsatlari"].map((source) => ({
        source,
        destination: "/kasim-indirimleri",
        permanent: true,
      })),
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dsmcdn.com" },
      { protocol: "https", hostname: "*.hepsiburada.net" },
      { protocol: "https", hostname: "*.hepsiburada.com" },
      { protocol: "https", hostname: "*.amazon.com" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "*.media-amazon.com" },
      { protocol: "https", hostname: "*.ssl-images-amazon.com" },
      { protocol: "https", hostname: "*.n11.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
      { protocol: "https", hostname: "*.ciceksepeti.com" },
      { protocol: "https", hostname: "*.ciceksepeti.net" },
    ],
  },
};

export default nextConfig;
