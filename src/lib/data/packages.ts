import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/lib/supabase/types";

export const PAGE_SIZE = 12;

const CARD_COLUMNS =
  "id, slug, title, summary, location, country, price_minor, currency, duration_days, max_guests, rating, cover_image_url, is_featured";

export type PackageCard = Pick<
  Tables<"packages">,
  | "id"
  | "slug"
  | "title"
  | "summary"
  | "location"
  | "country"
  | "price_minor"
  | "currency"
  | "duration_days"
  | "max_guests"
  | "rating"
  | "cover_image_url"
  | "is_featured"
>;

export type PackageDetail = Tables<"packages"> & {
  package_images: Tables<"package_images">[];
  package_itinerary: Tables<"package_itinerary">[];
};

export const SORT_KEYS = ["recommended", "price_asc", "price_desc", "rating", "newest"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const DURATIONS = {
  short: { label: "1–3 days", min: 1, max: 3 },
  medium: { label: "4–6 days", min: 4, max: 6 },
  long: { label: "7+ days", min: 7, max: 365 },
} as const;
export type DurationKey = keyof typeof DURATIONS;

export type PackageFilters = {
  q?: string;
  country?: string;
  minPrice?: number; // whole rupees
  maxPrice?: number;
  duration?: DurationKey;
  guests?: number;
  sort?: SortKey;
  page?: number;
};

export async function listPackages(filters: PackageFilters) {
  const sb = createPublicClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = sb
    .from("packages")
    .select(CARD_COLUMNS, { count: "exact" })
    .eq("is_published", true);

  if (filters.q) {
    query = query.textSearch("search", filters.q, { type: "websearch", config: "simple" });
  }
  if (filters.country) query = query.eq("country", filters.country);
  if (filters.minPrice != null) query = query.gte("price_minor", filters.minPrice * 100);
  if (filters.maxPrice != null) query = query.lte("price_minor", filters.maxPrice * 100);
  if (filters.duration && DURATIONS[filters.duration]) {
    const { min, max } = DURATIONS[filters.duration];
    query = query.gte("duration_days", min).lte("duration_days", max);
  }
  if (filters.guests) query = query.gte("max_guests", filters.guests);

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price_minor", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_minor", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("rating", { ascending: false });
  }
  query = query.order("id").range(from, from + PAGE_SIZE - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(`listPackages: ${error.message}`);

  const total = count ?? 0;
  return {
    items: (data ?? []) as PackageCard[],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getHomePackages(limit = 5) {
  const sb = createPublicClient();
  const { data, error } = await sb
    .from("packages")
    .select(CARD_COLUMNS)
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`getHomePackages: ${error.message}`);
  return (data ?? []) as PackageCard[];
}

export async function getCountries() {
  const sb = createPublicClient();
  const { data, error } = await sb
    .from("packages")
    .select("country")
    .eq("is_published", true)
    .order("country");
  if (error) throw new Error(`getCountries: ${error.message}`);
  return [...new Set((data ?? []).map((r) => r.country))];
}

/** Memoised per request: generateMetadata and the page share one query. */
export const getPackageBySlug = cache(async (slug: string) => {
  const sb = createPublicClient();
  const { data, error } = await sb
    .from("packages")
    .select("*, package_images(*), package_itinerary(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .order("sort_order", { referencedTable: "package_images", ascending: true })
    .order("day_no", { referencedTable: "package_itinerary", ascending: true })
    .maybeSingle();
  if (error) throw new Error(`getPackageBySlug: ${error.message}`);
  return (data as PackageDetail | null) ?? null;
});

export async function getAllPackageSlugs() {
  const sb = createPublicClient();
  const { data, error } = await sb
    .from("packages")
    .select("slug, updated_at")
    .eq("is_published", true);
  if (error) throw new Error(`getAllPackageSlugs: ${error.message}`);
  return data ?? [];
}
