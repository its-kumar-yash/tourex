import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { setPackageFlag } from "@/lib/admin/actions";
import type { SearchParams } from "@/lib/filters";
import { Notice, PageHeader, smallButton, table } from "@/components/admin/ui";

export default async function AdminPackages({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("id, slug, title, country, price_minor, currency, duration_days, is_published, is_featured, updated_at")
    .order("updated_at", { ascending: false });
  const rows = data ?? [];

  return (
    <>
      <PageHeader
        title="Packages"
        description={`${rows.length} total · ${rows.filter((r) => r.is_published).length} published`}
        action={{ href: "/admin/packages/new", label: "New package" }}
      />
      {sp.deleted && <div className="mt-4"><Notice>Package deleted.</Notice></div>}
      <div className={table.wrap}>
        <table className={table.table}>
          <thead>
            <tr>
              <th className={table.th}>Title</th>
              <th className={table.th}>Country</th>
              <th className={table.th}>Price</th>
              <th className={table.th}>Days</th>
              <th className={table.th}>Status</th>
              <th className={table.th}>Featured</th>
              <th className={table.th}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td className={table.td}>
                  <Link href={`/admin/packages/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
                  <p className="text-xs text-ink-muted">/{p.slug}</p>
                </td>
                <td className={table.td}>{p.country}</td>
                <td className={table.td}>{formatPrice(p.price_minor, p.currency)}</td>
                <td className={table.td}>{p.duration_days}</td>
                <td className={table.td}>
                  <form action={setPackageFlag}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value="is_published" />
                    <input type="hidden" name="value" value={String(!p.is_published)} />
                    <button type="submit" className={smallButton}>
                      {p.is_published ? "Published · unpublish" : "Draft · publish"}
                    </button>
                  </form>
                </td>
                <td className={table.td}>
                  <form action={setPackageFlag}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value="is_featured" />
                    <input type="hidden" name="value" value={String(!p.is_featured)} />
                    <button type="submit" className={smallButton}>{p.is_featured ? "Yes" : "No"}</button>
                  </form>
                </td>
                <td className={table.td}>
                  <Link href={`/packages/${p.slug}`} className="text-xs text-ink-soft hover:underline" target="_blank">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
