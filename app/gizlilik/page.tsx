import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: `${SITE_NAME} gizlilik politikası: hangi verileri topladığımız, çerezler, Google AdSense reklamları ve KVKK kapsamındaki haklarınız.`,
  alternates: { canonical: "/gizlilik" },
};

export default function GizlilikPage() {
  return (
    <LegalPage title="Gizlilik Politikası" updated="23 Kasım 2026">
      <p>
        Bu politika, {SITE_NAME} (ruyagezginim.com) web sitesini ziyaret ettiğinizde hangi bilgilerin toplandığını,
        nasıl kullanıldığını ve haklarınızı açıklar. Siteyi kullanarak bu politikayı kabul etmiş sayılırsınız.
      </p>

      <h2>Topladığımız bilgiler</h2>
      <p>{SITE_NAME} üyelik gerektirmez; ad, telefon veya adres gibi kişisel bilgilerinizi istemeyiz.</p>
      <ul>
        <li>
          <strong>Arama sorguları:</strong> Sitede yaptığınız aramalar, popüler aramaları göstermek ve hizmeti
          iyileştirmek için kişiyle ilişkilendirilmeden kaydedilir.
        </li>
        <li>
          <strong>Teknik kayıtlar:</strong> Barındırma sağlayıcımız (Vercel) güvenlik ve performans amacıyla IP adresi,
          tarayıcı türü ve ziyaret zamanı gibi standart sunucu kayıtlarını tutar.
        </li>
        <li>
          <strong>Karşılaştırma listesi:</strong> Karşılaştırmaya eklediğiniz ürünler yalnızca kendi tarayıcınızda
          saklanır, bize gönderilmez.
        </li>
      </ul>

      <h2>Çerezler ve Google AdSense reklamları</h2>
      <p>
        Sitemizde Google AdSense aracılığıyla reklam gösterilmektedir. Bu kapsamda:
      </p>
      <ul>
        <li>
          Google dahil üçüncü taraf sağlayıcılar, bu siteye ve internetteki diğer sitelere yaptığınız önceki ziyaretlere
          dayanarak reklam sunmak için çerezleri kullanır.
        </li>
        <li>
          Google&apos;ın reklam çerezlerini kullanması, Google ve iş ortaklarının bu siteye ve/veya internetteki diğer
          sitelere yaptığınız ziyaretlere göre size reklam sunmasını sağlar.
        </li>
        <li>
          Kişiselleştirilmiş reklamları{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google Reklam Ayarları
          </a>{" "}
          sayfasından kapatabilirsiniz. Üçüncü taraf sağlayıcıların kişiselleştirilmiş reklam çerezlerini{" "}
          <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
            www.aboutads.info
          </a>{" "}
          adresinden devre dışı bırakabilirsiniz.
        </li>
        <li>
          Google&apos;ın verileri nasıl kullandığı hakkında ayrıntılı bilgi için{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            Google&apos;ın iş ortağı siteleri politikasını
          </a>{" "}
          inceleyebilirsiniz.
        </li>
      </ul>
      <p>
        Çerezleri tarayıcınızın ayarlarından silebilir veya engelleyebilirsiniz; bu durumda reklamlar yine gösterilir
        ancak ilgi alanlarınıza göre kişiselleştirilmez.
      </p>

      <h2>Üçüncü taraf bağlantıları</h2>
      <p>
        Sitede Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti gibi mağazalara bağlantılar bulunur. Bu sitelere
        geçtiğinizde onların gizlilik politikaları geçerlidir; bu sitelerin uygulamalarından sorumlu değiliz.
      </p>

      <h2>KVKK kapsamındaki haklarınız</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini
        öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme ve işlemeye itiraz etme haklarına sahipsiniz.
        Talepleriniz için <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> adresine yazabilirsiniz.
      </p>

      <h2>Çocukların gizliliği</h2>
      <p>Sitemiz 13 yaşın altındaki çocuklara yönelik değildir ve bilerek çocuklardan veri toplamaz.</p>

      <h2>Değişiklikler</h2>
      <p>
        Bu politikayı zaman zaman güncelleyebiliriz. Güncel sürüm her zaman bu sayfada, son güncelleme tarihiyle
        birlikte yayımlanır.
      </p>
    </LegalPage>
  );
}
