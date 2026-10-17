import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { istDaysAgo } from "@/lib/format";
import { Kpi, PageHeader, table } from "@/components/admin/ui";
import { VisitorsChart, type DayPoint } from "@/components/admin/visitors-chart";

const DAYS = 14;

export default async function AdminAnalytics() {
  const supabase = await createClient();
  const since = istDaysAgo(DAYS - 1);
  const [daily, devices, pages, packages, conversions] = await Promise.all([
    supabase.from("daily_visitors").select("*").gte("day", since).order("day"),
    supabase.from("device_split_7d").select("*"),
    supabase.from("top_pages_7d").select("*").limit(10),
    supabase.from("top_packages_7d").select("*").limit(10),
    supabase.from("analytics_events").select("event").gte("created_at", `${istDaysAgo(6)}T00:00:00Z`),
  ]);

  const byDay = new Map((daily.data ?? []).map((r) => [r.day, r]));
  const series: DayPoint[] = Array.from({ length: DAYS }, (_, i) => {
    const day = istDaysAgo(DAYS - 1 - i);
    const r = byDay.get(day);
    return { day, visitors: r?.visitors ?? 0, page_views: r?.page_views ?? 0, package_views: r?.package_views ?? 0 };
  });
  const last7 = series.slice(-7);
  const visitors7 = last7.reduce((s, d) => s + d.visitors, 0);
  const views7 = last7.reduce((s, d) => s + d.page_views, 0);
  const pkgViews7 = last7.reduce((s, d) => s + d.package_views, 0);
  const submitted7 = (conversions.data ?? []).filter((e) => e.event === "booking_submitted").length;
  const deviceRows = devices.data ?? [];
  const deviceTotal = deviceRows.reduce((s, d) => s + d.sessions, 0) || 1;

  return (
    <>
      <PageHeader
        title="Analytics"
        description={
          env.gaMeasurementId
            ? "First-party events below; Google Analytics 4 is also active for full traffic analysis."
            : "First-party events below. Set NEXT_PUBLIC_GA_MEASUREMENT_ID to enable Google Analytics 4 as well."
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Visitors, 7 days" value={visitors7.toLocaleString("en-IN")} hint="unique sessions" />
        <Kpi label="Page views, 7 days" value={views7.toLocaleString("en-IN")} />
        <Kpi label="Package views, 7 days" value={pkgViews7.toLocaleString("en-IN")} />
        <Kpi
          label="Booking requests, 7 days"
          value={submitted7}
          hint={pkgViews7 ? `${((submitted7 / pkgViews7) * 100).toFixed(1)}% of package views` : undefined}
        />
      </div>

      <section className="mt-10 rounded-[var(--radius-card)] border border-line p-5">
        <h2 className="text-lg font-medium">Unique visitors per day</h2>
        <p className="text-sm text-ink-soft">Last {DAYS} days, Asia/Kolkata.</p>
        <div className="mt-4">
          <VisitorsChart data={series} />
        </div>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-ink-soft">Table view</summary>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className={table.th}>Day</th>
                <th className={table.th}>Visitors</th>
                <th className={table.th}>Page views</th>
                <th className={table.th}>Package views</th>
              </tr>
            </thead>
            <tbody>
              {series.map((d) => (
                <tr key={d.day}>
                  <td className={table.td}>{d.day}</td>
                  <td className={table.td}>{d.visitors}</td>
                  <td className={table.td}>{d.page_views}</td>
                  <td className={table.td}>{d.package_views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="rounded-[var(--radius-card)] border border-line p-5">
          <h2 className="text-lg font-medium">Devices, 7 days</h2>
          <ul className="mt-4 space-y-3">
            {deviceRows.length === 0 && <li className="text-sm text-ink-soft">No sessions yet.</li>}
            {deviceRows
              .slice()
              .sort((a, b) => b.sessions - a.sessions)
              .map((d) => (
                <li key={d.device ?? "unknown"} className="text-sm">
                  <div className="flex justify-between">
                    <span className="capitalize">{d.device ?? "unknown"}</span>
                    <span className="text-ink-soft">
                      {d.sessions} · {Math.round((d.sessions / deviceTotal) * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-[#e8f0fa]">
                    <div className="h-2 rounded-full bg-[#2a78d6]" style={{ width: `${(d.sessions / deviceTotal) * 100}%` }} />
                  </div>
                </li>
              ))}
          </ul>
        </section>

        <section className="rounded-[var(--radius-card)] border border-line p-5">
          <h2 className="text-lg font-medium">Top pages, 7 days</h2>
          <ol className="mt-4 divide-y divide-line text-sm">
            {(pages.data ?? []).length === 0 && <li className="py-2 text-ink-soft">No page views yet.</li>}
            {(pages.data ?? []).map((p) => (
              <li key={p.path} className="flex justify-between gap-3 py-2">
                <span className="truncate">{p.path}</span>
                <span className="shrink-0 text-ink-soft">{p.views}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-[var(--radius-card)] border border-line p-5">
          <h2 className="text-lg font-medium">Top packages, 7 days</h2>
          <ol className="mt-4 divide-y divide-line text-sm">
            {(packages.data ?? []).length === 0 && <li className="py-2 text-ink-soft">No package views yet.</li>}
            {(packages.data ?? []).map((p) => (
              <li key={p.id} className="flex justify-between gap-3 py-2">
                <span className="truncate">{p.title}</span>
                <span className="shrink-0 text-ink-soft">{p.views}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
