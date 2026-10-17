import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice, istDaysAgo } from "@/lib/format";
import { StatusBadge } from "@/components/account/status-badge";
import { Kpi, PageHeader, table } from "@/components/admin/ui";
import type { BookingStatus } from "@/lib/supabase/types";

export default async function AdminOverview() {
  const supabase = await createClient();
  const since7 = istDaysAgo(6);

  const [visitors, bookings, packages, topPackages, latest] = await Promise.all([
    supabase.from("daily_visitors").select("*").gte("day", since7).order("day", { ascending: false }),
    supabase.from("bookings").select("status"),
    supabase.from("packages").select("is_published"),
    supabase.from("top_packages_7d").select("*").limit(5),
    supabase
      .from("bookings")
      .select("id, check_in, guests, total_minor, currency, status, contact_name, created_at, packages(title)")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const today = istDaysAgo(0);
  const vRows = visitors.data ?? [];
  const todayVisitors = vRows.find((r) => r.day === today)?.visitors ?? 0;
  const weekVisitors = vRows.reduce((s, r) => s + r.visitors, 0);
  const byStatus = (bookings.data ?? []).reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {});
  const published = (packages.data ?? []).filter((p) => p.is_published).length;

  type Latest = {
    id: string; check_in: string; guests: number; total_minor: number; currency: string;
    status: BookingStatus; contact_name: string; created_at: string; packages: { title: string } | null;
  };
  const latestRows = (latest.data ?? []) as unknown as Latest[];

  return (
    <>
      <PageHeader title="Overview" description="Last 7 days at a glance." />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Visitors today" value={todayVisitors} hint="unique sessions" />
        <Kpi label="Visitors, 7 days" value={weekVisitors} />
        <Kpi label="Pending bookings" value={byStatus.pending ?? 0} hint={`${byStatus.confirmed ?? 0} confirmed · ${byStatus.rejected ?? 0} rejected`} />
        <Kpi label="Published packages" value={published} hint={`${(packages.data ?? []).length - published} drafts`} />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_320px]">
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-medium">Latest booking requests</h2>
            <Link href="/admin/bookings" className="text-sm text-ink-soft hover:underline">All bookings</Link>
          </div>
          <div className={table.wrap}>
            <table className={table.table}>
              <thead>
                <tr>
                  <th className={table.th}>Package</th>
                  <th className={table.th}>Guest</th>
                  <th className={table.th}>Check in</th>
                  <th className={table.th}>Total</th>
                  <th className={table.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {latestRows.length === 0 && (
                  <tr><td className={table.td} colSpan={5}>No bookings yet.</td></tr>
                )}
                {latestRows.map((b) => (
                  <tr key={b.id}>
                    <td className={table.td}>{b.packages?.title ?? "—"}</td>
                    <td className={table.td}>{b.contact_name} · {b.guests}</td>
                    <td className={table.td}>{formatDate(b.check_in)}</td>
                    <td className={table.td}>{formatPrice(b.total_minor, b.currency)}</td>
                    <td className={table.td}><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium">Most viewed, 7 days</h2>
          <ol className="mt-4 divide-y divide-line rounded-[var(--radius-card)] border border-line">
            {(topPackages.data ?? []).length === 0 && (
              <li className="px-4 py-3 text-sm text-ink-soft">No package views recorded yet.</li>
            )}
            {(topPackages.data ?? []).map((p, i) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="truncate"><span className="mr-2 text-ink-muted">{i + 1}.</span>{p.title}</span>
                <span className="shrink-0 text-ink-soft">{p.views}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
