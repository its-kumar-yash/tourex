import Link from "next/link";
import { BRAND, Logo } from "@/components/logo";
import { navLinks } from "./nav-links";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cloud">
      <div className="flex flex-col gap-8 px-4 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-ink-soft">
            Traveling changes you. You see new places, meet new people, and
            become a new version of yourself.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-ink-soft sm:grid-cols-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line px-4 py-4 text-xs text-ink-muted sm:px-8">
        © {new Date().getFullYear()} {BRAND}. All rights reserved.
      </div>
    </footer>
  );
}
