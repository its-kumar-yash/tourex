"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const NAV_START_EVENT = "dt:nav-start";

/** Call before router.push so programmatic navigations also show the bar. */
export function startNavigationProgress() {
  window.dispatchEvent(new Event(NAV_START_EVENT));
}

/**
 * Thin saffron bar at the top of the window from the moment an internal link
 * is clicked until the new route renders, so every navigation feels answered
 * immediately even when the server takes a moment.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [pathname, search]);

  useEffect(() => {
    const start = () => setActive(true);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      start();
    };
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if ((form.method || "get").toLowerCase() === "get" && form.action.startsWith(location.origin)) start();
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    window.addEventListener(NAV_START_EVENT, start);
    // Safety: never leave the bar running if a navigation was cancelled.
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (active) timer = setTimeout(() => setActive(false), 10000);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      window.removeEventListener(NAV_START_EVENT, start);
      if (timer) clearTimeout(timer);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div role="progressbar" aria-label="Loading page" className="fixed inset-x-0 top-0 z-[60] h-[3px] overflow-hidden bg-sky">
      <div className="h-full w-2/5 animate-progress bg-gradient-to-r from-saffron via-marigold to-maroon" />
    </div>
  );
}
