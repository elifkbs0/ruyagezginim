import { searchTrendyol, searchHepsiburada, searchN11, searchAmazon, type ScrapedProduct } from "./trendyol";
export { hasProxy } from "./proxy";
export type { ScrapedProduct };

export async function searchAllPlatforms(query: string): Promise<ScrapedProduct[]> {
  const [trendyol, hepsiburada, n11, amazon] = await Promise.allSettled([
    searchTrendyol(query),
    searchHepsiburada(query),
    searchN11(query),
    searchAmazon(query),
  ]);

  const results: ScrapedProduct[] = [];
  if (trendyol.status === "fulfilled") results.push(...trendyol.value);
  if (hepsiburada.status === "fulfilled") results.push(...hepsiburada.value);
  if (n11.status === "fulfilled") results.push(...n11.value);
  if (amazon.status === "fulfilled") results.push(...amazon.value);

  return results;
}
