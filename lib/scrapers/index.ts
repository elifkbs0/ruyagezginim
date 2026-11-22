import { searchTrendyol, searchHepsiburada, type ScrapedProduct } from "./trendyol";

export type { ScrapedProduct };

export async function searchAllPlatforms(query: string): Promise<ScrapedProduct[]> {
  const [trendyol, hepsiburada] = await Promise.allSettled([
    searchTrendyol(query),
    searchHepsiburada(query),
  ]);

  const results: ScrapedProduct[] = [];
  if (trendyol.status === "fulfilled") results.push(...trendyol.value);
  if (hepsiburada.status === "fulfilled") results.push(...hepsiburada.value);

  return results;
}

export function groupByName(products: ScrapedProduct[]) {
  const groups: Record<string, ScrapedProduct[]> = {};
  for (const p of products) {
    const key = normalizeProductName(p.name);
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }
  return groups;
}

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}
