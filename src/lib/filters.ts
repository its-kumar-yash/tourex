import {
  DURATIONS,
  SORT_KEYS,
  type DurationKey,
  type PackageFilters,
  type SortKey,
} from "@/lib/data/packages";

export type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const num = (v: string | undefined) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

/** Parse URL search params into validated filters. Unknown values are dropped. */
export function parseFilters(params: SearchParams): PackageFilters {
  const sort = first(params.sort);
  const duration = first(params.duration);
  const page = num(first(params.page));
  return {
    q: first(params.q)?.trim().slice(0, 80) || undefined,
    country: first(params.country)?.trim() || undefined,
    minPrice: num(first(params.minPrice)),
    maxPrice: num(first(params.maxPrice)),
    duration: duration && duration in DURATIONS ? (duration as DurationKey) : undefined,
    guests: num(first(params.guests)),
    sort: sort && (SORT_KEYS as readonly string[]).includes(sort) ? (sort as SortKey) : undefined,
    page: page && page >= 1 ? Math.floor(page) : 1,
  };
}

/** Build a /packages query string from filters, omitting defaults. */
export function filtersToQuery(f: PackageFilters, overrides: Partial<PackageFilters> = {}) {
  const merged = { ...f, ...overrides };
  const qs = new URLSearchParams();
  if (merged.q) qs.set("q", merged.q);
  if (merged.country) qs.set("country", merged.country);
  if (merged.minPrice != null) qs.set("minPrice", String(merged.minPrice));
  if (merged.maxPrice != null) qs.set("maxPrice", String(merged.maxPrice));
  if (merged.duration) qs.set("duration", merged.duration);
  if (merged.guests) qs.set("guests", String(merged.guests));
  if (merged.sort && merged.sort !== "recommended") qs.set("sort", merged.sort);
  if (merged.page && merged.page > 1) qs.set("page", String(merged.page));
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function hasActiveFilters(f: PackageFilters) {
  return Boolean(
    f.q || f.country || f.minPrice != null || f.maxPrice != null || f.duration || f.guests,
  );
}
