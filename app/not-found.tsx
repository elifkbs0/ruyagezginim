import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <p className="text-6xl font-black mb-4" style={{ color: "#EA580C" }}>404</p>
      <h1 className="text-2xl font-black text-gray-900 mb-2">Bu sayfa bir rüyaymış</h1>
      <p className="text-gray-500 mb-8">Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg" style={{ backgroundColor: "#EA580C" }}>
          Ana sayfaya dön
        </Link>
        <Link href="/firsatlar" className="text-sm font-semibold text-gray-700 px-5 py-2.5 rounded-lg border border-gray-200 hover:border-gray-400">
          Günün fırsatları
        </Link>
      </div>
    </div>
  );
}
