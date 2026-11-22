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

function parseHbPrice(text: string): number {
  if (!text) return 0;
  // "6.503,85 TL" → 6503.85 | "54.999 TL" → 54999
  const s = text.replace(/TL|\s/g, "").replace(/\./g, "").replace(",", ".");
  return parseFloat(s) || 0;
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
      // Turkish format: "6.503,85 TL" → remove TL/spaces → "6.503,85" → remove dots (thousands) → "6503,85" → comma→dot → 6503.85
      const priceRaw = $(el).find("[data-test-id^='final-price']").first().text();
      let price = parseHbPrice(priceRaw);
      // Fallback: aria-label "Sepete ekle, fiyat: 54.999 TL, ..."
      if (!price) {
        const ariaLabel = $(el).find("h2").attr("aria-label") ?? "";
        const m = ariaLabel.match(/fiyat: ([\d.]+) TL/);
        if (m) price = parseHbPrice(m[1] + " TL");
      }

      // Original price (strikethrough): class contains "originalPrice" or "listingPrice"
      const orgText = $(el).find("[class*='originalPrice'], [class*='listingPrice'], [data-test-id^='original-price']").first().text();
      const orgPrice = orgText ? parseHbPrice(orgText) : undefined;

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

// ─── Amazon Turkey ───────────────────────────────────────────────────────────

export async function searchAmazon(query: string): Promise<ScrapedProduct[]> {
  try {
    const url = `https://www.amazon.com.tr/s?k=${encodeURIComponent(query)}`;
    const res = await proxyFetch(url, { render: false });
    if (!res) return [];
    const html = await res.text();
    return scrapeAmazonHtml(html);
  } catch (e) {
    console.error("[Amazon] search error:", e);
    return [];
  }
}

function scrapeAmazonHtml(html: string): ScrapedProduct[] {
  const $ = cheerio.load(html);
  const products: ScrapedProduct[] = [];

  $("[data-component-type='s-search-result'][data-asin]").each((_, el) => {
    try {
      const asin = $(el).attr("data-asin") ?? "";
      if (!asin || asin.length < 5) return;

      // Name from h2 span (Amazon TR structure: no <a> inside h2)
      const name = $(el).find("h2 span").first().text().trim() ||
                   $(el).find("h2").attr("aria-label") || "";
      if (!name) return;

      // Price: .a-offscreen has full price text like "1.299,00 TL"
      const priceText = $(el).find(".a-price .a-offscreen").first().text();
      const price = parseAmazonPrice(priceText);
      if (!price) return;

      // Original price (strikethrough)
      const orgText = $(el).find(".a-text-price .a-offscreen").first().text();
      const orgPrice = orgText ? parseAmazonPrice(orgText) : undefined;

      const img = $(el).find("img.s-image").first().attr("src") ?? "";

      // Link containing the ASIN
      const href = $(el).find(`a[href*='${asin}']`).first().attr("href") ?? "";
      const cleanHref = href.split("?")[0] || `/dp/${asin}`;
      const url = `https://www.amazon.com.tr${cleanHref}`;

      // Rating: aria-label="5 yıldız üzerinden 4,1, derecelendirme ayrıntıları"
      const ratingLabel = $(el).find("[aria-label*='yıldız üzerinden']").first().attr("aria-label") ?? "";
      const ratingMatch = ratingLabel.match(/üzerinden ([\d,]+)/);
      const rating = ratingMatch ? parseFloat(ratingMatch[1].replace(",", ".")) : undefined;

      // Review count: aria-label="296 derecelendirme"
      const reviewLabel = $(el).find("[aria-label*='derecelendirme']").last().attr("aria-label") ?? "";
      const reviewMatch = reviewLabel.match(/^(\d[\d.]*)\s/);
      const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/\./g, "")) : undefined;

      products.push({
        externalId: asin,
        platform: "AMAZON",
        name,
        brand: "",
        imageUrl: img,
        url,
        currentPrice: price,
        originalPrice: orgPrice && orgPrice > price ? orgPrice : undefined,
        rating,
        reviewCount,
        inStock: true,
      });
    } catch {}
  });

  return products.slice(0, 24);
}

function parseAmazonPrice(text: string): number {
  if (!text) return 0;
  // "1.299,00 TL" → remove TL, replace . (thousands) → remove, , (decimal) → .
  const clean = text.replace(/[^\d.,]/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".");
  return parseFloat(clean) || 0;
}

// ─── Çiçeksepeti ─────────────────────────────────────────────────────────────

export async function searchCiceksepeti(query: string): Promise<ScrapedProduct[]> {
  try {
    const url = `https://www.ciceksepeti.com/arama?query=${encodeURIComponent(query)}&qt=${encodeURIComponent(query)}`;
    // render:true + 5s wait for client-side product listing to load
    const res = await proxyFetch(url, { render: true, waitMs: 5000 });
    if (!res) return [];
    const html = await res.text();
    return scrapeCiceksepetHtml(html);
  } catch (e) {
    console.error("[Çiçeksepeti] search error:", e);
    return [];
  }
}

function scrapeCiceksepetHtml(html: string): ScrapedProduct[] {
  const $ = cheerio.load(html);
  const products: ScrapedProduct[] = [];

  // Build image map from <link rel="preload" as="image"> in <head>
  // URL pattern: /cicek/{productCode}-1/M/{slug}.jpg
  const imageMap = new Map<string, string>();
  $("link[rel='preload'][as='image']").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const m = href.match(/\/cicek\/([^-/]+)/);
    if (m && href.includes("cdn")) imageMap.set(m[1], href);
  });

  $("a[data-cs-product-box='true']").each((_, el) => {
    try {
      const href = $(el).attr("href") ?? "";
      if (!href || href === "#") return;

      // Name from product image alt attribute
      const name = $(el).find("img[data-cs-pb-image='true']").first().attr("alt") ?? "";
      if (!name) return;

      const productId = $(el).attr("data-product-id") ?? Date.now().toString();

      // Price
      const priceText = $(el).find("[data-cs-pb-price-text='true']").first().text();
      const price = parseCsPrice(priceText);
      if (!price) return;

      // Original price (shown when discounted)
      const origText = $(el).find("[data-cs-pb-first-price-text='true']").first().text().trim();
      const origPrice = origText ? parseCsPrice(origText) : undefined;

      // Review count: "(146)" → 146
      const reviewText = $(el).find("[data-cs-pb-review-count='true']").first().text();
      const reviewMatch = reviewText.match(/\((\d+)\)/);
      const reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : undefined;

      // Image from preload link map (matches first ~9 products)
      const cleanHref = href.split("?")[0];
      const productCode = cleanHref.split("-").pop() ?? "";
      const imageUrl = imageMap.get(productCode) ?? "";

      products.push({
        externalId: productId,
        platform: "CICEKSEPETI",
        name,
        brand: "",
        imageUrl,
        url: `https://www.ciceksepeti.com${cleanHref}`,
        currentPrice: price,
        originalPrice: origPrice && origPrice > price ? origPrice : undefined,
        reviewCount,
        inStock: true,
      });
    } catch {}
  });

  return products.slice(0, 24);
}

function parseCsPrice(text: string): number {
  if (!text) return 0;
  // "1.790 TL" → 1790, "979,99 TL" → 979.99
  const clean = text.replace(/[^\d.,]/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".");
  return parseFloat(clean) || 0;
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
