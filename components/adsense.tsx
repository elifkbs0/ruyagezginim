"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// Auto Ads: Google otomatik olarak sayfaya en uygun yerlere reklam yerleştirir.
// layout.tsx'teki script etiketi Auto Ads'i aktive eder.
// Manuel reklam birimi için AdSense panelinden gerçek bir Slot ID alıp
// aşağıdaki DEFAULT_SLOT'u güncelleyebilirsin.
const DEFAULT_SLOT = ""; // Örn: "1234567890"

interface AdSenseProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export function AdSense({ slot = DEFAULT_SLOT, format = "auto", className = "" }: AdSenseProps) {
  useEffect(() => {
    if (!slot) return; // Slot yoksa manuel birim oluşturma, Auto Ads yeterli
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [slot]);

  if (!slot) return null; // Auto Ads modunda boş render et

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8340130505270753"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdSenseBanner({ className = "" }: { className?: string }) {
  return <AdSense format="horizontal" className={`my-6 ${className}`} />;
}
