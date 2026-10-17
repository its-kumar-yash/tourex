"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { addDays, toISODate } from "@/lib/format";

export type BookingState = { error?: string };

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export async function createBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const slug = String(formData.get("slug") ?? "");
  const checkIn = String(formData.get("check_in") ?? "");
  const guests = Number(formData.get("guests"));
  const contactName = String(formData.get("contact_name") ?? "").trim();
  const contactPhone = String(formData.get("contact_phone") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim().slice(0, 1000);

  if (!ISO.test(checkIn) || checkIn < toISODate(new Date())) return { error: "Pick a check-in date from today onwards." };
  if (!Number.isInteger(guests) || guests < 1) return { error: "Guests must be at least 1." };
  if (contactName.length < 2) return { error: "Please enter a contact name." };
  if (!/^[+\d][\d\s-]{6,19}$/.test(contactPhone)) return { error: "Please enter a valid phone number." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/packages/${slug}`)}`);

  const { data: pkg } = await supabase
    .from("packages")
    .select("id, duration_days, max_guests")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!pkg) return { error: "This package is no longer available." };
  if (guests > pkg.max_guests) return { error: `This package takes up to ${pkg.max_guests} guests.` };

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      package_id: pkg.id,
      check_in: checkIn,
      check_out: addDays(checkIn, pkg.duration_days),
      guests,
      contact_name: contactName,
      contact_phone: contactPhone,
      note: note || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    // Trigger messages are user-safe ("guests exceed…", "check-in date is in the past").
    const msg = error?.message ?? "";
    return { error: /guests|check-in|available/.test(msg) ? msg : "Could not create the booking. Please try again." };
  }

  // Keep the contact details on the profile for next time.
  await supabase.from("profiles").update({ full_name: contactName, phone: contactPhone }).eq("id", user.id);

  revalidatePath("/account");
  redirect(`/account?booked=${data.id}`);
}

export async function cancelBooking(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id).eq("status", "pending");
  revalidatePath("/account");
}
