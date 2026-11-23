import { NextRequest, NextResponse } from "next/server";
import { searchAllPlatforms, hasProxy } from "@/lib/scrapers";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { categorize } from "@/lib/categorize";
import { accessoryRank, matchesQuery, queryTokens } from "@/lib/search-match";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2 || q.length > 80) {
    return NextResponse.json({ error: "Geçersiz arama" }, { status: 400 });
  }

  // Log search
  await db.searchLog.upsert({
    where: { query: q.toLowerCase() },
    update: { count: { increment: 1 }, updatedAt: new Date() },
    create: { query: q.toLowerCase(), count: 1 },
  }).catch(() => {});

  // Fetch candidates by the longest query word (raw and accent-folded, since SQLite
  // LIKE only ignores case for ASCII), then keep exact matches in JS.
  const tokens = queryTokens(q);
  const rawWords = q.toLocaleLowerCase("tr-TR").split(/\s+/).filter(Boolean);
  const anchor = [...rawWords].sort((a, b) => b.length - a.length)[0] ?? q;
  const anchorFolded = [...tokens].sort((a, b) => b.length - a.length)[0] ?? anchor;
  const findLocal = async (since?: Date) => {
    const rows = await db.product.findMany({
      where: {
        OR: [{ name: { contains: anchor } }, { name: { contains: anchorFolded } }],
        listings: { some: {} },
        ...(since && { updatedAt: { gte: since } }),
      },
      include: { listings: { orderBy: { currentPrice: "asc" } } },
      take: 500,
      orderBy: [{ viewCount: "desc" }, { updatedAt: "desc" }],
    });
    return rows
      .filter((p) => matchesQuery(p.name, q))
      .sort((a, b) => accessoryRank(a.name, q) - accessoryRank(b.name, q))
      .slice(0, 48);
  };

  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const cached = await findLocal(twoHoursAgo);
  // A handful of cached hits usually means an earlier, narrower search; scrape for more.
  if (cached.length >= 8) {
    return NextResponse.json({ products: cached, source: "cache", proxy: hasProxy() });
  }

  // Scrape fresh data (needs SCRAPER_API_KEY or SCRAPINGBEE_KEY in .env).
  // Store sites return loosely related items, so keep only ones that match the query.
  const scraped = (await searchAllPlatforms(q)).filter((p) => matchesQuery(p.name, q));

  if (!scraped.length) {
    return NextResponse.json({
      products: await findLocal(),
      source: "db_fallback",
      proxy: hasProxy(),
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
    // Deterministik slug: externalId ile sabit → aynı ürün her scrape'de aynı slug'a sahip
    const slug = slugify(main.name).slice(0, 55) + "-" + main.externalId.slice(-6);
    const category = categorize(main.name, main.category);

    try {
      const product = await db.product.upsert({
        where: { slug },
        update: { updatedAt: new Date(), imageUrl: main.imageUrl || null, category },
        create: {
          name: main.name,
          brand: main.brand || null,
          category,
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
            productId: product.id,
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

      const productWithListings = await db.product.findUnique({
        where: { id: product.id },
        include: { listings: { orderBy: { currentPrice: "asc" } } },
      });
      if (productWithListings) savedProducts.push(productWithListings);
    } catch {}
  }

  savedProducts.sort((a, b) => accessoryRank(a.name, q) - accessoryRank(b.name, q));

  return NextResponse.json({
    products: savedProducts,
    source: "scrape",
    proxy: hasProxy(),
  });
}
