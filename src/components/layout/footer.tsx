import Link from "next/link";
import { BRAND, Logo } from "@/components/logo";
import { site } from "@/content/site";
import { navLinks } from "./nav-links";
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="bg-[#2b0d14] text-white/80">
      <div className="toran opacity-90" />
      <div className="grid gap-10 px-4 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_1fr_1.4fr]">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-4 text-sm leading-relaxed">
            A desi travel company. Hand-picked journeys across India and beyond, planned by people who have travelled them.
          </p>
          <p className="mt-3 font-display text-lg text-marigold">अतिथि देवो भव</p>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-semibold text-white">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">{link.label}</Link>
              </li>
            ))}
            <li><Link href="/account" className="hover:text-white">My bookings</Link></li>
          </ul>
        </nav>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Get in touch</p>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-white">
                <PhoneIcon className="h-4 w-4 shrink-0 text-marigold" /> {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-marigold" /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="inline-flex min-w-0 items-center gap-2 hover:text-white">
                <MailIcon className="h-4 w-4 shrink-0 text-marigold" />
                <span className="break-all">{site.contact.email}</span>
              </a>
            </li>
            <li className="text-white/60">{site.contact.hours}</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>© {new Date().getFullYear()} {BRAND}. Made with ❤ in India.</span>
        <span className="flex gap-5">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <CookieSettingsButton />
        </span>
      </div>
    </footer>
  );
}
