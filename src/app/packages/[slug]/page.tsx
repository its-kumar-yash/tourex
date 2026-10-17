import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPackageSlugs, getPackageBySlug } from "@/lib/data/packages";
import { formatPrice, plural } from "@/lib/format";
import { Gallery } from "@/components/packages/gallery";
import { Itinerary } from "@/components/packages/itinerary";
import { ReserveCard } from "@/components/packages/reserve-card";
import { TrackPackageView } from "@/components/analytics/track-package-view";
import { Rating } from "@/components/ui/rating";
import { ArrowLeftIcon, ClockIcon, PinIcon, UserIcon } from "@/components/ui/icons";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const rows = await getAllPackageSlugs();
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getPackageBySlug((await params).slug);
  if (!pkg) return { title: "Package not found", robots: { index: false } };
  return {
    title: pkg.title,
    description: pkg.summary,
    alternates: { canonical: `/packages/${pkg.slug}` },
    openGraph: {
      title: pkg.title,
      description: pkg.summary,
      images: pkg.cover_image_url ? [{ url: pkg.cover_image_url }] : undefined,
    },
  };
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.summary,
    image: pkg.cover_image_url ?? undefined,
    touristType: "Leisure",
    offers: {
      "@type": "Offer",
      price: (pkg.price_minor / 100).toFixed(0),
      priceCurrency: pkg.currency,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <article className="px-4 py-6 sm:px-8 sm:py-10">
      <TrackPackageView packageId={pkg.id} slug={pkg.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/packages"
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeftIcon className="h-4 w-4" /> All packages
      </Link>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-medium sm:text-5xl">{pkg.title}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-ink-soft">
            <PinIcon className="h-4 w-4" />
            {pkg.location}, {pkg.country}
          </p>
        </div>
        <Rating value={pkg.rating} className="text-base" />
      </header>

      <div className="mt-6">
        <Gallery images={pkg.package_images} title={pkg.title} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <ul className="flex flex-wrap gap-2 text-sm">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1.5">
              <ClockIcon className="h-4 w-4" /> {plural(pkg.duration_days, "day")}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1.5">
              <UserIcon className="h-4 w-4" /> Up to {plural(pkg.max_guests, "guest")}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1.5">
              From {formatPrice(pkg.price_minor, pkg.currency)} per person
            </li>
          </ul>

          <section className="mt-8">
            <h2 className="text-xl font-medium">About this trip</h2>
            <p className="mt-3 text-lg text-ink-soft">{pkg.summary}</p>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">
              {pkg.description}
            </p>
          </section>

          {pkg.package_itinerary.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-medium">Itinerary</h2>
              <div className="mt-4">
                <Itinerary days={pkg.package_itinerary} />
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<div className="h-80 rounded-[var(--radius-card)] border border-line bg-white" />}>
            <ReserveCard
              slug={pkg.slug}
              priceMinor={pkg.price_minor}
              currency={pkg.currency}
              durationDays={pkg.duration_days}
              maxGuests={pkg.max_guests}
            />
          </Suspense>
        </aside>
      </div>
    </article>
  );
}
