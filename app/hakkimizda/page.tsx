import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `${SITE_NAME}, Türkiye'nin büyük alışveriş sitelerindeki fiyatları tek aramada karşılaştıran ücretsiz bir araçtır. Rüya gibi fiyatları senin için buluyoruz.`,
  alternates: { canonical: "/hakkimizda" },
};

export default function HakkimizdaPage() {
  return (
    <LegalPage title="Hakkımızda">
      <p className="text-lg">
        <strong>{SITE_NAME}</strong>, aynı ürünü beş farklı sitede tek tek aramaktan yorulanlar için kuruldu. Amacımız
        basit: rüya gibi fiyatları senin yerine bulmak.
      </p>

      <h2>Ne yapıyoruz?</h2>
      <p>
        Trendyol, Hepsiburada, Amazon Türkiye, N11 ve Çiçeksepeti&apos;ndeki fiyatları tek bir aramada yan yana
        getiriyoruz. Hangi mağazanın daha ucuz olduğunu, indirimin gerçekten ne kadar olduğunu ve fiyatın zaman içinde
        nasıl değiştiğini görebilirsin.
      </p>

      <h2>Nasıl çalışır?</h2>
      <ul>
        <li>Aradığın ürünü yazarsın.</li>
        <li>Mağazalardaki güncel fiyatları toplar ve en ucuzdan pahalıya sıralarız.</li>
        <li>Beğendiğin teklife tıklayıp alışverişi doğrudan mağazada tamamlarsın.</li>
      </ul>

      <h2>Neden ücretsiz?</h2>
      <p>
        {SITE_NAME} kullanıcılardan ücret almaz ve üyelik istemez. Sitenin giderleri sayfalarda gösterilen reklamlarla
        karşılanır. Fiyat sıralamaları reklamlardan etkilenmez.
      </p>

      <p>
        Bir önerin ya da hata bildirimin mi var? <Link href="/iletisim">Bize ulaş</Link>.
      </p>
    </LegalPage>
  );
}
