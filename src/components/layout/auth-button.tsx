"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { buttonClasses } from "@/components/ui/button";

type State = { user: User | null; isAdmin: boolean };

/**
 * Reads the session in the browser so the layout stays static and every
 * page can still be cached. Shows "Sign In" until the session is known.
 */
export function AuthButton({ full = false }: { full?: boolean }) {
  const [state, setState] = useState<State | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const load = async (user: User | null) => {
      if (!user) return active && setState({ user: null, isAdmin: false });
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (active) setState({ user, isAdmin: data?.role === "admin" });
    };

    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await createClient().auth.signOut();
    setState({ user: null, isAdmin: false });
    router.push("/");
    router.refresh();
  };

  if (!state?.user) {
    return (
      <Link
        href="/login"
        className={buttonClasses({ variant: full ? "primary" : "outline", size: full ? "md" : "sm", className: full ? "w-full" : "" })}
      >
        Sign In
      </Link>
    );
  }

  const name = (state.user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "Account";
  return (
    <div className={`flex items-center gap-2 ${full ? "flex-col items-stretch" : ""}`}>
      {state.isAdmin && (
        <Link href="/admin" className={buttonClasses({ variant: "soft", size: "sm" })}>
          Admin
        </Link>
      )}
      <Link href="/account" className={buttonClasses({ variant: "outline", size: "sm" })}>
        {name}
      </Link>
      <button type="button" onClick={signOut} className={buttonClasses({ variant: "ghost", size: "sm" })}>
        Sign out
      </button>
    </div>
  );
}
