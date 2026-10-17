import Image from "next/image";
import Link from "next/link";
import type { PackageCard } from "@/lib/data/packages";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { PinIcon } from "@/components/ui/icons";

const SPANS = ["", "", "sm:col-span-2", "", ""];

export function Destinations({ packages }: { packages: PackageCard[] }) {
  return (
    <section className="px-4 pb-16 sm:px-8 sm:pb-24">
      <SectionHeading title="Experience our destinations" />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {packages.slice(0, 5).map((pkg, i) => (
          <li key={pkg.id} className={SPANS[i]}>
            <Link
              href={`/packages/${pkg.slug}`}
              className={`group relative block overflow-hidden rounded-[var(--radius-card)] bg-cloud ${
                i === 2 ? "aspect-[16/7]" : "aspect-[4/3]"
              }`}
            >
              {pkg.cover_image_url && (
                <Image
                  src={pkg.cover_image_url}
                  alt={pkg.title}
                  fill
                  sizes={i === 2 ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-medium sm:text-xl">{pkg.title}</p>
                <p className="inline-flex items-center gap-1 text-xs text-white/85">
                  <PinIcon className="h-3.5 w-3.5" /> {pkg.location}, {pkg.country}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <ButtonLink href="/packages" variant="outline">
          View all packages
        </ButtonLink>
      </div>
    </section>
  );
}
