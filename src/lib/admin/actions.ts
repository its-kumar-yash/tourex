"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guard";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { BookingStatus, TablesInsert, UserRole } from "@/lib/supabase/types";

export type ActionState = { error?: string; message?: string };

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => Number(String(fd.get(k) ?? "").replace(/,/g, ""));

function revalidatePackage(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/packages/${slug}`);
  revalidatePath("/admin/packages");
}

/** Create or update a package. `id` empty means create. */
export async function savePackage(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin("/admin/packages");
  const id = str(fd, "id");
  const title = str(fd, "title");
  const slug = slugify(str(fd, "slug") || title);
  const price = num(fd, "price");
  const duration = num(fd, "duration_days");
  const maxGuests = num(fd, "max_guests");
  const rating = num(fd, "rating");

  if (title.length < 3) return { error: "Title must be at least 3 characters." };
  if (!slug) return { error: "Could not make a URL slug from that title." };
  if (!str(fd, "location") || !str(fd, "country")) return { error: "Location and country are required." };
  if (!Number.isFinite(price) || price < 0) return { error: "Price must be 0 or more." };
  if (!Number.isInteger(duration) || duration < 1) return { error: "Duration must be at least 1 day." };
  if (!Number.isInteger(maxGuests) || maxGuests < 1) return { error: "Max guests must be at least 1." };
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) return { error: "Rating must be between 0 and 5." };

  const row: TablesInsert<"packages"> = {
    title,
    slug,
    summary: str(fd, "summary"),
    description: str(fd, "description"),
    location: str(fd, "location"),
    country: str(fd, "country"),
    price_minor: Math.round(price * 100),
    currency: "INR",
    duration_days: duration,
    max_guests: maxGuests,
    rating: Math.round(rating * 10) / 10,
    cover_image_url: str(fd, "cover_image_url") || null,
    is_featured: fd.get("is_featured") === "on",
    is_published: fd.get("is_published") === "on",
  };

  const supabase = await createClient();
  let previousSlug: string | null = null;
  let savedId = id;

  if (id) {
    const { data: before } = await supabase.from("packages").select("slug").eq("id", id).maybeSingle();
    previousSlug = before?.slug ?? null;
    const { error } = await supabase.from("packages").update(row).eq("id", id);
    if (error) return { error: friendly(error.message) };
  } else {
    const { data, error } = await supabase.from("packages").insert(row).select("id").single();
    if (error || !data) return { error: friendly(error?.message ?? "insert failed") };
    savedId = data.id;
  }

  revalidatePackage(slug);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/packages/${previousSlug}`);
  if (!id) redirect(`/admin/packages/${savedId}?created=1`);
  return { message: "Saved." };
}

function friendly(msg: string) {
  if (msg.includes("packages_slug_key")) return "That slug is already used by another package.";
  return `Could not save: ${msg}`;
}

export async function setPackageFlag(fd: FormData) {
  await requireAdmin("/admin/packages");
  const id = str(fd, "id");
  const field = str(fd, "field");
  const value = str(fd, "value") === "true";
  if (!id || !["is_published", "is_featured"].includes(field)) return;
  const supabase = await createClient();
  const patch = field === "is_published" ? { is_published: value } : { is_featured: value };
  const { data } = await supabase
    .from("packages")
    .update(patch)
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  revalidatePackage(data?.slug);
  revalidatePath(`/admin/packages/${id}`);
}

export async function deletePackage(fd: FormData) {
  await requireAdmin("/admin/packages");
  const id = str(fd, "id");
  if (!id) return;
  const supabase = await createClient();
  const { data: pkg } = await supabase.from("packages").select("slug").eq("id", id).maybeSingle();
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) redirect(`/admin/packages/${id}?error=${encodeURIComponent("Cannot delete: this package has bookings. Unpublish it instead.")}`);
  revalidatePackage(pkg?.slug);
  redirect("/admin/packages?deleted=1");
}

export async function addPackageImage(fd: FormData) {
  await requireAdmin("/admin/packages");
  const packageId = str(fd, "package_id");
  const url = str(fd, "url");
  const alt = str(fd, "alt");
  if (!packageId || !/^https:\/\//.test(url)) return;
  const supabase = await createClient();
  const { data: last } = await supabase
    .from("package_images")
    .select("sort_order")
    .eq("package_id", packageId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  await supabase.from("package_images").insert({
    package_id: packageId,
    url,
    alt,
    sort_order: (last?.sort_order ?? -1) + 1,
  });
  // First image becomes the cover if there is none.
  const { data: pkg } = await supabase.from("packages").select("slug, cover_image_url").eq("id", packageId).maybeSingle();
  if (pkg && !pkg.cover_image_url) {
    await supabase.from("packages").update({ cover_image_url: url }).eq("id", packageId);
  }
  revalidatePackage(pkg?.slug);
  revalidatePath(`/admin/packages/${packageId}`);
}

export async function removePackageImage(fd: FormData) {
  await requireAdmin("/admin/packages");
  const id = str(fd, "id");
  const packageId = str(fd, "package_id");
  if (!id) return;
  const supabase = await createClient();
  const { data: img } = await supabase.from("package_images").select("url").eq("id", id).maybeSingle();
  await supabase.from("package_images").delete().eq("id", id);
  // Remove the file too when it lives in our bucket.
  const marker = "/storage/v1/object/public/package-images/";
  const idx = img?.url.indexOf(marker) ?? -1;
  if (img && idx >= 0) {
    await supabase.storage.from("package-images").remove([decodeURIComponent(img.url.slice(idx + marker.length))]);
  }
  const { data: pkg } = await supabase.from("packages").select("slug").eq("id", packageId).maybeSingle();
  revalidatePackage(pkg?.slug);
  revalidatePath(`/admin/packages/${packageId}`);
}

export async function setCoverImage(fd: FormData) {
  await requireAdmin("/admin/packages");
  const packageId = str(fd, "package_id");
  const url = str(fd, "url");
  if (!packageId || !url) return;
  const supabase = await createClient();
  const { data: pkg } = await supabase
    .from("packages")
    .update({ cover_image_url: url })
    .eq("id", packageId)
    .select("slug")
    .maybeSingle();
  revalidatePackage(pkg?.slug);
  revalidatePath(`/admin/packages/${packageId}`);
}

export async function saveItinerary(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin("/admin/packages");
  const packageId = str(fd, "package_id");
  let days: { title: string; description: string }[];
  try {
    days = JSON.parse(str(fd, "days"));
  } catch {
    return { error: "Invalid itinerary data." };
  }
  const clean = days
    .map((d) => ({ title: String(d.title ?? "").trim(), description: String(d.description ?? "").trim() }))
    .filter((d) => d.title);
  if (clean.length > 60) return { error: "That is too many days." };

  const supabase = await createClient();
  const { error: delError } = await supabase.from("package_itinerary").delete().eq("package_id", packageId);
  if (delError) return { error: delError.message };
  if (clean.length) {
    const { error } = await supabase
      .from("package_itinerary")
      .insert(clean.map((d, i) => ({ package_id: packageId, day_no: i + 1, ...d })));
    if (error) return { error: error.message };
  }
  const { data: pkg } = await supabase.from("packages").select("slug").eq("id", packageId).maybeSingle();
  revalidatePackage(pkg?.slug);
  revalidatePath(`/admin/packages/${packageId}`);
  return { message: `Itinerary saved (${clean.length} days).` };
}

export async function updateBookingStatus(fd: FormData) {
  await requireAdmin("/admin/bookings");
  const id = str(fd, "id");
  const status = str(fd, "status") as BookingStatus;
  const adminNote = str(fd, "admin_note").slice(0, 1000);
  if (!id || !["pending", "confirmed", "rejected", "cancelled"].includes(status)) return;
  const supabase = await createClient();
  await supabase.from("bookings").update({ status, admin_note: adminNote || null }).eq("id", id);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  revalidatePath("/account");
}

export async function setUserRole(fd: FormData) {
  const me = await requireAdmin("/admin/users");
  const id = str(fd, "id");
  const role = str(fd, "role") as UserRole;
  if (!id || !["user", "admin"].includes(role)) return;
  if (id === me.id) return; // never demote yourself by accident
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/users");
}
