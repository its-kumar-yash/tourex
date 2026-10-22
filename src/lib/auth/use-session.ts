"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type SessionState = { user: User | null; isAdmin: boolean; name: string };

const roleCacheKey = (id: string) => `dt_role_${id}`;

/**
 * Browser session for the header and booking card. Pages stay static; this
 * resolves the visitor after hydration.
 *
 * The role query never runs inside onAuthStateChange: Supabase holds an auth
 * lock during that callback and awaiting another Supabase call there
 * deadlocks, which is why the Admin button used to never appear.
 */
export function useSession() {
  const [state, setState] = useState<SessionState | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    let seq = 0;

    const resolve = async (user: User | null) => {
      const mine = ++seq;
      if (!user) {
        if (active) setState({ user: null, isAdmin: false, name: "" });
        return;
      }
      const name = ((user.user_metadata?.full_name as string | undefined) ?? user.email ?? "").split(" ")[0];
      const cached = sessionStorage.getItem(roleCacheKey(user.id));
      if (active) setState({ user, isAdmin: cached === "admin", name });
      const { data } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).maybeSingle();
      if (!active || mine !== seq) return;
      if (data?.role) sessionStorage.setItem(roleCacheKey(user.id), data.role);
      setState({ user, isAdmin: data?.role === "admin", name: data?.full_name?.split(" ")[0] || name });
    };

    supabase.auth.getSession().then(({ data }) => resolve(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return;
      // Defer out of the auth lock before touching the database.
      setTimeout(() => resolve(session?.user ?? null), 0);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function signOutEverywhere() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user) sessionStorage.removeItem(roleCacheKey(session.user.id));
  await supabase.auth.signOut();
}
