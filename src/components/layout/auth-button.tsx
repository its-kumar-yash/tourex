"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOutEverywhere, useSession } from "@/lib/auth/use-session";
import { buttonClasses } from "@/components/ui/button";

/** Desktop: Admin pill (admins only) + avatar menu. Placeholder keeps width stable while loading. */
export function AuthButton() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!session) return <span aria-hidden="true" className="inline-block h-9 w-24 animate-pulse rounded-full bg-cloud" />;

  if (!session.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className={buttonClasses({ variant: "ghost", size: "sm" })}>
          Sign in
        </Link>
        <Link href="/signup" className={buttonClasses({ variant: "primary", size: "sm" })}>
          Sign up
        </Link>
      </div>
    );
  }

  const initial = (session.name || "?").charAt(0).toUpperCase();
  const signOut = async () => {
    setOpen(false);
    await signOutEverywhere();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {session.isAdmin && (
        <Link href="/admin" className={buttonClasses({ variant: "soft", size: "sm" })}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
          </svg>
          Admin
        </Link>
      )}
      <div className="relative" ref={ref}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white pl-1 pr-3 text-sm font-medium hover:border-sky-deep"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-maroon text-xs text-white">{initial}</span>
          <span className="max-w-24 truncate">{session.name || "Account"}</span>
        </button>
        {open && (
          <div role="menu" className="absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-2xl border border-line bg-white py-1 text-sm shadow-[var(--shadow-card)]">
            <Link role="menuitem" href="/account" onClick={() => setOpen(false)} className="block px-4 py-2.5 hover:bg-cloud">
              My bookings &amp; profile
            </Link>
            {session.isAdmin && (
              <Link role="menuitem" href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2.5 hover:bg-cloud">
                Admin dashboard
              </Link>
            )}
            <button role="menuitem" type="button" onClick={signOut} className="block w-full border-t border-line px-4 py-2.5 text-left text-maroon hover:bg-cloud">
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Mobile sheet version: stacked full-width actions. */
export function MobileAuthActions({ onNavigate }: { onNavigate: () => void }) {
  const session = useSession();
  const router = useRouter();
  if (!session) return <span aria-hidden="true" className="block h-11 animate-pulse rounded-full bg-cloud" />;
  if (!session.user) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Link href="/login" onClick={onNavigate} className={buttonClasses({ variant: "outline" })}>Sign in</Link>
        <Link href="/signup" onClick={onNavigate} className={buttonClasses({ variant: "primary" })}>Sign up</Link>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <p className="px-2 text-sm text-ink-soft">Signed in as <span className="font-medium text-ink">{session.name}</span></p>
      {session.isAdmin && (
        <Link href="/admin" onClick={onNavigate} className={buttonClasses({ variant: "soft", className: "w-full" })}>Admin dashboard</Link>
      )}
      <Link href="/account" onClick={onNavigate} className={buttonClasses({ variant: "outline", className: "w-full" })}>My bookings &amp; profile</Link>
      <button
        type="button"
        onClick={async () => {
          onNavigate();
          await signOutEverywhere();
          router.push("/");
          router.refresh();
        }}
        className={buttonClasses({ variant: "danger-ghost", className: "w-full" })}
      >
        Sign out
      </button>
    </div>
  );
}
