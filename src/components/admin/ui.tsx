import Link from "next/link";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="display text-3xl font-medium sm:text-4xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex h-10 items-center rounded-full bg-maroon px-4 text-sm font-medium text-white hover:bg-maroon-dark"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Kpi({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-5">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="display mt-2 text-3xl font-medium">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "error" }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm ${tone === "error" ? "bg-red-50 text-red-700" : "bg-sky"}`}
    >
      {children}
    </p>
  );
}

export const table = {
  wrap: "mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-line",
  table: "w-full min-w-[640px] text-sm",
  th: "bg-cloud px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-ink-soft",
  td: "border-t border-line px-4 py-3 align-top",
};

export const smallButton =
  "inline-flex h-8 items-center rounded-full border border-line bg-white px-3 text-xs font-medium hover:bg-cloud disabled:opacity-50";
