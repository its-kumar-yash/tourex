import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/guard";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="grid min-h-[70vh] grid-cols-[minmax(0,1fr)] content-start lg:grid-cols-[220px_minmax(0,1fr)] lg:content-stretch">
      <aside className="border-b border-line bg-cloud px-4 py-4 lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
        <p className="text-xs uppercase tracking-wide text-ink-muted">Admin</p>
        <p className="mt-1 truncate text-sm font-medium">{user.profile?.full_name ?? user.email}</p>
        <AdminNav />
        <Link href="/" className="mt-6 hidden text-sm text-ink-soft hover:text-ink lg:block">
          ← Back to site
        </Link>
      </aside>
      <div className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">{children}</div>
    </div>
  );
}
