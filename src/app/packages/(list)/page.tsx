import type { Metadata } from "next";
import Link from "next/link";
import { getCountries, listPackages } from "@/lib/data/packages";
import { hasActiveFilters, parseFilters, type SearchParams } from "@/lib/filters";
import { PackageCard } from "@/components/packages/package-card";
import { PackageFiltersForm } from "@/components/packages/filters";
import { SortSelect } from "@/components/packages/sort-select";
import { Pagination } from "@/components/packages/pagination";

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
          <h1 className="display text-4xl font-medium sm:text-5xl">Tour packages</h1>
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

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <details className="rounded-[var(--radius-card)] border border-line p-4 lg:[&>summary]:pointer-events-none" open>
            <summary className="cursor-pointer list-none text-sm font-medium">Filters</summary>
            <div className="mt-4">
              <PackageFiltersForm filters={filters} countries={countries} />
            </div>
          </details>
        </aside>

        <section aria-label="Results">
          {result.items.length === 0 ? (
            <div className="rounded-[var(--radius-card)] bg-cloud p-10 text-center">
              <p className="text-lg font-medium">Nothing here yet</p>
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
