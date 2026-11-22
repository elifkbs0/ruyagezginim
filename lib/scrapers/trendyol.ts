import * as cheerio from "cheerio";

export interface ScrapedProduct {
  externalId: string;
  platform: string;
  name: string;
  brand: string;
  imageUrl: string;
  url: string;
  currentPrice: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  category?: string;
}

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/html",
  "Accept-Language": "tr-TR,tr;q=0.9",
  Referer: "https://www.trendyol.com/",
};

export async function searchTrendyol(query: string): Promise<ScrapedProduct[]> {
  try {
    const url = `https://public.trendyol.com/discovery-web-searchgw-service/api/filter/search/filter?searchText=${encodeURIComponent(query)}&pi=1&culture=tr-TR&userGenderId=1&pId=0&scoringAlgorithmId=2&categoryRelevancyEnabled=true&isLegalRequirementConfirmed=false&facets=`;
    const res = await fetch(url, {
      headers: HEADERS,
      next: { revalidate: 1800 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const products = data?.result?.products ?? [];

    return products.slice(0, 20).map((p: Record<string, unknown>) => {
      const price = (p.price as Record<string, number>)?.sellingPrice ?? 0;
      const orgPrice = (p.price as Record<string, number>)?.originalPrice;
      return {
        externalId: String(p.id),
        platform: "TRENDYOL",
        name: String(p.name ?? ""),
        brand: String(p.brand ?? ""),
        imageUrl: `https://cdn.dsmcdn.com${p.images && Array.isArray(p.images) ? String((p.images as string[])[0]) : ""}`,
        url: `https://www.trendyol.com${p.url ?? ""}`,
        currentPrice: price,
        originalPrice: orgPrice !== price ? orgPrice : undefined,
        rating: p.ratingScore ? Number(p.ratingScore) : undefined,
        reviewCount: p.reviewCount ? Number(p.reviewCount) : undefined,
        inStock: Boolean(p.inStock ?? true),
        category: String(p.categoryName ?? ""),
      };
    });
  } catch {
    return [];
  }
}

export async function getTrendyolProduct(productId: string): Promise<ScrapedProduct | null> {
  try {
    const url = `https://public.trendyol.com/discovery-web-productgw-service/api/productDetail/${productId}?storefrontId=1&culture=tr-TR&userGenderId=1`;
    const res = await fetch(url, {
      headers: HEADERS,
      next: { revalidate: 900 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const p = data?.result;
    if (!p) return null;

    const price = p.price?.sellingPrice ?? 0;
    const orgPrice = p.price?.originalPrice;

    return {
      externalId: String(p.id),
      platform: "TRENDYOL",
      name: String(p.name ?? ""),
      brand: String(p.brand?.name ?? ""),
      imageUrl: `https://cdn.dsmcdn.com${p.images?.[0] ?? ""}`,
      url: `https://www.trendyol.com${p.url ?? ""}`,
      currentPrice: price,
      originalPrice: orgPrice !== price ? orgPrice : undefined,
      rating: p.ratingScore ? Number(p.ratingScore) : undefined,
      reviewCount: p.reviewCount ? Number(p.reviewCount) : undefined,
      inStock: Boolean(p.variants?.some((v: Record<string, unknown>) => v.inStock) ?? true),
      category: String(p.category?.name ?? ""),
    };
  } catch {
    return null;
  }
}

export async function searchHepsiburada(query: string): Promise<ScrapedProduct[]> {
  try {
    const url = `https://www.hepsiburada.com/arama?q=${encodeURIComponent(query)}&sayfa=1`;
    const res = await fetch(url, {
      headers: {
        ...HEADERS,
        Referer: "https://www.hepsiburada.com/",
      },
      next: { revalidate: 1800 },
    });

    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const products: ScrapedProduct[] = [];

    $("[data-test-id='product-card-wrapper']").each((_, el) => {
      try {
        const name = $(el).find("[data-test-id='product-card-name']").text().trim();
        const priceText = $(el).find("[data-test-id='price-current-price']").text().trim();
        const price = parseFloat(priceText.replace(/[^0-9,]/g, "").replace(",", ".")) || 0;
        const orgPriceText = $(el).find("[data-test-id='price-original-price']").text().trim();
        const orgPrice = orgPriceText
          ? parseFloat(orgPriceText.replace(/[^0-9,]/g, "").replace(",", "."))
          : undefined;
        const img = $(el).find("img").attr("src") ?? "";
        const link = $(el).find("a").attr("href") ?? "";
        const id = link.split("-").pop()?.replace(/[^a-z0-9]/gi, "") ?? "";

        if (name && price > 0) {
          products.push({
            externalId: id,
            platform: "HEPSIBURADA",
            name,
            brand: "",
            imageUrl: img,
            url: `https://www.hepsiburada.com${link}`,
            currentPrice: price,
            originalPrice: orgPrice !== price ? orgPrice : undefined,
            inStock: true,
          });
        }
      } catch {
        // skip malformed
      }
    });

    return products.slice(0, 20);
  } catch {
    return [];
  }
}
