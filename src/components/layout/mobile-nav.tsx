"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { MobileAuthActions } from "./auth-button";
import { isActive, navLinks } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white hover:bg-cloud"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
        </svg>
      </button>

      {open && (
        <>
          <button aria-hidden="true" tabIndex={-1} className="fixed inset-0 top-[74px] z-30 cursor-default bg-ink/20" onClick={() => setOpen(false)} />
          <div id={panelId} className="absolute inset-x-0 top-full z-40 border-b border-line bg-white px-4 pb-5 pt-2 shadow-[var(--shadow-card)] sm:px-8">
            <ul className="flex flex-col">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-xl px-3 py-3 text-base ${active ? "bg-cloud font-medium text-maroon" : "text-ink-soft hover:bg-cloud hover:text-ink"}`}
                    >
                      {link.label}
                      {active && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-saffron" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 border-t border-line pt-4">
              <MobileAuthActions onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
