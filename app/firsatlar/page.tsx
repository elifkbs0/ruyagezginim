import { AdSenseBanner } from "@/components/adsense";
import { DealCard } from "@/components/deal-card";
import { getTopDeals } from "@/lib/deals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fırsatlar - En Büyük İndirimler",
  description: "Bugünün en büyük indirimleri ve fırsatları. Rüya gibi fiyatlarla alışveriş yap.",
  alternates: { canonical: "/firsatlar" },
};

export const dynamic = "force-dynamic";

export default async function FirsatlarPage() {
  const deals = await getTopDeals({ limit: 24, perCategory: 4 });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold mb-2" style={{ color: "#EA580C" }}>
          Günün fırsatları
        </p>
        <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
          En büyük indirimler, rüya gibi fiyatlar
        </h1>
        <p className="text-gray-500">İndirim oranına göre sıralı. Her ürün bir kez gösterilir.</p>
      </div>

      <AdSenseBanner />

      {deals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-gray-700">Henüz fırsat yok</p>
          <p className="text-sm text-gray-500 mt-2">Ürün araması yaptıkça fırsatlar burada görünecek.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}

      <AdSenseBanner />
    </div>
  );
}
