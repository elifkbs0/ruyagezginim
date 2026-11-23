import { db } from "@/lib/db";
import { discountPercent } from "@/lib/utils";

export async function getTopDeals({ limit, perCategory }: { limit: number; perCategory: number }) {
  const listings = await db.platformListing.findMany({
    where: { originalPrice: { not: null }, inStock: true },
    include: { product: { include: { listings: { orderBy: { currentPrice: "asc" } } } } },
    orderBy: { updatedAt: "desc" },
    take: 1000,
  });

  const seenProducts = new Set<string>();
  const perCategoryCount = new Map<string, number>();

  return listings
    .map((l) => ({
      ...l,
      image: l.imageUrl ?? l.product.imageUrl ?? l.product.listings.find((x) => x.imageUrl)?.imageUrl ?? null,
    }))
    .filter((l) => l.image && l.originalPrice! > l.currentPrice)
    .sort((a, b) => discountPercent(b.originalPrice!, b.currentPrice) - discountPercent(a.originalPrice!, a.currentPrice))
    .filter((l) => {
      if (seenProducts.has(l.productId)) return false;
      const count = perCategoryCount.get(l.product.category) ?? 0;
      if (count >= perCategory) return false;
      seenProducts.add(l.productId);
      perCategoryCount.set(l.product.category, count + 1);
      return true;
    })
    .slice(0, limit);
}
