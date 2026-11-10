import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Poppins, Rozha_One } from "next/font/google";
import { TrackPageView } from "@/components/analytics/track-page-view";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { env } from "@/lib/env";
import { BRAND } from "@/components/logo";
import { jsonLdHtml, siteJsonLd } from "@/lib/seo";
import "./globals.css";

// Both families are by Indian Type Foundry. Rozha One carries Devanagari for
// the Hindi accents; the browser only downloads that subset where it is used.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const rozha = Rozha_One({
  variable: "--font-rozha",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
// Hindi accents only: not preloaded, so it never competes with the hero image.
// The display font stack falls back to it glyph by glyph for Devanagari.
const rozhaDeva = Rozha_One({
  variable: "--font-rozha-deva",
  subsets: ["devanagari"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: `${BRAND} | India Tour Packages and Holidays`,
    template: `%s · ${BRAND}`,
  },
  description:
    "Delhi travel agency with tour packages for Kerala, Ladakh, Goa, Rajasthan, Agra and Indonesia. Local guides, clear per-person ₹ prices. Reserve today.",
  applicationName: BRAND,
  openGraph: { type: "website", siteName: BRAND, locale: "en_IN" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#8a1c3b" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${poppins.variable} ${rozha.variable} ${rozhaDeva.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(siteJsonLd())} />
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <TrackPageView />
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-2 pt-2 sm:px-5 sm:pt-5">
          <div className="flex flex-1 flex-col overflow-clip rounded-t-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
        <ConsentBanner />
        {env.gaMeasurementId && <GoogleAnalytics gaId={env.gaMeasurementId} />}
      </body>
    </html>
  );
}
