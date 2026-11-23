import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CATEGORIES, discountPercent, type Platform } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { AdSenseBanner } from "@/components/adsense";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

const SORTS = [
  { key: "populer", label: "Popüler" },
  { key: "ucuz", label: "En ucuz" },
  { key: "pahali", label: "En pahalı" },
  { key: "indirim", label: "En çok indirim" },
] as const;
type SortKey = (typeof SORTS)[number]["key"];

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sirala?: string; sayfa?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "Kategori bulunamadı" };
  return {
    title: `${cat.label} Fiyat Karşılaştırması`,
    description: `Rüya gibi fiyatlar: ${cat.label} ürünlerini Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti'nde karşılaştır.`,
    alternates: { canonical: `/kategori/${cat.slug}` },
  };
}

export default async function KategoriSlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  const sp = await searchParams;
  const sort: SortKey = SORTS.some((s) => s.key === sp.sirala) ? (sp.sirala as SortKey) : "populer";

  const products = await db.product.findMany({
    where: { category: slug, listings: { some: {} } },
    include: { listings: { orderBy: { currentPrice: "asc" } } },
    orderBy: [{ viewCount: "desc" }, { updatedAt: "desc" }],
  });

  const rows = products.map((p) => {
    const best = p.listings[0];
    const prices = p.listings.map((l) => l.currentPrice);
    const image = p.imageUrl ?? p.listings.find((l) => l.imageUrl)?.imageUrl ?? null;
    const discount = best.originalPrice ? discountPercent(best.originalPrice, best.currentPrice) : 0;
    return { p, best, prices, image, discount };
  });

  // Products with images first, then the chosen order.
  rows.sort((a, b) => {
    if (!!a.image !== !!b.image) return a.image ? -1 : 1;
    if (sort === "ucuz") return a.best.currentPrice - b.best.currentPrice;
    if (sort === "pahali") return b.best.currentPrice - a.best.currentPrice;
    if (sort === "indirim") return b.discount - a.discount;
    return 0;
  });

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const page = Math.min(pageCount, Math.max(1, Number.parseInt(sp.sayfa ?? "1", 10) || 1));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const href = (next: { sirala?: SortKey; sayfa?: number }) => {
    const q = new URLSearchParams();
    const s = next.sirala ?? sort;
    const n = next.sayfa ?? 1;
    if (s !== "populer") q.set("sirala", s);
    if (n > 1) q.set("sayfa", String(n));
    const qs = q.toString();
    return `/kategori/${slug}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <nav className="text-sm text-gray-400 mb-4">
        <Link href="/kategori" className="hover:text-orange-600">Kategoriler</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{cat.label}</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900" style={{ letterSpacing: "-0.02em" }}>
            {cat.icon} {cat.label}
          </h1>
          <p className="text-gray-500 mt-1">{rows.length} ürün</p>
        </div>
        {rows.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {SORTS.map((s) => (
              <Link
                key={s.key}
                href={href({ sirala: s.key })}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  s.key === sort
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <AdSenseBanner />

      {rows.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-lg font-medium text-gray-700">Bu kategoride henüz ürün yok</p>
          <p className="text-sm text-gray-500 mt-2 mb-5">Aradığın ürünü yaz, fiyatlarını senin için toplayalım.</p>
          <Link
            href={`/ara?q=${encodeURIComponent(cat.label)}`}
            className="inline-block text-sm font-semibold text-white px-5 py-2.5 rounded-lg"
            style={{ backgroundColor: "#EA580C" }}
          >
            {cat.label} ara
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visible.map(({ p, best, prices, image }) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                imageUrl={image ?? undefined}
                brand={p.brand ?? undefined}
                bestPrice={best.currentPrice}
                bestPlatform={best.platform as Platform}
                bestUrl={best.url}
                originalPrice={best.originalPrice ?? undefined}
                rating={best.rating ?? undefined}
                reviewCount={best.reviewCount ?? undefined}
                platformCount={p.listings.length}
                priceMin={Math.min(...prices)}
                priceMax={Math.max(...prices)}
              />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <Link href={href({ sayfa: page - 1 })} className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-400">
                  Önceki
                </Link>
              )}
              <span className="text-sm text-gray-500 px-2">
                {page} / {pageCount}
              </span>
              {page < pageCount && (
                <Link href={href({ sayfa: page + 1 })} className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-400">
                  Sonraki
                </Link>
              )}
            </div>
          )}
        </>
      )}

      <AdSenseBanner />
    </div>
  );
}
