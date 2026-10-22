"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, navLinks } from "./nav-links";

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1 text-[15px]">
        {navLinks.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 transition-colors ${active ? "text-maroon" : "text-ink-soft hover:text-ink"}`}
              >
                {link.label}
                {active && <span aria-hidden="true" className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-saffron" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
