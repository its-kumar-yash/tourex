import type { Tables } from "@/lib/supabase/types";

export function Itinerary({ days }: { days: Tables<"package_itinerary">[] }) {
  if (days.length === 0) return null;
  return (
    <ol className="divide-y divide-line rounded-[var(--radius-card)] border border-line">
      {days.map((d, i) => (
        <li key={d.id}>
          <details open={i === 0} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-4 sm:px-5">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky text-sm font-medium">
                {d.day_no}
              </span>
              <span className="flex-1 font-medium">{d.title}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-ink-muted transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            {d.description && (
              <p className="px-4 pb-5 pl-[4.25rem] text-ink-soft sm:px-5 sm:pl-[4.5rem]">
                {d.description}
              </p>
            )}
          </details>
        </li>
      ))}
    </ol>
  );
}
