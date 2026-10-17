"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDays } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { CalendarIcon, FlightIcon, HotelIcon, PinIcon, PlaneIcon, UserIcon } from "@/components/ui/icons";

type Props = { countries: string[]; today: string; defaultCheckIn: string };

export function SearchCard({ countries, today, defaultCheckIn }: Props) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(addDays(defaultCheckIn, 3));

  return (
    <form
      className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)] sm:p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const qs = new URLSearchParams();
        const country = String(fd.get("country") || "");
        const guests = String(fd.get("guests") || "");
        if (country) qs.set("country", country);
        if (guests) qs.set("guests", guests);
        router.push(`/packages${qs.size ? `?${qs}` : ""}`);
      }}
    >
      <div role="tablist" aria-label="Search type" className="flex rounded-full bg-cloud p-1 text-sm">
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white py-2 font-medium shadow-sm"
        >
          <PlaneIcon className="h-4 w-4" /> Tour
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="false"
          disabled
          title="Coming soon"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-ink-muted"
        >
          <FlightIcon className="h-4 w-4" /> Flight
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="false"
          disabled
          title="Coming soon"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-ink-muted"
        >
          <HotelIcon className="h-4 w-4" /> Hotels
        </button>
      </div>

      <div className="mt-4">
        <Label htmlFor="s-country">Destination</Label>
        <div className="relative">
          <PinIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <Select id="s-country" name="country" className="pl-9" defaultValue="">
            <option value="">Anywhere</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="s-checkin">Check in</Label>
          <div className="relative">
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <Input
              id="s-checkin"
              name="checkIn"
              type="date"
              className="pl-9"
              min={today}
              value={checkIn}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return;
                setCheckIn(v);
                if (checkOut <= v) setCheckOut(addDays(v, 3));
              }}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="s-checkout">Check out</Label>
          <div className="relative">
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <Input
              id="s-checkout"
              name="checkOut"
              type="date"
              className="pl-9"
              min={addDays(checkIn, 1)}
              value={checkOut}
              onChange={(e) => e.target.value && setCheckOut(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Label htmlFor="s-guests">Guests</Label>
        <div className="relative">
          <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <Input
            id="s-guests"
            name="guests"
            type="number"
            min={1}
            max={20}
            defaultValue={2}
            className="pl-9"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-4 w-full">
        Find packages
      </Button>
    </form>
  );
}
