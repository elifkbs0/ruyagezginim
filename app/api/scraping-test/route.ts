import { NextResponse } from "next/server";
import { proxyFetch, hasProxy } from "@/lib/scrapers/proxy";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET() {
  const results: Record<string, string> = {
    scraperApiKey: process.env.SCRAPER_API_KEY ? "✓ Ayarlı" : "✗ Eksik",
    scrapingBeeKey: process.env.SCRAPINGBEE_KEY ? "✓ Ayarlı" : "✗ Eksik",
    proxyActive: hasProxy() ? "✓ Aktif" : "✗ Aktif değil",
  };

  // Test Trendyol
  try {
    const start = Date.now();
    const res = await proxyFetch("https://www.trendyol.com/sr?q=iPhone&pi=1", { render: true });
    const ms = Date.now() - start;
    if (res) {
      const html = await res.text();
      const hasNextData = html.includes("__NEXT_DATA__");
      const hasProductId = html.includes("productId");
      const hasProductCard = html.includes("p-card") || html.includes("product-card");
      const hasData = html.includes('"itemNumber":') || html.includes("__NEXT_DATA__");
      results["trendyol"] = `✓ ${res.status} (${ms}ms, ${html.length} bytes) ${hasData ? "— veri var!" : "— veri yok (Cloudflare?)"}`;
    } else {
      results["trendyol"] = `✗ Bağlanamadı`;
    }
  } catch (e) {
    results["trendyol"] = `✗ Hata: ${e}`;
  }

  // Test Hepsiburada
  try {
    const start = Date.now();
    const res = await proxyFetch("https://www.hepsiburada.com/arama?q=iPhone", { render: true });
    const ms = Date.now() - start;
    if (res) {
      const html = await res.text();
      const hasData = html.includes("productListContent") || html.includes("listingProducts");
      results["hepsiburada"] = `✓ ${res.status} (${ms}ms, ${html.length} bytes) ${hasData ? "— veri var!" : "— veri yok"}`;
    } else {
      results["hepsiburada"] = `✗ Bağlanamadı`;
    }
  } catch (e) {
    results["hepsiburada"] = `✗ Hata: ${e}`;
  }

  return NextResponse.json(results, {
    headers: { "Content-Type": "application/json" },
  });
}
