import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${SITE_NAME} ile iletişime geç: öneri, hata bildirimi, iş birliği ve KVKK talepleri.`,
  alternates: { canonical: "/iletisim" },
};

export default function IletisimPage() {
  return (
    <LegalPage title="İletişim">
      <p>Öneri, hata bildirimi, iş birliği veya kişisel verilerinle ilgili talepler için bize e-postayla ulaşabilirsin.</p>

      <div className="not-prose my-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <p className="text-sm text-gray-500 mb-1">E-posta</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-xl font-bold" style={{ color: "#EA580C" }}>
          {CONTACT_EMAIL}
        </a>
        <p className="text-sm text-gray-500 mt-3">Genellikle 2 iş günü içinde yanıt veriyoruz.</p>
      </div>

      <h2>Fiyat hatası mı gördün?</h2>
      <p>
        Ürünün sayfa adresini ve gördüğün hatayı e-postana eklersen hızlıca düzeltiriz. Fiyatlar mağazalardan
        otomatik toplandığı için zaman zaman gecikme olabilir.
      </p>
    </LegalPage>
  );
}
