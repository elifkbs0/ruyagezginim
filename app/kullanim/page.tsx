import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description: `${SITE_NAME} kullanım koşulları: fiyat bilgilerinin niteliği, sorumluluk sınırları ve üçüncü taraf mağazalar.`,
  alternates: { canonical: "/kullanim" },
};

export default function KullanimPage() {
  return (
    <LegalPage title="Kullanım Koşulları" updated="23 Kasım 2026">
      <p>
        {SITE_NAME}&apos;i (ruyagezginim.com) kullanarak aşağıdaki koşulları kabul etmiş olursunuz.
      </p>

      <h2>Hizmetin niteliği</h2>
      <p>
        {SITE_NAME}, farklı e-ticaret sitelerindeki ürün fiyatlarını bir araya getiren ücretsiz bir fiyat karşılaştırma
        sitesidir. Satıcı değiliz; ürün satmaz, ödeme almaz ve sipariş, teslimat ya da iade süreçlerine taraf olmayız.
      </p>

      <h2>Fiyat ve stok bilgileri</h2>
      <ul>
        <li>Fiyatlar ilgili mağazalardan düzenli aralıklarla toplanır ve bilgilendirme amaçlıdır.</li>
        <li>Mağazadaki güncel fiyat, kampanya ve stok durumu sitemizde gösterilenden farklı olabilir.</li>
        <li>Satın almadan önce fiyatı ve koşulları her zaman ilgili mağazada kontrol edin.</li>
      </ul>

      <h2>Üçüncü taraf mağazalar</h2>
      <p>
        &quot;Fırsata Git&quot; veya &quot;En İyi Fiyata Git&quot; bağlantıları sizi ilgili mağazanın sitesine yönlendirir.
        Bu sitelerdeki alışverişler tamamen o mağazanın koşullarına tabidir. Trendyol, Hepsiburada, Amazon, N11 ve
        Çiçeksepeti adları ve logoları ilgili şirketlerin tescilli markalarıdır.
      </p>

      <h2>Sorumluluğun sınırlandırılması</h2>
      <p>
        Sitedeki bilgilerin doğru ve güncel olması için çaba gösteririz ancak eksiksiz olduğunu garanti etmeyiz. Bu
        bilgilere dayanılarak verilen kararlardan doğabilecek zararlardan {SITE_NAME} sorumlu tutulamaz.
      </p>

      <h2>Kabul edilemez kullanım</h2>
      <p>
        Siteyi otomatik araçlarla aşırı yüklemek, içeriği toplu olarak kopyalamak veya hizmetin işleyişini bozmaya
        yönelik girişimlerde bulunmak yasaktır.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> adresine yazabilirsiniz.
      </p>
    </LegalPage>
  );
}
