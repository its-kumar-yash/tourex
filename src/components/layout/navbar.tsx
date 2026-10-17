import Link from "next/link";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { navLinks } from "./nav-links";

/**
 * Site header. Server Component; only the mobile menu toggle ships JS.
 * The sign-in button becomes an account menu in Phase 3.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[15px] text-ink-soft">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="/login"
            variant="outline"
            size="sm"
            className="hidden md:inline-flex"
          >
            Sign In
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
