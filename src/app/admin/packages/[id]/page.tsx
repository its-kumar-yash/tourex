import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deletePackage } from "@/lib/admin/actions";
import type { SearchParams } from "@/lib/filters";
import type { PackageDetail } from "@/lib/data/packages";
import { Notice, PageHeader, smallButton } from "@/components/admin/ui";
import { PackageForm } from "@/components/admin/package-form";
import { ImageManager } from "@/components/admin/image-manager";
import { ItineraryEditor } from "@/components/admin/itinerary-editor";

export default async function EditPackagePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("*, package_images(*), package_itinerary(*)")
    .eq("id", id)
    .order("sort_order", { referencedTable: "package_images" })
    .order("day_no", { referencedTable: "package_itinerary" })
    .maybeSingle();
  const pkg = data as PackageDetail | null;
  if (!pkg) notFound();

  return (
    <>
      <PageHeader title={pkg.title} description={`/${pkg.slug} · ${pkg.is_published ? "published" : "draft"}`} />
      <div className="mt-2 flex gap-4 text-sm">
        <Link href="/admin/packages" className="text-ink-soft hover:underline">← All packages</Link>
        {pkg.is_published && (
          <Link href={`/packages/${pkg.slug}`} target="_blank" className="text-ink-soft hover:underline">View on site</Link>
        )}
      </div>
      {sp.created && <div className="mt-4"><Notice>Package created. Now add photos and the itinerary.</Notice></div>}
      {typeof sp.error === "string" && <div className="mt-4"><Notice tone="error">{sp.error}</Notice></div>}

      <div className="mt-8 grid gap-10 xl:grid-cols-[1fr_1fr]">
        <section>
          <h2 className="text-lg font-medium">Details</h2>
          <div className="mt-4"><PackageForm pkg={pkg} /></div>
        </section>
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-medium">Photos</h2>
            <div className="mt-4">
              <ImageManager packageId={pkg.id} images={pkg.package_images} coverUrl={pkg.cover_image_url} />
            </div>
          </section>
          <section>
            <h2 className="text-lg font-medium">Itinerary</h2>
            <div className="mt-4"><ItineraryEditor packageId={pkg.id} days={pkg.package_itinerary} /></div>
          </section>
          <section className="rounded-[var(--radius-card)] border border-red-200 p-4">
            <h2 className="text-sm font-medium text-red-700">Danger zone</h2>
            <p className="mt-1 text-sm text-ink-soft">Deleting removes the package, its photos and itinerary. Packages with bookings cannot be deleted; unpublish them instead.</p>
            <form action={deletePackage} className="mt-3">
              <input type="hidden" name="id" value={pkg.id} />
              <button type="submit" className={`${smallButton} border-red-200 text-red-700`}>Delete package</button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
