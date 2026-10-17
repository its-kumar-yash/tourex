import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export type CurrentUser = {
  id: string;
  email: string | null;
  profile: Tables<"profiles"> | null;
};

/** Current user plus profile, memoised per request. Null when signed out. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return { id: user.id, email: user.email ?? null, profile: profile ?? null };
});
