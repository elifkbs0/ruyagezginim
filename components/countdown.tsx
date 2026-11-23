"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: "gün", value: Math.floor(s / 86400) },
    { label: "saat", value: Math.floor((s % 86400) / 3600) },
    { label: "dakika", value: Math.floor((s % 3600) / 60) },
    { label: "saniye", value: s % 60 },
  ];
}

export function Countdown({ target }: { target: string }) {
  const end = new Date(target).getTime();
  // Render nothing time-dependent until mounted so server and client HTML match.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now !== null && now >= end) return null;

  return (
    <div className="flex gap-2" aria-label="Black Friday'e kalan süre">
      {parts(now === null ? 0 : end - now).map((p) => (
        <div key={p.label} className="min-w-16 rounded-xl bg-gray-900 text-white px-3 py-2 text-center">
          <div className="text-2xl font-black tabular-nums">{now === null ? "–" : String(p.value).padStart(2, "0")}</div>
          <div className="text-[11px] text-gray-300">{p.label}</div>
        </div>
      ))}
    </div>
  );
}
