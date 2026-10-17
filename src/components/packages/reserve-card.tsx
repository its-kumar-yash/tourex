"use client";

import { useActionState, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createBooking } from "@/lib/bookings/actions";
import { addDays, formatPrice, plural } from "@/lib/format";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";

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

type Auth = { signedIn: boolean; name: string; phone: string } | null;

export function ReserveCard(p: Props) {
  const [checkIn, setCheckIn] = useState(p.defaultCheckIn);
  const [guests, setGuests] = useState(Math.min(p.defaultGuests, p.maxGuests));
  const [auth, setAuth] = useState<Auth>(null);
  const [state, formAction, pending] = useActionState(createBooking, {});
  const checkOut = addDays(checkIn, p.durationDays);
  const total = p.priceMinor * guests;

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return active && setAuth({ signedIn: false, name: "", phone: "" });
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", data.user.id)
        .maybeSingle();
      if (active)
        setAuth({
          signedIn: true,
          name: profile?.full_name ?? (data.user.user_metadata?.full_name as string) ?? "",
          phone: profile?.phone ?? "",
        });
    });
    return () => {
      active = false;
    };
  }, []);

  const next = `/packages/${p.slug}?checkIn=${checkIn}&guests=${guests}`;

  return (
    <form
      action={formAction}
      className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)]"
    >
      <input type="hidden" name="slug" value={p.slug} />
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
            name="check_in"
            type="date"
            min={p.today}
            required
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
            name="guests"
            type="number"
            min={1}
            max={p.maxGuests}
            required
            value={guests}
            onChange={(e) => setGuests(Math.min(p.maxGuests, Math.max(1, Number(e.target.value) || 1)))}
          />
        </div>
      </div>

      {auth?.signedIn && (
        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <div>
            <Label htmlFor="r-name">Contact name</Label>
            <Input id="r-name" name="contact_name" required minLength={2} defaultValue={auth.name} autoComplete="name" />
          </div>
          <div>
            <Label htmlFor="r-phone">Phone</Label>
            <Input id="r-phone" name="contact_phone" type="tel" required defaultValue={auth.phone} autoComplete="tel" placeholder="+91 98765 43210" />
          </div>
          <div>
            <Label htmlFor="r-note">Note (optional)</Label>
            <Textarea id="r-note" name="note" maxLength={1000} className="min-h-20" placeholder="Dietary needs, pickup point, anything else" />
          </div>
        </div>
      )}

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

      {state.error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {auth?.signedIn ? (
        <Button type="submit" size="lg" className="mt-5 w-full" disabled={pending}>
          {pending ? "Sending request…" : "Request to reserve"}
        </Button>
      ) : (
        <ButtonLink href={`/login?next=${encodeURIComponent(next)}`} size="lg" className="mt-5 w-full">
          Sign in to reserve
        </ButtonLink>
      )}
      <p className="mt-3 text-center text-xs text-ink-muted">
        No payment now. We confirm availability and get back to you.
      </p>
    </form>
  );
}
