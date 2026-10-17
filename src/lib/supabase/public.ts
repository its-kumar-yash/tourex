import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "./types";

/**
 * Cookie-less anon client for public reads (home, package pages).
 * No session is attached, so pages using it can be statically rendered
 * and revalidated; RLS limits it to published content.
 */
export function createPublicClient() {
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
