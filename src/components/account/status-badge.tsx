import type { BookingStatus } from "@/lib/supabase/types";

const styles: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-800",
  confirmed: "bg-emerald-50 text-emerald-800",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-cloud text-ink-soft",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
