import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\u0307/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function discountPercent(original: number, current: number): number {
  if (original <= 0 || current >= original) return 0;
  return Math.round(((original - current) / original) * 100);
}

export const PLATFORMS = {
  TRENDYOL: { label: "Trendyol", color: "#F27A1A", bg: "#FFF3E8" },
  HEPSIBURADA: { label: "Hepsiburada", color: "#FF6000", bg: "#FFF1EA" },
  AMAZON: { label: "Amazon", color: "#FF9900", bg: "#FFFAE6" },
  N11: { label: "N11", color: "#6B3FA0", bg: "#F3EEFF" },
  CICEKSEPETI: { label: "Çiçeksepeti", color: "#E91E8C", bg: "#FEE9F4" },
} as const;

export type Platform = keyof typeof PLATFORMS;

export const CATEGORIES = [
  { slug: "elektronik", label: "Elektronik", icon: "💻" },
  { slug: "telefon-aksesuar", label: "Telefon & Aksesuar", icon: "📱" },
  { slug: "ev-yasam", label: "Ev & Yaşam", icon: "🏠" },
  { slug: "moda", label: "Moda", icon: "👗" },
  { slug: "spor-outdoor", label: "Spor & Outdoor", icon: "⚽" },
  { slug: "oyun-konsol", label: "Oyun & Konsol", icon: "🎮" },
  { slug: "kitap-muzik", label: "Kitap & Müzik", icon: "📚" },
  { slug: "kozmetik", label: "Kozmetik & Kişisel Bakım", icon: "💄" },
  { slug: "otomotiv", label: "Otomotiv", icon: "🚗" },
  { slug: "bebek-oyuncak", label: "Bebek & Oyuncak", icon: "🧸" },
];
