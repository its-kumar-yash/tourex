"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type SessionState = { user: User | null; isAdmin: boolean; name: string };

const roleCacheKey = (id: string) => `dt_role_${id}`;

/**
 * Browser session for the header and booking card. Pages stay static; this
 * resolves the visitor after hydration.
 *
 * Signing in happens in a server action, so the browser client is never told
 * about it: no SIGNED_IN event fires, and the header lives in the root layout
 * and stays mounted across the redirect. The cookie is therefore re-read on
 * every navigation and whenever the tab is shown again, otherwise "Sign in"
 * would keep showing until a full page reload.
 *
 * The role query never runs inside onAuthStateChange: Supabase holds an auth
 * lock during that callback and awaiting another Supabase call there
 * deadlocks, which is why the Admin button used to never appear.
 */
export function useSession() {
  const [state, setState] = useState<SessionState | null>(null);
  const pathname = usePathname();
  const recheck = useRef<() => void>(() => {});
  const navigated = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    let seq = 0;
    // Whose profile we already loaded, so re-checks cost nothing but a cookie read.
    let loadedFor: string | null = null;

    const resolve = async (user: User | null) => {
      const mine = ++seq;
      if (!user) {
        loadedFor = null;
        if (active) setState({ user: null, isAdmin: false, name: "" });
        return;
      }
      if (loadedFor === user.id) return;
      const name = ((user.user_metadata?.full_name as string | undefined) ?? user.email ?? "").split(" ")[0];
      const cached = sessionStorage.getItem(roleCacheKey(user.id));
      if (active) setState({ user, isAdmin: cached === "admin", name });
      const { data, error } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).maybeSingle();
      if (!active || mine !== seq) return;
      // A failed read must not be memoised: keep the cached role showing and let
      // the next navigation try again. Sticking here would hide the Admin button
      // until a full reload, which is what the re-checks exist to prevent.
      if (error) return;
      if (data?.role) sessionStorage.setItem(roleCacheKey(user.id), data.role);
      loadedFor = user.id;
      setState({ user, isAdmin: data?.role === "admin", name: data?.full_name?.split(" ")[0] || name });
    };

    const fromCookie = () =>
      void supabase.auth.getSession().then(({ data }) => resolve(data.session?.user ?? null));

    recheck.current = fromCookie;
    fromCookie();

    const onVisible = () => document.visibilityState === "visible" && fromCookie();
    document.addEventListener("visibilitychange", onVisible);

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return;
      // A sign-in or sign-out we did see: drop the memo so the profile reloads.
      loadedFor = null;
      // Defer out of the auth lock before touching the database.
      setTimeout(() => resolve(session?.user ?? null), 0);
    });
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", onVisible);
      sub.subscription.unsubscribe();
    };
  }, []);

  // Sign-in and sign-out both end in a navigation, so this is what actually
  // refreshes the header after a server action. Skipped on mount, where the
  // effect above has already read the cookie.
  useEffect(() => {
    if (!navigated.current) {
      navigated.current = true;
      return;
    }
    recheck.current();
  }, [pathname]);

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
