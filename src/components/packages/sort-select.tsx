"use client";

import { useRouter } from "next/navigation";
import { SORT_KEYS, type PackageFilters, type SortKey } from "@/lib/data/packages";
import { filtersToQuery } from "@/lib/filters";
import { Select } from "@/components/ui/field";
import { startNavigationProgress } from "@/components/layout/navigation-progress";

const labels: Record<SortKey, string> = {
  recommended: "Recommended",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  rating: "Top rated",
  newest: "Newest",
};

export function SortSelect({ filters }: { filters: PackageFilters }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft">
      <span className="hidden sm:inline">Sort</span>
      <Select
        aria-label="Sort packages"
        className="h-10 w-auto min-w-44"
        value={filters.sort ?? "recommended"}
        onChange={(e) => {
          startNavigationProgress();
          router.push(
            `/packages${filtersToQuery(filters, { sort: e.target.value as SortKey, page: 1 })}`,
          );
        }}
      >
        {SORT_KEYS.map((k) => (
          <option key={k} value={k}>
            {labels[k]}
          </option>
        ))}
      </Select>
    </label>
  );
}
