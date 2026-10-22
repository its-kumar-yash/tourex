import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="px-4 py-10 sm:px-8 sm:py-14" aria-busy="true" aria-label="Loading your account">
      <Skeleton className="h-12 w-56" />
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4 rounded-[var(--radius-card)] border border-line p-4">
              <Skeleton className="aspect-[4/3] w-44 shrink-0" />
              <div className="flex-1 space-y-2"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-1/3" /></div>
            </div>
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}
