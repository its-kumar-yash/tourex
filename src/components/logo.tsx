import Link from "next/link";

export const BRAND = "Desi Tours and Travels";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-lg tracking-tight sm:text-xl ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6 shrink-0"
        fill="currentColor"
      >
        <path d="M21.4 2.6a1 1 0 0 0-1.05-.23L2.6 9.1a1 1 0 0 0 .04 1.88l7.1 2.5 2.5 7.1a1 1 0 0 0 1.88.04l6.73-17.75a1 1 0 0 0-.23-1.05Zm-9.95 9.3L5.3 9.75l11.7-4.43-5.55 6.58Z" />
      </svg>
      <span>
        <span className="font-semibold">Desi Tours</span>{" "}
        <span className="text-ink-soft">&amp; Travels</span>
      </span>
    </Link>
  );
}
