import Image from "next/image";
import Link from "next/link";
import type { PackageCard } from "@/lib/data/packages";
import { formatPrice } from "@/lib/format";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { PinIcon } from "@/components/ui/icons";

export function Destinations({ packages }: { packages: PackageCard[] }) {
  const [first, ...rest] = packages.slice(0, 5);
  if (!first) return null;
  return (
    <section className="px-4 pb-16 sm:px-8 sm:pb-24">
      <SectionHeading kicker="घूमो देश" title="Popular journeys" subtitle="Our most-loved trips, chosen by travellers like you." />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        {[first, ...rest].map((pkg, i) => (
          <li key={pkg.id} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
            <Link
              href={`/packages/${pkg.slug}`}
              // On desktop the grid rows set the height; tiles must not also
              // keep a 4:3 ratio there, or they compute a width wider than their column.
              className={`group relative block overflow-hidden rounded-[var(--radius-card)] bg-cloud aspect-[4/3] lg:aspect-auto lg:h-full ${i === 0 ? "lg:min-h-[460px]" : ""}`}
            >
              {pkg.cover_image_url && (
                <Image
                  src={pkg.cover_image_url}
                  alt={pkg.title}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b0d14]/80 via-[#2b0d14]/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-white">
                <p className={`font-medium leading-snug ${i === 0 ? "text-2xl" : "text-lg"}`}>{pkg.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/85">
                  <span className="inline-flex items-center gap-1"><PinIcon className="h-3.5 w-3.5" /> {pkg.location}</span>
                  <span>from {formatPrice(pkg.price_minor, pkg.currency)}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <ButtonLink href="/packages" variant="outline">View all packages</ButtonLink>
      </div>
    </section>
  );
}
