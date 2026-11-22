import { NextRequest, NextResponse } from "next/server";
import { searchAllPlatforms } from "@/lib/scrapers";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ error: "Geçersiz arama" }, { status: 400 });
  }

  // Log search
  await db.searchLog.upsert({
    where: { query: q.toLowerCase() },
    update: { count: { increment: 1 }, updatedAt: new Date() },
    create: { query: q.toLowerCase(), count: 1 },
  });

  // Check DB cache first (products updated in last 2 hours)
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const cachedProducts = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { brand: { contains: q } },
      ],
      updatedAt: { gte: twoHoursAgo },
    },
    include: {
      listings: {
        orderBy: { currentPrice: "asc" },
        take: 5,
      },
    },
    take: 24,
    orderBy: { viewCount: "desc" },
  });

  if (cachedProducts.length > 0) {
    return NextResponse.json({ products: cachedProducts, source: "cache" });
  }

  // Scrape fresh data
  const scraped = await searchAllPlatforms(q);

  if (!scraped.length) {
    return NextResponse.json({ products: [], source: "scrape" });
  }

  // Group by normalized name and save to DB
  const nameGroups = new Map<string, typeof scraped>();
  for (const p of scraped) {
    const key = p.name.toLowerCase().slice(0, 50);
    const arr = nameGroups.get(key) ?? [];
    arr.push(p);
    nameGroups.set(key, arr);
  }

  const savedProducts = [];

  for (const [, listings] of nameGroups) {
    const main = listings[0];
    const slug = slugify(main.name) + "-" + Date.now().toString(36).slice(-4);

    try {
      const product = await db.product.upsert({
        where: { slug },
        update: {
          updatedAt: new Date(),
        },
        create: {
          name: main.name,
          brand: main.brand || null,
          category: main.category || "Genel",
          imageUrl: main.imageUrl || null,
          slug,
        },
      });

      for (const listing of listings) {
        const pl = await db.platformListing.upsert({
          where: {
            platform_externalId: {
              platform: listing.platform,
              externalId: listing.externalId,
            },
          },
          update: {
            currentPrice: listing.currentPrice,
            originalPrice: listing.originalPrice ?? null,
            rating: listing.rating ?? null,
            reviewCount: listing.reviewCount ?? null,
            inStock: listing.inStock,
            imageUrl: listing.imageUrl || null,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            platform: listing.platform,
            externalId: listing.externalId,
            url: listing.url,
            currentPrice: listing.currentPrice,
            originalPrice: listing.originalPrice ?? null,
            rating: listing.rating ?? null,
            reviewCount: listing.reviewCount ?? null,
            inStock: listing.inStock,
            imageUrl: listing.imageUrl || null,
          },
        });

        // Record price history
        await db.priceHistory.create({
          data: {
            platformListingId: pl.id,
            price: listing.currentPrice,
          },
        });
      }

      savedProducts.push({
        ...product,
        listings,
      });
    } catch {
      // skip failed
    }
  }

  return NextResponse.json({ products: savedProducts, source: "scrape" });
}
