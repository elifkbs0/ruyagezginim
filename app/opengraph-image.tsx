import { ImageResponse } from "next/og";

export const alt = "Rüya Gezginim - Rüya gibi fiyatlar, gerçek tasarruf";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#ffffff",
          fontWeight: 900,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 48 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 22,
              background: "#EA580C",
              color: "#ffffff",
              fontSize: 68,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            R
          </div>
          <div style={{ display: "flex", fontSize: 52, color: "#111827" }}>
            <span style={{ color: "#EA580C" }}>Rüya</span>
            <span>Gezginim</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 80, color: "#EA580C", lineHeight: 1.1 }}>Rüya gibi fiyatlar,</div>
        <div style={{ display: "flex", fontSize: 80, color: "#111827", lineHeight: 1.1 }}>gerçek tasarruf.</div>
        <div style={{ display: "flex", fontSize: 32, color: "#6B7280", marginTop: 36, fontWeight: 400 }}>
          Trendyol · Hepsiburada · Amazon · N11 · Çiçeksepeti
        </div>
      </div>
    ),
    { ...size }
  );
}
