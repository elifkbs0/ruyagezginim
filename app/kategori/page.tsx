import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategoriler",
  description: "Tüm kategorilerde en iyi fiyatları karşılaştır.",
};

export default function KategoriPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Kategoriler</h1>
      <p className="text-gray-500 mb-8">
        İstediğin kategorideki ürünleri karşılaştır, en iyi fiyatı bul.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/kategori/${cat.slug}`}
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-purple-100 hover:border-purple-400 hover:shadow-lg transition-all group"
          >
            <span className="text-5xl">{cat.icon}</span>
            <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-purple-700 transition-colors">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
