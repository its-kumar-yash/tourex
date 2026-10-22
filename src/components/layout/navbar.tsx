import { Logo } from "@/components/logo";
import { AuthButton } from "./auth-button";
import { DesktopNav } from "./nav-links-desktop";
import { MobileNav } from "./mobile-nav";

/**
 * Site header. Full navigation from 1024px; below that a menu sheet, so the
 * links and account actions never crowd or wrap on tablets.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <div className="toran" />
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8">
        <Logo />
        <DesktopNav />
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <AuthButton />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
