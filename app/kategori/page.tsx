import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kategoriler",
  description: "Rüya gibi fiyatlar: tüm kategorilerde en ucuz fiyatları karşılaştır.",
};

export const dynamic = "force-dynamic";

export default async function KategoriPage() {
  const groups = await db.product.groupBy({ by: ["category"], _count: { _all: true } });
  const counts = new Map(groups.map((g) => [g.category, g._count._all]));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
        Kategoriler
      </h1>
      <p className="text-gray-500 mb-8">İstediğin kategorideki ürünleri karşılaştır, en iyi fiyatı bul.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/kategori/${cat.slug}`}
            className="flex flex-col items-center gap-2 p-6 bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors group text-center"
          >
            <span className="text-4xl">{cat.icon}</span>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-700">{cat.label}</span>
            <span className="text-xs text-gray-400">{counts.get(cat.slug) ?? 0} ürün</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
