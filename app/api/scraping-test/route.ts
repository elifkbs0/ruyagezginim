import { NextResponse } from "next/server";
import { proxyFetch, hasProxy } from "@/lib/scrapers/proxy";
import { searchHepsiburada, searchAmazon, searchCiceksepeti } from "@/lib/scrapers/trendyol";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET() {
  const results: Record<string, string> = {
    scraperApiKey: process.env.SCRAPER_API_KEY ? "✓ Ayarlı" : "✗ Eksik",
    scrapingBeeKey: process.env.SCRAPINGBEE_KEY ? "✓ Ayarlı" : "✗ Eksik",
    proxyActive: hasProxy() ? "✓ Aktif" : "✗ Aktif değil",
  };

  // Test Trendyol (ScraperAPI + render)
  try {
    const start = Date.now();
    const res = await proxyFetch("https://www.trendyol.com/sr?q=iPhone&pi=1", { render: true });
    const ms = Date.now() - start;
    if (res) {
      const html = await res.text();
      const hasData = html.includes('"itemNumber":') || html.includes("__NEXT_DATA__");
      results["trendyol"] = `✓ ${res.status} (${ms}ms, ${html.length} bytes) ${hasData ? "— veri var!" : "— veri yok (Cloudflare?)"}`;
    } else {
      results["trendyol"] = `✗ Bağlanamadı`;
    }
  } catch (e) {
    results["trendyol"] = `✗ Hata: ${e}`;
  }

  // Test Hepsiburada (direct fetch, /ara?q=)
  try {
    const start = Date.now();
    const products = await searchHepsiburada("iPhone");
    const ms = Date.now() - start;
    results["hepsiburada"] = `✓ ${ms}ms — ${products.length} ürün bulundu`;
    if (products.length > 0) {
      const p = products[0];
      results["hb_sample"] = `${p.name} | ₺${p.currentPrice} | ⭐${p.rating ?? "?"} | ${p.imageUrl ? "resim✓" : "resim✗"}`;
    }
  } catch (e) {
    results["hepsiburada"] = `✗ Hata: ${e}`;
  }

  // Test Amazon Turkey
  try {
    const start = Date.now();
    const products = await searchAmazon("iPhone");
    const ms = Date.now() - start;
    results["amazon"] = `✓ ${ms}ms — ${products.length} ürün bulundu`;
    if (products.length > 0) {
      const p = products[0];
      results["amz_sample"] = `${p.name.slice(0, 60)} | ₺${p.currentPrice} | ⭐${p.rating ?? "?"} | ${p.imageUrl ? "resim✓" : "resim✗"}`;
    }
  } catch (e) {
    results["amazon"] = `✗ Hata: ${e}`;
  }

  // Test Çiçeksepeti
  try {
    const start = Date.now();
    const products = await searchCiceksepeti("parfüm");
    const ms = Date.now() - start;
    results["ciceksepeti"] = `✓ ${ms}ms — ${products.length} ürün bulundu`;
    if (products.length > 0) {
      const p = products[0];
      results["cs_sample"] = `${p.name.slice(0, 60)} | ₺${p.currentPrice} | ${p.reviewCount ?? "?"} yorum | ${p.imageUrl ? "resim✓" : "resim✗"}`;
    }
  } catch (e) {
    results["ciceksepeti"] = `✗ Hata: ${e}`;
  }

  return NextResponse.json(results, {
    headers: { "Content-Type": "application/json" },
  });
}
