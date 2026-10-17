import Link from "next/link";
import { DURATIONS, type PackageFilters } from "@/lib/data/packages";
import { hasActiveFilters } from "@/lib/filters";
import { Input, Label, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

/**
 * Plain GET form: works without JavaScript and keeps the URL shareable.
 * The list page re-renders on the server with the parsed query.
 */
export function PackageFiltersForm({
  filters,
  countries,
}: {
  filters: PackageFilters;
  countries: string[];
}) {
  return (
    <form method="get" action="/packages" className="space-y-5">
      {filters.sort && filters.sort !== "recommended" && (
        <input type="hidden" name="sort" value={filters.sort} />
      )}

      <div>
        <Label htmlFor="f-q">Search</Label>
        <Input
          id="f-q"
          name="q"
          type="search"
          placeholder="Kerala, Fuji, beach…"
          defaultValue={filters.q ?? ""}
          maxLength={80}
        />
      </div>

      <div>
        <Label htmlFor="f-country">Country</Label>
        <Select id="f-country" name="country" defaultValue={filters.country ?? ""}>
          <option value="">Anywhere</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Price per person (₹)</legend>
        <div className="grid grid-cols-2 gap-2">
          <Input
            name="minPrice"
            type="number"
            min={0}
            step={500}
            placeholder="Min"
            aria-label="Minimum price"
            defaultValue={filters.minPrice ?? ""}
          />
          <Input
            name="maxPrice"
            type="number"
            min={0}
            step={500}
            placeholder="Max"
            aria-label="Maximum price"
            defaultValue={filters.maxPrice ?? ""}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Duration</legend>
        <div className="space-y-1.5 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name="duration" value="" defaultChecked={!filters.duration} />
            Any
          </label>
          {(Object.keys(DURATIONS) as (keyof typeof DURATIONS)[]).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="radio"
                name="duration"
                value={key}
                defaultChecked={filters.duration === key}
              />
              {DURATIONS[key].label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="f-guests">Guests</Label>
        <Input
          id="f-guests"
          name="guests"
          type="number"
          min={1}
          max={20}
          placeholder="Any"
          defaultValue={filters.guests ?? ""}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" className="flex-1">
          Apply filters
        </Button>
        {hasActiveFilters(filters) && (
          <Link href="/packages" className="text-sm text-ink-soft underline-offset-4 hover:underline">
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
