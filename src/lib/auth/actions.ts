"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { safeNext } from "./redirect";

export type AuthState = { error?: string; message?: string };

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = str(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  if (!EMAIL.test(email) || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error:
        error.code === "email_not_confirmed"
          ? "Please confirm your email first. Check your inbox for the link."
          : "Wrong email or password.",
    };
  }
  redirect(next);
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = str(formData, "full_name");
  const email = str(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  if (fullName.length < 2) return { error: "Please enter your name." };
  if (!EMAIL.test(email)) return { error: "Please enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${env.siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: error.message };
  // Email confirmation on: no session yet.
  if (!data.session) {
    return { message: "Almost there. Check your email for a confirmation link." };
  }
  redirect(next);
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = str(formData, "email");
  if (!EMAIL.test(email)) return { error: "Please enter a valid email." };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.siteUrl}/auth/callback?next=/reset-password`,
  });
  // Same message whether or not the account exists.
  return { message: "If that email has an account, a reset link is on its way." };
}

export async function updatePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  redirect("/account?password=updated");
}

export async function updateProfile(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = str(formData, "full_name");
  const phone = str(formData, "phone");
  if (fullName.length < 2) return { error: "Please enter your name." };
  if (phone && !/^[+\d][\d\s-]{6,19}$/.test(phone)) return { error: "That phone number looks wrong." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null })
    .eq("id", user.id);
  if (error) return { error: "Could not save your profile. Please try again." };
  revalidatePath("/account");
  return { message: "Profile saved." };
}
