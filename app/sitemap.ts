import { db } from "@/lib/db";
import type { MetadataRoute } from "next";

const BASE = "https://ruyagezginim.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.product.findMany({
    select: { slug: true, updatedAt: true },
  });

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/urun/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/firsatlar`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/karsilastir`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/kategori`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...productUrls,
  ];
}
