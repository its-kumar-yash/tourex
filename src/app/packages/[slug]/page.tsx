import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllPackageSlugs, getPackageBySlug } from "@/lib/data/packages";
import { formatPrice, plural } from "@/lib/format";
import { Gallery } from "@/components/packages/gallery";
import { Itinerary } from "@/components/packages/itinerary";
import { ReserveCard } from "@/components/packages/reserve-card";
import { TrackPackageView } from "@/components/analytics/track-package-view";
import { Rating } from "@/components/ui/rating";
import { MobileReserveBar } from "@/components/packages/mobile-reserve-bar";
import { ClockIcon, PinIcon, UserIcon } from "@/components/ui/icons";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BRAND } from "@/components/logo";
import {
  ORG_ID,
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdHtml,
  packageSeoDescription,
  packageSeoTitle,
} from "@/lib/seo";

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
  const title = packageSeoTitle(pkg);
  const description = packageSeoDescription(pkg);
  const url = `/packages/${pkg.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: BRAND,
      locale: "en_IN",
      url,
      title,
      description,
      images: pkg.cover_image_url ? [{ url: pkg.cover_image_url, alt: pkg.title }] : undefined,
    },
  };
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const url = absoluteUrl(`/packages/${pkg.slug}`);
  const images = [pkg.cover_image_url, ...pkg.package_images.map((i) => i.url)].filter(
    (u, i, all): u is string => Boolean(u) && all.indexOf(u) === i,
  );
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Tour packages", path: "/packages" },
    { name: pkg.title, path: `/packages/${pkg.slug}` },
  ];
  // TouristTrip has no rich result of its own, but it tells Google exactly
  // what the page sells. The star rating is left out: it is set by hand, not
  // collected from reviews, and Google penalises self-awarded review markup.
  const tripJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name: pkg.title,
    description: pkg.summary,
    url,
    image: images.length > 0 ? images : undefined,
    touristType: "Leisure",
    provider: { "@id": ORG_ID },
    itinerary:
      pkg.package_itinerary.length > 0
        ? {
            "@type": "ItemList",
            numberOfItems: pkg.package_itinerary.length,
            itemListElement: pkg.package_itinerary.map((d) => ({
              "@type": "ListItem",
              position: d.day_no,
              item: { "@type": "TouristAttraction", name: `Day ${d.day_no}: ${d.title}`, description: d.description || undefined },
            })),
          }
        : undefined,
    subjectOf: { "@type": "WebPage", "@id": url },
    offers: {
      "@type": "Offer",
      url,
      price: (pkg.price_minor / 100).toFixed(0),
      priceCurrency: pkg.currency,
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    },
  };

  return (
    <article className="px-4 pb-28 pt-6 sm:px-8 sm:pt-10 lg:pb-12">
      <TrackPackageView packageId={pkg.id} slug={pkg.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(tripJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(breadcrumbJsonLd(crumbs))} />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl sm:text-5xl">{pkg.title}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-ink-soft">
            <PinIcon className="h-4 w-4" />
            {pkg.location}, {pkg.country}
          </p>
        </div>
        <Rating value={pkg.rating} className="rounded-full bg-cloud px-3 py-1.5 text-base" />
      </header>

      <div className="mt-6">
        <Gallery
          images={
            pkg.package_images.length > 0 || !pkg.cover_image_url
              ? pkg.package_images
              : [{ id: "cover", package_id: pkg.id, url: pkg.cover_image_url, alt: pkg.title, sort_order: 0, created_at: pkg.created_at }]
          }
          title={pkg.title}
        />
      </div>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <ul className="flex flex-wrap gap-2 text-sm">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1.5">
              <ClockIcon className="h-4 w-4" /> {plural(pkg.duration_days, "day")}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1.5">
              <UserIcon className="h-4 w-4" /> Up to {plural(pkg.max_guests, "guest")}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-sky px-3 py-1.5 font-medium text-maroon">
              From {formatPrice(pkg.price_minor, pkg.currency)} per person
            </li>
          </ul>

          <section className="mt-8">
            <h2 className="display text-2xl">About this trip</h2>
            <p className="mt-3 text-lg text-ink-soft">{pkg.summary}</p>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">
              {pkg.description}
            </p>
          </section>

          {pkg.package_itinerary.length > 0 && (
            <section className="mt-10">
              <h2 className="display text-2xl">Day-by-day itinerary</h2>
              <div className="mt-4">
                <Itinerary days={pkg.package_itinerary} />
              </div>
            </section>
          )}
        </div>

        <aside id="reserve" className="scroll-mt-24 lg:sticky lg:top-28 lg:self-start">
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
      <MobileReserveBar priceMinor={pkg.price_minor} currency={pkg.currency} />
    </article>
  );
}
