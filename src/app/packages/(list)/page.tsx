import type { Metadata } from "next";
import Link from "next/link";
import { getCountries, listPackages } from "@/lib/data/packages";
import { hasActiveFilters, parseFilters, type SearchParams } from "@/lib/filters";
import { PackageCard } from "@/components/packages/package-card";
import { PackageFiltersForm } from "@/components/packages/filters";
import { SortSelect } from "@/components/packages/sort-select";
import { Pagination } from "@/components/packages/pagination";
import { ActiveFilters } from "@/components/packages/active-filters";
import { DURATIONS } from "@/lib/data/packages";

export const metadata: Metadata = {
  title: "Tour packages",
  description:
    "Browse all tour packages: beaches, mountains, heritage and island escapes across India, Indonesia and Japan.",
  alternates: { canonical: "/packages" },
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = parseFilters(await searchParams);
  const [result, countries] = await Promise.all([listPackages(filters), getCountries()]);

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-lg text-saffron-deep">यात्रा चुनें</p>
          <h1 className="display text-4xl sm:text-5xl">Tour packages</h1>
          <p className="mt-2 text-ink-soft">
            {result.total === 0
              ? "No packages match these filters."
              : `${result.total} ${result.total === 1 ? "package" : "packages"}${
                  hasActiveFilters(filters) ? " match your filters" : ""
                }`}
          </p>
        </div>
        <SortSelect filters={filters} />
      </div>

      <ActiveFilters filters={filters} durationLabel={filters.duration ? DURATIONS[filters.duration].label : undefined} />

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
        {/* Phones and tablets: collapsed so results come first. Desktop: always-open sidebar. */}
        <details className="group rounded-[var(--radius-card)] border border-line bg-white lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium">
            <span>Filters{hasActiveFilters(filters) ? " · active" : ""}</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>
          </summary>
          <div className="border-t border-line p-4">
            <PackageFiltersForm filters={filters} countries={countries} />
          </div>
        </details>
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-[var(--radius-card)] border border-line bg-white p-5">
            <p className="mb-4 font-semibold">Filters</p>
            <PackageFiltersForm filters={filters} countries={countries} />
          </div>
        </aside>

        <section aria-label="Results">
          {result.items.length === 0 ? (
            <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-cloud p-10 text-center">
              <p className="font-display text-2xl text-maroon">No trips found</p>
              <p className="mt-2 text-ink-soft">Try widening the price range or clearing the filters.</p>
              <Link href="/packages" className="mt-4 inline-block underline underline-offset-4">
                Show all packages
              </Link>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.map((pkg, i) => (
                <li key={pkg.id}>
                  <PackageCard pkg={pkg} priority={i < 3} />
                </li>
              ))}
            </ul>
          )}
          <Pagination filters={filters} page={result.page} pageCount={result.pageCount} />
        </section>
      </div>
    </div>
  );
}
