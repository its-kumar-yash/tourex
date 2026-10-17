import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/user";
import { createClient } from "@/lib/supabase/server";
import { cancelBooking } from "@/lib/bookings/actions";
import { formatDate, formatPrice, plural } from "@/lib/format";
import type { SearchParams } from "@/lib/filters";
import type { BookingStatus } from "@/lib/supabase/types";
import { StatusBadge } from "@/components/account/status-badge";
import { ProfileForm } from "@/components/account/profile-form";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };
export const dynamic = "force-dynamic";

type BookingRow = {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_minor: number;
  currency: string;
  status: BookingStatus;
  admin_note: string | null;
  created_at: string;
  packages: { slug: string; title: string; location: string; country: string; cover_image_url: string | null } | null;
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [user, sp] = await Promise.all([getCurrentUser(), searchParams]);
  if (!user) redirect("/login?next=/account");

  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select(
      "id, check_in, check_out, guests, total_minor, currency, status, admin_note, created_at, packages(slug, title, location, country, cover_image_url)",
    )
    .order("created_at", { ascending: false });
  const bookings = (data ?? []) as unknown as BookingRow[];
  const justBooked = typeof sp.booked === "string";

  return (
    <div className="px-4 py-10 sm:px-8 sm:py-14">
      <h1 className="display text-4xl font-medium sm:text-5xl">
        Hi {user.profile?.full_name?.split(" ")[0] ?? "there"}
      </h1>

      {justBooked && (
        <p role="status" className="mt-6 rounded-[var(--radius-card)] bg-sky px-5 py-4">
          Booking request received. We will confirm availability and update the status here.
        </p>
      )}
      {sp.password === "updated" && (
        <p role="status" className="mt-6 rounded-[var(--radius-card)] bg-sky px-5 py-4">Password updated.</p>
      )}

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="text-xl font-medium">Your bookings</h2>
          {bookings.length === 0 ? (
            <div className="mt-4 rounded-[var(--radius-card)] bg-cloud p-8 text-center">
              <p className="text-ink-soft">No bookings yet.</p>
              <ButtonLink href="/packages" className="mt-4">Find a package</ButtonLink>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {bookings.map((b) => (
                <li key={b.id} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line p-4 sm:flex-row">
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-cloud sm:w-44">
                    {b.packages?.cover_image_url && (
                      <Image src={b.packages.cover_image_url} alt="" fill sizes="176px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium">
                        {b.packages ? (
                          <Link href={`/packages/${b.packages.slug}`} className="hover:underline">{b.packages.title}</Link>
                        ) : (
                          "Package"
                        )}
                      </h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">
                      {formatDate(b.check_in)} → {formatDate(b.check_out)} · {plural(b.guests, "guest")}
                    </p>
                    <p className="mt-1 text-sm">
                      Total <span className="font-semibold">{formatPrice(b.total_minor, b.currency)}</span>
                    </p>
                    {b.admin_note && b.status !== "pending" && (
                      <p className="mt-2 rounded-xl bg-cloud px-3 py-2 text-sm text-ink-soft">{b.admin_note}</p>
                    )}
                    {b.status === "pending" && (
                      <form action={cancelBooking} className="mt-3">
                        <input type="hidden" name="id" value={b.id} />
                        <button type="submit" className="text-sm text-ink-soft underline-offset-4 hover:underline">
                          Cancel request
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-xl font-medium">Profile</h2>
          <div className="mt-4 rounded-[var(--radius-card)] border border-line p-5">
            <ProfileForm
              email={user.email ?? ""}
              fullName={user.profile?.full_name ?? ""}
              phone={user.profile?.phone ?? ""}
            />
          </div>
          {user.profile?.role === "admin" && (
            <ButtonLink href="/admin" variant="soft" className="mt-4 w-full">Open admin dashboard</ButtonLink>
          )}
        </section>
      </div>
    </div>
  );
}
