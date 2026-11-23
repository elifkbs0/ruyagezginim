import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await db.product.findMany({
    where: { listings: { some: {} } },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/kasim-indirimleri`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE_URL}/firsatlar`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/kategori`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/kategori/${c.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/karsilastir`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    ...["hakkimizda", "iletisim", "gizlilik", "kullanim"].map((p) => ({
      url: `${SITE_URL}/${p}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/urun/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
