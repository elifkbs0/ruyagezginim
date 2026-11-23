import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { AdSenseBanner } from "@/components/adsense";
import { Countdown } from "@/components/countdown";
import { DealCard, type Deal } from "@/components/deal-card";
import { JsonLd } from "@/components/json-ld";
import { getTopDeals } from "@/lib/deals";
import { CATEGORIES, discountPercent } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { blackFridayDay, blackFridayStart, campaignYear, CAMPAIGN_PATH, isNovemberInIstanbul } from "@/lib/campaign";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const year = campaignYear();
  const title = `Kasım İndirimleri ${year}: Black Friday ve Efsane Cuma Fırsatları`;
  const description = `Kasım indirimleri ${year} burada! Black Friday (${blackFridayDay(year)} Kasım) ve Efsane Cuma fırsatlarını Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti'nde karşılaştır, rüya gibi fiyatları kaçırma.`;
  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    keywords: [
      `kasım indirimleri ${year}`,
      "kasım indirimleri",
      `black friday ${year}`,
      "black friday indirimleri",
      "efsane cuma",
      "efsane kasım",
      "kasım fırsatları",
      "black friday ne zaman",
      "en ucuz fiyat",
    ],
    alternates: { canonical: CAMPAIGN_PATH },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: SITE_NAME,
      url: CAMPAIGN_PATH,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function faq(year: number, bfDay: number) {
  return [
    {
      q: `Black Friday ${year} ne zaman?`,
      a: `Black Friday her yıl Kasım ayının son cuması yapılır. ${year} yılında Black Friday ${bfDay} Kasım Cuma günüdür. Türkiye'de bu dönem "Efsane Cuma" olarak da bilinir; birçok mağaza indirimleri bu günden önce başlatıp hafta sonuna kadar uzatır.`,
    },
    {
      q: "Kasım indirimleri ne zaman başlıyor ve ne kadar sürüyor?",
      a: "Büyük e-ticaret siteleri kampanyalarını Kasım ayının başından itibaren dalgalar halinde başlatır. En yüksek indirimler genellikle Black Friday haftasında ve hemen ardından gelen Cyber Monday'de görülür. Kampanya tarihleri mağazadan mağazaya değişir.",
    },
    {
      q: "Kasım indirimlerinde sahte indirimden nasıl korunurum?",
      a: "Bazı ürünlerin fiyatı kampanyadan hemen önce yükseltilip ardından 'indirimli' gösterilebilir. Rüya Gezginim'de her ürün sayfasında fiyat geçmişini ve aynı ürünün diğer mağazalardaki fiyatını görebilirsin. Üstü çizili fiyata değil, ürünün son haftalardaki gerçek fiyatına bak.",
    },
    {
      q: "Hangi mağazada daha ucuz olduğunu nasıl anlarım?",
      a: "Ürünü Rüya Gezginim'de arattığında Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti'ndeki fiyatlar ucuzdan pahalıya sıralanır. Satın almadan önce kargo ücretini ve satıcı puanını da mağazada kontrol etmeni öneririz.",
    },
    {
      q: "Kasım indirimlerinde en çok neler alınır?",
      a: "Telefon, kulaklık, akıllı saat ve laptop gibi elektronik ürünler; airfryer, robot süpürge ve kahve makinesi gibi ev aletleri; ayakkabı, mont ve çanta gibi moda ürünleri ile kozmetik ürünleri Kasım indirimlerinde en çok aranan kategorilerdir.",
    },
  ];
}

export default async function KasimIndirimleriPage() {
  const now = new Date();
  const year = campaignYear(now);
  const bfDay = blackFridayDay(year);
  const bfStart = blackFridayStart(year);
  const inNovember = isNovemberInIstanbul(now);
  const beforeBlackFriday = now < bfStart;

  const deals = await getTopDeals({ limit: 120, perCategory: 8 });
  // Top grid: at most 2 per category so one product type can't fill it.
  const topPerCategory = new Map<string, number>();
  const top = deals
    .filter((d) => {
      const n = topPerCategory.get(d.product.category) ?? 0;
      if (n >= 2) return false;
      topPerCategory.set(d.product.category, n + 1);
      return true;
    })
    .slice(0, 8);
  const topIds = new Set(top.map((d) => d.id));
  const byCategory = new Map<string, Deal[]>();
  for (const d of deals) {
    if (topIds.has(d.id)) continue;
    const list = byCategory.get(d.product.category) ?? [];
    if (list.length < 4) list.push(d);
    byCategory.set(d.product.category, list);
  }
  const sections = CATEGORIES.map((c) => ({ cat: c, items: byCategory.get(c.slug) ?? [] })).filter((s) => s.items.length > 0);
  const maxDiscount = deals.reduce((m, d) => Math.max(m, discountPercent(d.originalPrice!, d.currentPrice)), 0);
  const questions = faq(year, bfDay);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map((x) => ({
        "@type": "Question",
        name: x.q,
        acceptedAnswer: { "@type": "Answer", text: x.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: `Kasım İndirimleri ${year}`, item: `${SITE_URL}${CAMPAIGN_PATH}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Kasım İndirimleri ${year} - En Büyük Fırsatlar`,
      itemListElement: top.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/urun/${d.product.slug}`,
        name: d.product.name,
      })),
    },
  ];

  return (
    <div>
      <JsonLd data={jsonLd} />

      <section className="border-b border-gray-100 bg-orange-50/60">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <nav className="text-sm text-gray-400 mb-4">
              <Link href="/" className="hover:text-orange-600">Ana Sayfa</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-600">Kasım İndirimleri {year}</span>
            </nav>
            <p className="inline-block text-xs font-bold tracking-wide text-white px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "#EA580C" }}>
              Black Friday · Efsane Cuma
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4" style={{ letterSpacing: "-0.03em" }}>
              Kasım İndirimleri {year}:{" "}
              <span style={{ color: "#EA580C" }}>rüya gibi fiyatlar</span> burada
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Black Friday {year} <strong>{bfDay} Kasım Cuma</strong>. Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti&apos;ndeki
              Kasım indirimlerini tek sayfada topladık{maxDiscount > 0 ? <>; şu an <strong>%{maxDiscount}&apos;e varan</strong> indirimler var</> : null}.
              Fiyatları karşılaştır, sahte indirime takılma.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#en-buyuk-indirimler" className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-3 rounded-lg" style={{ backgroundColor: "#EA580C" }}>
                Fırsatları gör <ArrowRight size={16} />
              </a>
              <a href="#rehber" className="inline-flex items-center text-sm font-semibold text-gray-700 px-5 py-3 rounded-lg border border-gray-300 bg-white hover:border-gray-400">
                Sahte indirimden korun
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-white p-6">
            {beforeBlackFriday ? (
              <>
                <p className="text-sm font-semibold text-gray-500 mb-3">Black Friday&apos;e kalan süre</p>
                <Countdown target={bfStart.toISOString()} />
                <p className="text-sm text-gray-500 mt-4">
                  Birçok mağaza indirimlere şimdiden başladı. Fiyatlar her aramada güncellenir.
                </p>
              </>
            ) : inNovember ? (
              <>
                <p className="text-2xl font-black text-gray-900 mb-2">Black Friday indirimleri sürüyor</p>
                <p className="text-sm text-gray-500">Kampanyaların çoğu Kasım sonuna kadar devam ediyor. Fırsatlar aşağıda.</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-black text-gray-900 mb-2">Kasım indirimleri sona erdi</p>
                <p className="text-sm text-gray-500">Mağazalardaki güncel indirimleri aşağıda görebilirsin.</p>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-14">
        <AdSenseBanner />

        {top.length > 0 && (
          <section id="en-buyuk-indirimler" className="scroll-mt-20">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Kasım&apos;ın en büyük indirimleri</h2>
                <p className="text-sm text-gray-500 mt-1">İndirim oranına göre sıralı, her ürün bir kez gösterilir.</p>
              </div>
              <Link href="/firsatlar" className="text-sm font-semibold flex items-center gap-1 shrink-0" style={{ color: "#EA580C" }}>
                Tüm fırsatlar <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {top.map((d) => (
                <DealCard key={d.id} deal={d} />
              ))}
            </div>
          </section>
        )}

        {sections.map(({ cat, items }) => (
          <section key={cat.slug}>
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                {cat.icon} {cat.label} Kasım indirimleri
              </h2>
              <Link href={`/kategori/${cat.slug}?sirala=indirim`} className="text-sm font-semibold flex items-center gap-1 shrink-0" style={{ color: "#EA580C" }}>
                Tümü <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((d) => (
                <DealCard key={d.id} deal={d} />
              ))}
            </div>
          </section>
        ))}

        <AdSenseBanner />

        <section id="rehber" className="scroll-mt-20 max-w-3xl space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-black text-gray-900">Kasım indirimleri {year} rehberi</h2>
          <p>
            Kasım, Türkiye&apos;de yılın en büyük alışveriş dönemi. Black Friday, Efsane Cuma ve Efsane Kasım gibi adlarla
            düzenlenen kampanyalarda e-ticaret siteleri binlerce üründe indirim yapıyor. Bu yoğunlukta gerçek fırsatı
            bulmanın en kolay yolu aynı ürünün fiyatını birden fazla mağazada karşılaştırmak.
          </p>
          <h3 className="text-lg font-bold text-gray-900 pt-2">Gerçek indirimi bulmak için 4 ipucu</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Fiyat geçmişine bak.</strong> Ürün sayfalarımızdaki fiyat geçmişi, indirimin gerçekten indirim olup
              olmadığını gösterir.
            </li>
            <li>
              <strong>Birden fazla mağazayı karşılaştır.</strong> Aynı ürün bir mağazada &quot;%40 indirimli&quot; görünürken
              diğerinde zaten daha ucuz olabilir.
            </li>
            <li>
              <strong>Kargo ve satıcıyı kontrol et.</strong> Düşük fiyatlı ilanlarda kargo ücreti ve satıcı puanı toplam
              maliyeti değiştirebilir.
            </li>
            <li>
              <strong>Listeni önceden hazırla.</strong> Almak istediklerini Black Friday&apos;den önce belirle, ürünleri
              karşılaştırma listene ekle; kampanya başladığında hızlıca karar ver.
            </li>
          </ol>
          <h3 className="text-lg font-bold text-gray-900 pt-2">Kategorilere göre Kasım fırsatları</h3>
          <p>
            {CATEGORIES.map((c, i) => (
              <span key={c.slug}>
                <Link href={`/kategori/${c.slug}`} className="text-orange-600 underline">
                  {c.label}
                </Link>
                {i < CATEGORIES.length - 1 ? ", " : ""}
              </span>
            ))}{" "}
            kategorilerindeki tüm ürünleri en çok indirimden en aza sıralayarak inceleyebilirsin.
          </p>
        </section>

        <section className="max-w-3xl">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Sık sorulan sorular</h2>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {questions.map((x) => (
              <details key={x.q} className="group py-4">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-gray-900">
                  <h3>{x.q}</h3>
                  <span className="text-orange-600 text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{x.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
