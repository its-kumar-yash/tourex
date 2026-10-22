"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { OPEN_CONSENT_EVENT, readConsent, saveConsent } from "@/lib/consent";
import { Button } from "@/components/ui/button";

type View = "hidden" | "banner" | "prefs";

/**
 * Bottom-sheet consent banner. Accept and Reject carry equal weight; the
 * preferences view lets visitors choose per category. Fixed positioning, so
 * it never shifts page layout.
 */
export function ConsentBanner() {
  const [view, setView] = useState<View>("hidden");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!readConsent()) setView("banner");
    const open = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setView("prefs");
    };
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  if (view === "hidden") return null;

  const decide = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setView("hidden");
  };

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:inset-x-5 sm:bottom-5"
    >
      <p id={titleId} className="font-medium">
        {view === "prefs" ? "Cookie preferences" : "We value your privacy"}
      </p>

      {view === "banner" ? (
        <p className="mt-2 text-sm text-ink-soft">
          We use essential cookies to run this site. With your permission we also use Google
          Analytics to understand how visitors use it. You can change your choice any time from
          “Cookie settings” at the bottom of the page.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
            Privacy policy
          </Link>
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-line text-sm">
          <li className="flex items-start justify-between gap-4 py-3">
            <span>
              <span className="font-medium">Essential</span>
              <span className="block text-ink-soft">
                Sign-in, security and anonymous visit counts. Always on.
              </span>
            </span>
            <span className="shrink-0 text-xs text-ink-muted">Always on</span>
          </li>
          <li className="py-3">
            <label className="flex items-start justify-between gap-4">
              <span>
                <span className="font-medium">Analytics</span>
                <span className="block text-ink-soft">Google Analytics, to measure traffic and improve the site.</span>
              </span>
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-maroon)]"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
            </label>
          </li>
          <li className="py-3">
            <label className="flex items-start justify-between gap-4">
              <span>
                <span className="font-medium">Marketing</span>
                <span className="block text-ink-soft">Lets Google use data for ads and personalisation.</span>
              </span>
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-maroon)]"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
            </label>
          </li>
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {view === "banner" ? (
          <>
            <Button size="sm" onClick={() => decide(true, true)}>Accept all</Button>
            <Button size="sm" onClick={() => decide(false, false)}>Reject all</Button>
            <Button size="sm" variant="ghost" onClick={() => setView("prefs")}>Preferences</Button>
          </>
        ) : (
          <>
            <Button size="sm" onClick={() => decide(analytics, marketing)}>Save choices</Button>
            <Button size="sm" variant="outline" onClick={() => decide(true, true)}>Accept all</Button>
            <Button size="sm" variant="outline" onClick={() => decide(false, false)}>Reject all</Button>
          </>
        )}
      </div>
    </div>
  );
}
