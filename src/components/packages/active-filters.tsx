import Link from "next/link";
import type { PackageFilters } from "@/lib/data/packages";
import { filtersToQuery, hasActiveFilters } from "@/lib/filters";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Removable chips for each active filter, so changing a search is one tap. */
export function ActiveFilters({ filters, durationLabel }: { filters: PackageFilters; durationLabel?: string }) {
  if (!hasActiveFilters(filters)) return null;
  const chips: { label: string; without: Partial<PackageFilters> }[] = [];
  if (filters.q) chips.push({ label: `“${filters.q}”`, without: { q: undefined } });
  if (filters.country) chips.push({ label: filters.country, without: { country: undefined } });
  if (filters.minPrice != null) chips.push({ label: `from ${rupees(filters.minPrice)}`, without: { minPrice: undefined } });
  if (filters.maxPrice != null) chips.push({ label: `up to ${rupees(filters.maxPrice)}`, without: { maxPrice: undefined } });
  if (filters.duration && durationLabel) chips.push({ label: durationLabel, without: { duration: undefined } });
  if (filters.guests) chips.push({ label: `${filters.guests}+ guests`, without: { guests: undefined } });

  return (
    <ul className="mt-6 flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.label}>
          <Link
            href={`/packages${filtersToQuery({ ...filters, ...c.without, page: 1 })}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-sky px-3 py-1.5 text-sm hover:border-sky-deep"
            aria-label={`Remove filter ${c.label}`}
          >
            {c.label} <span aria-hidden="true" className="text-ink-muted">✕</span>
          </Link>
        </li>
      ))}
      <li>
        <Link href="/packages" className="px-2 text-sm text-ink-soft underline-offset-4 hover:underline">Clear all</Link>
      </li>
    </ul>
  );
}
