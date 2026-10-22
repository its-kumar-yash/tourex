import Link from "next/link";

export const BRAND = "Desi Tours and Travels";

/** Jharokha arch with a rising sun: the brand mark. Also used for the favicon. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={className}>
      <rect width="48" height="48" rx="12" fill="#8a1c3b" />
      <path d="M12 40V24c0-7 5.4-12.5 12-15 6.6 2.5 12 8 12 15v16" fill="none" stroke="#f3a712" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="24" cy="29" r="6" fill="#e2741d" />
      <path d="M9 40h30" stroke="#fde3c3" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="14.5" r="1.8" fill="#fde3c3" />
    </svg>
  );
}

export function Logo({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="leading-none">
        <span className={`font-display block text-xl ${tone === "dark" ? "text-maroon" : "text-white"}`}>Desi Tours</span>
        <span className={`block text-[11px] font-medium uppercase tracking-[0.18em] ${tone === "dark" ? "text-ink-soft" : "text-white/80"}`}>
          &amp; Travels
        </span>
      </span>
    </Link>
  );
}
