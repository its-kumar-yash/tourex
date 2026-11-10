import { env } from "@/lib/env";
import { BRAND } from "@/components/logo";
import { formatPrice, plural } from "@/lib/format";
import { site } from "@/content/site";

/** Absolute URL on the live site for a path such as "/packages". */
export function absoluteUrl(path = "/") {
  return `${env.siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export const ORG_ID = absoluteUrl("/#organization");

/**
 * The business and the website, for Google's knowledge panel and site name.
 * Name, address and phone must match the Google Business Profile exactly.
 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": ORG_ID,
        name: BRAND,
        alternateName: ["Desi Tours", "Desi Tours & Travels"],
        url: absoluteUrl("/"),
        logo: absoluteUrl("/apple-icon"),
        image: absoluteUrl("/opengraph-image"),
        description:
          "Delhi-based travel agency offering hand-picked tour packages across India and abroad, with local guides and clear per-person rupee pricing.",
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        areaServed: { "@type": "Country", name: "India" },
        telephone: site.contact.phone.replace(/\s/g, ""),
        email: site.contact.email,
        address: { "@type": "PostalAddress", ...site.contact.postal },
        // Matches site.contact.hours (Mon–Sat, 9:30 am to 7:00 pm IST).
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:30",
          closes: "19:00",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: site.contact.phone.replace(/\s/g, ""),
          email: site.contact.email,
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: BRAND,
        alternateName: ["Desi Tours", "desitourstravel.com"],
        url: absoluteUrl("/"),
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type PackageSeoInput = {
  title: string;
  summary: string;
  location: string;
  duration_days: number;
  price_minor: number;
  currency: string;
};

/** "Ladakh Himalayan Road Trip – 7 Days Tour Package". The layout appends the brand. */
export function packageSeoTitle(pkg: PackageSeoInput) {
  return `${pkg.title} – ${plural(pkg.duration_days, "Day")} Tour Package`;
}

/** Summary plus the facts searchers compare on: length, place and price. Kept under ~160 chars. */
export function packageSeoDescription(pkg: PackageSeoInput) {
  const facts = `${plural(pkg.duration_days, "day")} in ${pkg.location} from ${formatPrice(pkg.price_minor, pkg.currency)} per person.`;
  const full = `${pkg.summary} ${facts}`;
  if (full.length <= 160) return full;
  return facts.length <= 160 ? facts : pkg.summary.slice(0, 157) + "…";
}

/** Renders a JSON-LD block. `<` is escaped so text can never close the script tag. */
export function jsonLdHtml(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
