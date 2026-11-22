import * as cheerio from "cheerio";
import { proxyFetch } from "./proxy";

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

function parsePrice(text: string): number {
  if (!text) return 0;
  return parseFloat(
    text
      .replace(/[^\d,\.]/g, "")
      .replace(",", ".")
  ) || 0;
}

// ─── Trendyol ────────────────────────────────────────────────────────────────

export async function searchTrendyol(query: string): Promise<ScrapedProduct[]> {
  try {
    const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(query)}&pi=1`;
    const res = await proxyFetch(url, { render: true });
    if (!res) return [];

    const html = await res.text();

    // Try to extract __NEXT_DATA__ JSON first
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (nextDataMatch) {
      return parseTrendyolNextData(nextDataMatch[1], query);
    }

    // Try window.__SEARCH_APP_INITIAL_STATE__ (older format)
    const stateMatch = html.match(/window\.__SEARCH_APP_INITIAL_STATE__\s*=\s*({[\s\S]*?});\s*(?:window|<\/script>)/);
    if (stateMatch) {
      return parseTrendyolState(stateMatch[1]);
    }

    // Try new Trendyol format: JSON with itemNumber + price.current embedded in page
    const newFormatProducts = parseTrendyolNewFormat(html);
    if (newFormatProducts.length > 0) return newFormatProducts;

    // Fallback: HTML scraping
    return scrapeTrendyolHtml(html);
  } catch (e) {
    console.error("[Trendyol] search error:", e);
    return [];
  }
}

function parseTrendyolNewFormat(html: string): ScrapedProduct[] {
  try {
    const products: ScrapedProduct[] = [];
    // Match Trendyol's new JSON format: itemNumber, listingId, name, price in fixed order
    const regex = /"itemNumber":(\d+),"listingId":"[^"]*","name":"([^"]+)","price":\{"old":(\d+),"oldText":"[^"]*","currency":"TL","current":(\d+)/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(html)) !== null && products.length < 24) {
      const [, itemNum, name, oldPriceStr, currentPriceStr] = m;
      const currentPrice = Number(currentPriceStr);
      const oldPrice = Number(oldPriceStr);

      // Look ahead for rating + cleanUrlFragments
      const after = html.slice(m.index, m.index + 2000);
      const ratingM = after.match(/"averageRating":([\d.]+),"totalCount":(\d+)/);
      const brandM = after.match(/"cleanUrlFragments":\{"brandName":"([^"]+)"/);
      const webBrandM = after.match(/"webBrandName":"([^"]+)"/);

      // Look back for CDN image URL
      const before = html.slice(Math.max(0, m.index - 3000), m.index);
      const imgs = [...before.matchAll(/https:\\u002F\\u002Fcdn\.dsmcdn\.com[^"\\]*org_zoom\.jpg/g)];
      const rawImg = imgs.length > 0 ? imgs[imgs.length - 1][0] : "";
      const imgUrl = rawImg ? rawImg.replace(/\\u002F/g, "/") : "";

      const brand = brandM ? brandM[1] : "";
      const webBrand = (webBrandM ? webBrandM[1] : brand).toLowerCase().replace(/\s+/g, "-");
      const nameSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

      if (currentPrice > 0) {
        products.push({
          externalId: itemNum,
          platform: "TRENDYOL",
          name,
          brand,
          imageUrl: imgUrl,
          url: `https://www.trendyol.com/${webBrand}/${nameSlug}-p-${itemNum}`,
          currentPrice,
          originalPrice: oldPrice > currentPrice ? oldPrice : undefined,
          rating: ratingM ? Number(ratingM[1]) : undefined,
          reviewCount: ratingM ? Number(ratingM[2]) : undefined,
          inStock: true,
        });
      }
    }
    return products;
  } catch {
    return [];
  }
}

function parseTrendyolNextData(json: string, _query: string): ScrapedProduct[] {
  try {
    const data = JSON.parse(json);
    // Navigate the Next.js page data to find product list
    const pageProps =
      data?.props?.pageProps ??
      data?.props?.initialState ??
      {};
    const products =
      pageProps?.searchResult?.products ??
      pageProps?.products ??
      [];

    return products.slice(0, 24).map((p: Record<string, unknown>) => ({
      externalId: String(p.id ?? p.contentId ?? ""),
      platform: "TRENDYOL",
      name: String(p.name ?? ""),
      brand: String(p.brand ?? (p.brandName ?? "")),
      imageUrl: fixTrendyolImage(String((p.images as string[])?.[0] ?? p.imageUrl ?? "")),
      url: `https://www.trendyol.com${p.url ?? ""}`,
      currentPrice: Number((p.price as Record<string, number>)?.sellingPrice ?? p.discountedPrice ?? 0),
      originalPrice: (p.price as Record<string, number>)?.originalPrice ?? undefined,
      rating: p.ratingScore ? Number(p.ratingScore) : undefined,
      reviewCount: p.reviewCount ? Number(p.reviewCount) : undefined,
      inStock: Boolean(p.inStock ?? true),
      category: String(p.categoryName ?? ""),
    })).filter((p: ScrapedProduct) => p.name && p.currentPrice > 0);
  } catch {
    return [];
  }
}

function parseTrendyolState(json: string): ScrapedProduct[] {
  try {
    const state = JSON.parse(json);
    const products =
      state?.searchResult?.products ??
      state?.products ??
      [];
    return parseTrendyolNextData(JSON.stringify({ props: { pageProps: { products } } }), "");
  } catch {
    return [];
  }
}

function scrapeTrendyolHtml(html: string): ScrapedProduct[] {
  const $ = cheerio.load(html);
  const products: ScrapedProduct[] = [];

  $(".p-card-wrppr, [data-id]").each((_, el) => {
    try {
      const name = $(el).find(".prdct-desc-cntnr-name, .product-name").text().trim();
      const priceEl = $(el).find(".prc-box-sllng, .selling-price").first().text();
      const price = parsePrice(priceEl);
      const orgPriceEl = $(el).find(".prc-box-orgnl").first().text();
      const orgPrice = parsePrice(orgPriceEl);
      const img = $(el).find("img").attr("src") ?? "";
      const link = $(el).find("a").first().attr("href") ?? "";
      const id = link.split("-p-").pop()?.split("?")[0] ?? Date.now().toString();

      if (name && price > 0) {
        products.push({
          externalId: id,
          platform: "TRENDYOL",
          name,
          brand: $(el).find(".prdct-desc-cntnr-ttl").text().trim(),
          imageUrl: fixTrendyolImage(img),
          url: `https://www.trendyol.com${link}`,
          currentPrice: price,
          originalPrice: orgPrice > price ? orgPrice : undefined,
          inStock: true,
        });
      }
    } catch {}
  });

  return products.slice(0, 24);
}

function fixTrendyolImage(img: string): string {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `https://cdn.dsmcdn.com${img}`;
}

// ─── Hepsiburada ─────────────────────────────────────────────────────────────

const HB_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,*/*",
  "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
};

export async function searchHepsiburada(query: string): Promise<ScrapedProduct[]> {
  try {
    // Direct fetch works; proxy blocks with 500
    const url = `https://www.hepsiburada.com/ara?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: HB_HEADERS, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return [];
    const html = await res.text();
    return scrapeHepsiburadaHtml(html);
  } catch (e) {
    console.error("[Hepsiburada] search error:", e);
    return [];
  }
}

function scrapeHepsiburadaHtml(html: string): ScrapedProduct[] {
  const $ = cheerio.load(html);
  const products: ScrapedProduct[] = [];

  // Product cards: <article class="productCard-module_article__*">
  $("article[class*='productCard-module_article']").each((_, el) => {
    try {
      // Name + URL from first HB-SKU link
      const link = $(el).find("a[href*='-p-HB']").first();
      const href = link.attr("href") ?? "";
      const name = link.attr("title") ?? $(el).find("h2 a").first().attr("title") ?? "";
      if (!name || !href) return;

      // SKU from href: /product-name-p-HBCV00004X9ZCH
      const skuMatch = href.match(/-p-(HB[A-Z0-9]+)$/);
      const sku = skuMatch ? skuMatch[1] : href.split("/").pop() ?? Date.now().toString();

      // Image
      const img = $(el).find("img[src*='hepsiburada']").first().attr("src") ?? "";

      // Price: data-test-id="final-price-N"
      const priceText = $(el).find("[data-test-id^='final-price']").first().text().replace(/TL|,/g, "").replace(/\./g, "").trim();
      let price = Number(priceText) || 0;
      // Fallback: aria-label "Sepete ekle, fiyat: 54.999 TL, ..."
      if (!price) {
        const ariaLabel = $(el).find("h2").attr("aria-label") ?? "";
        const m = ariaLabel.match(/fiyat: ([\d.]+) TL/);
        if (m) price = parsePrice(m[1]);
      }

      // Original price (strikethrough): class contains "originalPrice" or "listingPrice"
      const orgText = $(el).find("[class*='originalPrice'], [class*='listingPrice'], [data-test-id^='original-price']").first().text();
      const orgPrice = orgText ? parsePrice(orgText.replace(/TL|,/g, "").replace(/\./g, "")) : undefined;

      // Rating: data-test-id="rating-N" container has sr-only span
      const ratingEl = $(el).find("[data-test-id^='rating']");
      const srText = ratingEl.find("span").first().text() || ratingEl.text();
      const ratingMatch = srText.match(/Ürün puanı ([\d,]+), (\d+) değerlendirme/);
      const rating = ratingMatch ? parseFloat(ratingMatch[1].replace(",", ".")) : undefined;
      const reviewCount = ratingMatch ? parseInt(ratingMatch[2]) : undefined;

      if (price > 0) {
        products.push({
          externalId: sku,
          platform: "HEPSIBURADA",
          name,
          brand: "",
          imageUrl: img,
          url: `https://www.hepsiburada.com${href}`,
          currentPrice: price,
          originalPrice: orgPrice && orgPrice > price ? orgPrice : undefined,
          rating,
          reviewCount,
          inStock: true,
        });
      }
    } catch {}
  });

  return products.slice(0, 24);
}

// ─── N11 ─────────────────────────────────────────────────────────────────────

export async function searchN11(query: string): Promise<ScrapedProduct[]> {
  try {
    const url = `https://www.n11.com/arama?q=${encodeURIComponent(query)}`;
    const res = await proxyFetch(url, { render: true });
    if (!res) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const products: ScrapedProduct[] = [];

    $(".columnContent .productItem, .gridWrapper .content").each((_, el) => {
      try {
        const name = $(el).find(".productName, h3").first().text().trim();
        const priceEl = $(el).find(".newPrice ins, .priceWrapper .price").first().text();
        const price = parsePrice(priceEl);
        const img = $(el).find("img").attr("data-original") ??
                    $(el).find("img").attr("src") ?? "";
        const link = $(el).find("a").first().attr("href") ?? "";
        const id = link.split("-p-").pop()?.split(".html")[0] ??
                   link.split("/").pop() ?? Date.now().toString();

        if (name && price > 0) {
          products.push({
            externalId: id,
            platform: "N11",
            name,
            brand: "",
            imageUrl: img,
            url: link.startsWith("http") ? link : `https://www.n11.com${link}`,
            currentPrice: price,
            inStock: true,
          });
        }
      } catch {}
    });

    return products.slice(0, 20);
  } catch (e) {
    console.error("[N11] search error:", e);
    return [];
  }
}
