"use client";

import { useState } from "react";
import { addDays, formatPrice, plural } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

type Props = {
  slug: string;
  priceMinor: number;
  currency: string;
  durationDays: number;
  maxGuests: number;
  today: string; // ISO, from the server
  defaultCheckIn: string;
  defaultGuests: number;
};

/**
 * Phase 2: collects dates and guests and sends the visitor to sign in.
 * Phase 3 turns this into the booking request itself.
 */
export function ReserveCard(p: Props) {
  const [checkIn, setCheckIn] = useState(p.defaultCheckIn);
  const [guests, setGuests] = useState(Math.min(p.defaultGuests, p.maxGuests));
  const checkOut = addDays(checkIn, p.durationDays);
  const total = p.priceMinor * guests;

  const next = `/packages/${p.slug}?checkIn=${checkIn}&guests=${guests}`;

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)]">
      <p className="text-sm text-ink-soft">From</p>
      <p className="text-3xl font-semibold">
        {formatPrice(p.priceMinor, p.currency)}
        <span className="text-base font-normal text-ink-soft"> / person</span>
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label htmlFor="r-checkin">Check in</Label>
          <Input
            id="r-checkin"
            type="date"
            min={p.today}
            value={checkIn}
            onChange={(e) => e.target.value && setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="r-checkout">Check out</Label>
          <Input id="r-checkout" type="date" value={checkOut} readOnly className="bg-cloud" />
        </div>
        <div>
          <Label htmlFor="r-guests">Guests</Label>
          <Input
            id="r-guests"
            type="number"
            min={1}
            max={p.maxGuests}
            value={guests}
            onChange={(e) =>
              setGuests(Math.min(p.maxGuests, Math.max(1, Number(e.target.value) || 1)))
            }
          />
        </div>
      </div>

      <dl className="mt-5 space-y-1 text-sm">
        <div className="flex justify-between text-ink-soft">
          <dt>
            {formatPrice(p.priceMinor, p.currency)} × {plural(guests, "guest")}
          </dt>
          <dd>{formatPrice(total, p.currency)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total, p.currency)}</dd>
        </div>
      </dl>

      <ButtonLink href={`/login?next=${encodeURIComponent(next)}`} size="lg" className="mt-5 w-full">
        Sign in to reserve
      </ButtonLink>
      <p className="mt-3 text-center text-xs text-ink-muted">
        No payment now. We confirm availability and get back to you.
      </p>
    </div>
  );
}
