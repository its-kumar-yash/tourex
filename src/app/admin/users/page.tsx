import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/user";
import { setUserRole } from "@/lib/admin/actions";
import { formatDate } from "@/lib/format";
import { PageHeader, smallButton, table } from "@/components/admin/ui";

export default async function AdminUsers() {
  const [me, supabase] = await Promise.all([getCurrentUser(), createClient()]);
  const [{ data: profiles }, { data: bookings }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, phone, role, created_at").order("created_at", { ascending: false }).limit(500),
    supabase.from("bookings").select("user_id, status"),
  ]);
  const counts = (bookings ?? []).reduce<Record<string, { total: number; confirmed: number }>>((acc, b) => {
    const c = (acc[b.user_id] ??= { total: 0, confirmed: 0 });
    c.total += 1;
    if (b.status === "confirmed") c.confirmed += 1;
    return acc;
  }, {});
  const rows = profiles ?? [];

  return (
    <>
      <PageHeader title="Users" description={`${rows.length} accounts · ${rows.filter((r) => r.role === "admin").length} admins`} />
      <div className={table.wrap}>
        <table className={table.table}>
          <thead>
            <tr>
              <th className={table.th}>Name</th>
              <th className={table.th}>Phone</th>
              <th className={table.th}>Joined</th>
              <th className={table.th}>Bookings</th>
              <th className={table.th}>Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td className={table.td}>{u.full_name ?? <span className="text-ink-muted">no name</span>}</td>
                <td className={table.td}>{u.phone ?? "—"}</td>
                <td className={table.td}>{formatDate(u.created_at.slice(0, 10))}</td>
                <td className={table.td}>
                  {counts[u.id]?.total ?? 0}
                  {counts[u.id]?.confirmed ? <span className="text-ink-muted"> · {counts[u.id].confirmed} confirmed</span> : null}
                </td>
                <td className={table.td}>
                  {u.id === me?.id ? (
                    <span className="text-xs text-ink-soft">admin (you)</span>
                  ) : (
                    <form action={setUserRole}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="role" value={u.role === "admin" ? "user" : "admin"} />
                      <button type="submit" className={smallButton}>
                        {u.role === "admin" ? "Admin · demote" : "User · make admin"}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink-muted">Emails are kept in Supabase Auth and are not shown here.</p>
    </>
  );
}
