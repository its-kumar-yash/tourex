import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { TrackPageView } from "@/components/analytics/track-page-view";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { env } from "@/lib/env";
import { BRAND } from "@/components/logo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: `${BRAND} — Find your next adventure`,
    template: `%s · ${BRAND}`,
  },
  description:
    "Hand-picked tour packages to the world's most beautiful places. Browse destinations, compare prices and reserve your trip.",
  openGraph: {
    type: "website",
    siteName: BRAND,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh flex flex-col">
        <TrackPageView />
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-3 pt-3 sm:px-5 sm:pt-5">
          <div className="flex flex-1 flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
      {env.gaMeasurementId && <GoogleAnalytics gaId={env.gaMeasurementId} />}
    </html>
  );
}
