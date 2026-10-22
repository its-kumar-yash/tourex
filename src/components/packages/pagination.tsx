import Link from "next/link";
import type { PackageFilters } from "@/lib/data/packages";
import { filtersToQuery } from "@/lib/filters";

export function Pagination({
  filters,
  page,
  pageCount,
}: {
  filters: PackageFilters;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const href = (p: number) => `/packages${filtersToQuery(filters, { page: p })}`;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );

  const item = "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm";
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1">
      {page > 1 && (
        <Link href={href(page - 1)} className={`${item} hover:bg-cloud`} rel="prev">
          Previous
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="contents">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-ink-muted">…</span>}
          {p === page ? (
            <span aria-current="page" className={`${item} bg-maroon text-white`}>
              {p}
            </span>
          ) : (
            <Link href={href(p)} className={`${item} hover:bg-cloud`}>
              {p}
            </Link>
          )}
        </span>
      ))}
      {page < pageCount && (
        <Link href={href(page + 1)} className={`${item} hover:bg-cloud`} rel="next">
          Next
        </Link>
      )}
    </nav>
  );
}
