import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatModalityName(slug: string): string {
  return slug
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function formatPriceRange(range: string | null): string {
  switch (range) {
    case "budget":
      return "$";
    case "mid":
      return "$$";
    case "premium":
      return "$$$";
    default:
      return "$$";
  }
}

export function getPricingByTier(tier: "metro" | "mid" | "small"): {
  low: number;
  high: number;
} {
  switch (tier) {
    case "metro":
      return { low: 120, high: 250 };
    case "mid":
      return { low: 90, high: 180 };
    case "small":
      return { low: 70, high: 150 };
  }
}

export function generateStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "\u2605".repeat(full) + (half ? "\u00BD" : "") + "\u2606".repeat(empty);
}

export const DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN || "mobilemassage.com";
export const SITE_NAME = "MobileMassage";
export const SITE_URL = `https://${DOMAIN}`;
