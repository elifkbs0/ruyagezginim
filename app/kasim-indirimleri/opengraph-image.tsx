import { ImageResponse } from "next/og";
import { blackFridayDay, campaignYear } from "@/lib/campaign";

export const alt = "Kasım İndirimleri - Black Friday ve Efsane Cuma fırsatları | Rüya Gezginim";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default function OpengraphImage() {
  const year = campaignYear();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "#EA580C",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#ffffff",
              color: "#EA580C",
              fontSize: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            R
          </div>
          <div style={{ display: "flex", fontSize: 40 }}>Rüya Gezginim</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, lineHeight: 1.05 }}>Kasım İndirimleri {year}</div>
          <div style={{ display: "flex", fontSize: 44, marginTop: 20, color: "#FFEDD5" }}>
            Black Friday {blackFridayDay(year)} Kasım · Efsane Cuma fırsatları
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#FFEDD5" }}>
          Trendyol · Hepsiburada · Amazon · N11 · Çiçeksepeti fiyatlarını karşılaştır
        </div>
      </div>
    ),
    { ...size }
  );
}
