"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// Responsive display unit "AnaSayfaBanner" in the AdSense account.
const DEFAULT_SLOT = "2497588283";

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
  return <AdSense format="auto" className={`my-6 min-h-[100px] ${className}`} />;
}
