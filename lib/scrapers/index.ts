import { searchTrendyol, searchHepsiburada, searchN11, type ScrapedProduct } from "./trendyol";
export { hasProxy } from "./proxy";
export type { ScrapedProduct };

export async function searchAllPlatforms(query: string): Promise<ScrapedProduct[]> {
  const [trendyol, hepsiburada, n11] = await Promise.allSettled([
    searchTrendyol(query),
    searchHepsiburada(query),
    searchN11(query),
  ]);

  const results: ScrapedProduct[] = [];
  if (trendyol.status === "fulfilled") results.push(...trendyol.value);
  if (hepsiburada.status === "fulfilled") results.push(...hepsiburada.value);
  if (n11.status === "fulfilled") results.push(...n11.value);

  return results;
}
