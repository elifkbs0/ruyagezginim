import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/ara?*"],
    },
    sitemap: "https://ruyagezginim.vercel.app/sitemap.xml",
  };
}
