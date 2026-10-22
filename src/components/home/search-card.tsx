"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DURATIONS } from "@/lib/data/packages";
import { startNavigationProgress } from "@/components/layout/navigation-progress";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { ClockIcon, PinIcon, UserIcon } from "@/components/ui/icons";

const BUDGETS = [
  { value: "", label: "Any budget" },
  { value: "15000", label: "Under ₹15,000" },
  { value: "30000", label: "Under ₹30,000" },
  { value: "50000", label: "Under ₹50,000" },
  { value: "100000", label: "Under ₹1,00,000" },
];

/** Every field maps to a real filter on /packages; nothing here is decorative. */
export function SearchCard({ locations }: { locations: string[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <form
      className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const qs = new URLSearchParams();
        for (const key of ["q", "duration", "maxPrice", "guests"]) {
          const v = String(fd.get(key) ?? "").trim();
          if (v) qs.set(key, v);
        }
        setPending(true);
        startNavigationProgress();
        router.push(`/packages${qs.size ? `?${qs}` : ""}`);
      }}
    >
      <p className="font-display text-2xl text-maroon">Find your trip</p>
      <p className="mt-0.5 text-sm text-ink-soft">Search by place, length and budget.</p>

      <div className="mt-4">
        <Label htmlFor="s-q">Where to?</Label>
        <div className="relative">
          <PinIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <Input id="s-q" name="q" list="s-locations" placeholder="Kerala, Ladakh, Goa…" className="pl-9" autoComplete="off" />
          <datalist id="s-locations">
            {locations.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="s-duration">Duration</Label>
          <div className="relative">
            <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <Select id="s-duration" name="duration" defaultValue="" className="pl-9">
              <option value="">Any</option>
              {(Object.keys(DURATIONS) as (keyof typeof DURATIONS)[]).map((k) => (
                <option key={k} value={k}>{DURATIONS[k].label}</option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="s-guests">Guests</Label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <Input id="s-guests" name="guests" type="number" inputMode="numeric" min={1} max={20} defaultValue={2} className="pl-9" />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Label htmlFor="s-budget">Budget per person</Label>
        <Select id="s-budget" name="maxPrice" defaultValue="">
          {BUDGETS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </Select>
      </div>

      <Button type="submit" size="lg" className="mt-5 w-full" loading={pending}>
        {pending ? "Searching…" : "Search packages"}
      </Button>
    </form>
  );
}
