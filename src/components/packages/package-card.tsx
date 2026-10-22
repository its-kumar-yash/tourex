import Image from "next/image";
import Link from "next/link";
import type { PackageCard as PackageCardData } from "@/lib/data/packages";
import { formatPrice, plural } from "@/lib/format";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, PinIcon, UserIcon } from "@/components/ui/icons";

/** Whole card is one link (one tab stop); the title stays the accessible name. */
export function PackageCard({ pkg, priority = false }: { pkg: PackageCardData; priority?: boolean }) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cloud">
        {pkg.cover_image_url && (
          <Image
            src={pkg.cover_image_url}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {pkg.is_featured && <Badge tone="saffron">★ Featured</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold leading-snug group-hover:text-maroon">{pkg.title}</h2>
          <Rating value={pkg.rating} className="shrink-0 pt-1" />
        </div>
        <p className="mt-1 inline-flex items-center gap-1 text-sm text-ink-soft">
          <PinIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">{pkg.location}, {pkg.country}</span>
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{pkg.summary}</p>
        <ul className="mt-3 flex flex-wrap gap-2 text-xs text-ink-soft">
          <li className="inline-flex items-center gap-1 rounded-full bg-cloud px-2.5 py-1"><ClockIcon className="h-3.5 w-3.5" /> {plural(pkg.duration_days, "day")}</li>
          <li className="inline-flex items-center gap-1 rounded-full bg-cloud px-2.5 py-1"><UserIcon className="h-3.5 w-3.5" /> up to {pkg.max_guests}</li>
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <p className="text-xs text-ink-soft">
            From
            <span className="block text-xl font-semibold text-maroon">{formatPrice(pkg.price_minor, pkg.currency)}</span>
            per person
          </p>
          <span className="inline-flex h-9 items-center rounded-full bg-sky px-4 text-sm font-medium text-ink transition-colors group-hover:bg-maroon group-hover:text-white">
            View trip
          </span>
        </div>
      </div>
    </Link>
  );
}
