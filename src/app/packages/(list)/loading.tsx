// Scoped to the list page by the (list) route group so the skeleton does not
// wrap /packages/[slug]; a parent loading boundary would stream a 200 shell
// before the package lookup could return a 404.
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-12">
      <Skeleton className="h-12 w-72" />
      <Skeleton className="mt-3 h-5 w-40" />
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Skeleton className="hidden h-[520px] lg:block" />
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="overflow-hidden rounded-[var(--radius-card)] border border-line">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
