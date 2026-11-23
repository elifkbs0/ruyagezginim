"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImage({
  src,
  alt,
  className = "object-contain p-3",
  sizes = "(max-width: 640px) 50vw, 25vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-orange-50">
        <span className="text-4xl font-black text-orange-300 select-none">
          {alt.trim().charAt(0).toUpperCase() || "R"}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
