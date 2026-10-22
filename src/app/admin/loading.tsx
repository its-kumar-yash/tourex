import { Skeleton } from "@/components/ui/skeleton";

/** Shown inside the admin layout (sidebar stays put) while a section loads. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-52" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="mt-8 h-72" />
    </div>
  );
}
