import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Turn a title into a URL-safe slug, e.g. "My Cool Project!" -> "my-cool-project" */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(
  date: string | null | undefined,
  options: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" }
): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", options);
}

export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  current: boolean
): string {
  const startLabel = formatDate(start);
  if (current) return `${startLabel} — Present`;
  const endLabel = formatDate(end);
  return endLabel ? `${startLabel} — ${endLabel}` : startLabel;
}

/** Small helper for building absolute URLs (metadata, sitemap, OG tags). */
export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
