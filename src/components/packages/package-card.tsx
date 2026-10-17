import Image from "next/image";
import Link from "next/link";
import type { PackageCard as PackageCardData } from "@/lib/data/packages";
import { formatPrice, plural } from "@/lib/format";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { PinIcon } from "@/components/ui/icons";

export function PackageCard({
  pkg,
  priority = false,
}: {
  pkg: PackageCardData;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow hover:shadow-[var(--shadow-card)]">
      <Link
        href={`/packages/${pkg.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-cloud"
      >
        {pkg.cover_image_url && (
          <Image
            src={pkg.cover_image_url}
            alt={pkg.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {pkg.is_featured && <Badge>Featured</Badge>}
          <Badge>{plural(pkg.duration_days, "day")}</Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-medium leading-snug">
            <Link href={`/packages/${pkg.slug}`} className="hover:underline">
              {pkg.title}
            </Link>
          </h3>
          <Rating value={pkg.rating} className="shrink-0 pt-1" />
        </div>
        <p className="mt-1 inline-flex items-center gap-1 text-sm text-ink-soft">
          <PinIcon className="h-4 w-4" />
          {pkg.location}, {pkg.country}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{pkg.summary}</p>
        <p className="mt-auto pt-4 text-sm text-ink-soft">
          From{" "}
          <span className="text-lg font-semibold text-ink">
            {formatPrice(pkg.price_minor, pkg.currency)}
          </span>{" "}
          / person
        </p>
      </div>
    </article>
  );
}
