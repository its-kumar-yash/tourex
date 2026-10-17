import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateBookingStatus } from "@/lib/admin/actions";
import { formatDate, formatPrice, plural } from "@/lib/format";
import type { SearchParams } from "@/lib/filters";
import type { BookingStatus } from "@/lib/supabase/types";
import { StatusBadge } from "@/components/account/status-badge";
import { PageHeader, smallButton, table } from "@/components/admin/ui";

const STATUSES: BookingStatus[] = ["pending", "confirmed", "rejected", "cancelled"];

type Row = {
  id: string; check_in: string; check_out: string; guests: number; total_minor: number; currency: string;
  status: BookingStatus; contact_name: string; contact_phone: string; note: string | null; admin_note: string | null;
  created_at: string; packages: { title: string; slug: string } | null; profiles: { full_name: string | null } | null;
};

export default async function AdminBookings({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const filter = STATUSES.includes(sp.status as BookingStatus) ? (sp.status as BookingStatus) : "pending";
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("id, check_in, check_out, guests, total_minor, currency, status, contact_name, contact_phone, note, admin_note, created_at, packages(title, slug), profiles(full_name)")
    .eq("status", filter)
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as unknown as Row[];

  return (
    <>
      <PageHeader title="Bookings" description="Confirm or reject requests. The guest sees the status and your note on their account page." />
      <nav className="mt-6 flex gap-1 text-sm">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/bookings?status=${s}`}
            className={`rounded-full px-3 py-1.5 capitalize ${s === filter ? "bg-ink text-white" : "text-ink-soft hover:bg-cloud"}`}
          >
            {s}
          </Link>
        ))}
      </nav>

      <div className={table.wrap}>
        <table className={table.table}>
          <thead>
            <tr>
              <th className={table.th}>Package</th>
              <th className={table.th}>Guest</th>
              <th className={table.th}>Dates</th>
              <th className={table.th}>Total</th>
              <th className={table.th}>Status</th>
              <th className={table.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td className={table.td} colSpan={6}>No {filter} bookings.</td></tr>}
            {rows.map((b) => (
              <tr key={b.id}>
                <td className={table.td}>
                  {b.packages ? <Link href={`/packages/${b.packages.slug}`} className="hover:underline">{b.packages.title}</Link> : "—"}
                  <p className="text-xs text-ink-muted">requested {formatDate(b.created_at.slice(0, 10))}</p>
                </td>
                <td className={table.td}>
                  <p>{b.contact_name}</p>
                  <a href={`tel:${b.contact_phone.replace(/\s/g, "")}`} className="text-xs text-ink-soft hover:underline">{b.contact_phone}</a>
                  {b.note && <p className="mt-1 max-w-xs text-xs text-ink-soft">“{b.note}”</p>}
                </td>
                <td className={table.td}>
                  {formatDate(b.check_in)} → {formatDate(b.check_out)}
                  <p className="text-xs text-ink-muted">{plural(b.guests, "guest")}</p>
                </td>
                <td className={table.td}>{formatPrice(b.total_minor, b.currency)}</td>
                <td className={table.td}><StatusBadge status={b.status} /></td>
                <td className={table.td}>
                  <form action={updateBookingStatus} className="flex min-w-56 flex-col gap-2">
                    <input type="hidden" name="id" value={b.id} />
                    <input
                      name="admin_note"
                      defaultValue={b.admin_note ?? ""}
                      placeholder="Note to guest (optional)"
                      className="h-8 rounded-lg border border-line px-2 text-xs"
                    />
                    <div className="flex gap-1">
                      {b.status !== "confirmed" && (
                        <button type="submit" name="status" value="confirmed" className={`${smallButton} border-emerald-200 text-emerald-800`}>Confirm</button>
                      )}
                      {b.status !== "rejected" && (
                        <button type="submit" name="status" value="rejected" className={`${smallButton} border-red-200 text-red-700`}>Reject</button>
                      )}
                      {b.status !== "pending" && (
                        <button type="submit" name="status" value="pending" className={smallButton}>Reopen</button>
                      )}
                    </div>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
