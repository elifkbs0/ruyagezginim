/**
 * Proxy helper for bypassing Cloudflare/bot protection.
 *
 * Supported methods (priority order):
 * 1. ScraperAPI  — set SCRAPER_API_KEY in .env  (5000 req/month free)
 *    Sign up: https://www.scraperapi.com/
 * 2. ScrapingBee — set SCRAPINGBEE_KEY in .env  (1000 req/month free)
 *    Sign up: https://www.scrapingbee.com/
 * 3. Direct fetch — no key needed, fails on Cloudflare-protected sites
 */

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/json,*/*",
  "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
};

export async function proxyFetch(
  url: string,
  options?: { render?: boolean; json?: boolean }
): Promise<Response | null> {
  const scraperApiKey = process.env.SCRAPER_API_KEY;
  const scrapingBeeKey = process.env.SCRAPINGBEE_KEY;

  // 1. ScraperAPI
  if (scraperApiKey) {
    const params = new URLSearchParams({
      api_key: scraperApiKey,
      url,
      country_code: "tr",
      ...(options?.render ? { render: "true" } : {}),
    });
    try {
      const timeoutMs = options?.render ? 70000 : 25000;
      const res = await fetch(
        `http://api.scraperapi.com?${params}`,
        { headers: HEADERS, signal: AbortSignal.timeout(timeoutMs) }
      );
      if (res.ok) return res;
      console.warn("[ScraperAPI] status:", res.status);
    } catch (e) {
      console.warn("[ScraperAPI] error:", e);
    }
  }

  // 2. ScrapingBee
  if (scrapingBeeKey) {
    const params = new URLSearchParams({
      api_key: scrapingBeeKey,
      url,
      country_code: "TR",
      ...(options?.render ? { render_js: "true" } : { render_js: "false" }),
    });
    try {
      const res = await fetch(
        `https://app.scrapingbee.com/api/v1/?${params}`,
        { headers: HEADERS, signal: AbortSignal.timeout(25000) }
      );
      if (res.ok) return res;
      console.warn("[ScrapingBee] status:", res.status);
    } catch (e) {
      console.warn("[ScrapingBee] error:", e);
    }
  }

  // 3. Direct fetch (may be blocked by Cloudflare)
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(12000),
    });
    if (res.ok || res.status === 403) {
      return res.ok ? res : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function hasProxy(): boolean {
  return !!(process.env.SCRAPER_API_KEY || process.env.SCRAPINGBEE_KEY);
}
