import { NextRequest, NextResponse } from "next/server";
import { searchAllPlatforms, hasProxy } from "@/lib/scrapers";
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
  }).catch(() => {});

  // DB cache (products updated in last 2 hours)
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const cached = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { brand: { contains: q } },
        { category: { contains: q } },
      ],
      updatedAt: { gte: twoHoursAgo },
    },
    include: {
      listings: {
        orderBy: { currentPrice: "asc" },
      },
    },
    take: 24,
    orderBy: [{ viewCount: "desc" }, { updatedAt: "desc" }],
  });

  if (cached.length > 0) {
    return NextResponse.json({ products: cached, source: "cache", proxy: hasProxy() });
  }

  // Scrape fresh data (needs SCRAPER_API_KEY or SCRAPINGBEE_KEY in .env)
  const scraped = await searchAllPlatforms(q);

  // If no proxy key set, also look in DB without time filter
  if (!scraped.length) {
    const anyExisting = await db.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { brand: { contains: q } },
        ],
      },
      include: {
        listings: { orderBy: { currentPrice: "asc" } },
      },
      take: 24,
      orderBy: { viewCount: "desc" },
    });

    return NextResponse.json({
      products: anyExisting,
      source: "db_fallback",
      proxy: hasProxy(),
      tip: !hasProxy()
        ? "SCRAPER_API_KEY veya SCRAPINGBEE_KEY ekleyerek gerçek zamanlı fiyatları etkinleştirin"
        : undefined,
    });
  }

  // Group by normalized name and persist
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
    const slug =
      slugify(main.name).slice(0, 60) + "-" + Date.now().toString(36).slice(-4);

    try {
      const product = await db.product.upsert({
        where: { slug },
        update: { updatedAt: new Date() },
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

        await db.priceHistory.create({
          data: { platformListingId: pl.id, price: listing.currentPrice },
        }).catch(() => {});
      }

      savedProducts.push({ ...product, listings });
    } catch {}
  }

  return NextResponse.json({
    products: savedProducts,
    source: "scrape",
    proxy: hasProxy(),
  });
}
