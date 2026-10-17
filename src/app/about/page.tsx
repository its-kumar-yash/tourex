import type { Metadata } from "next";
import { site } from "@/content/site";
import { BRAND } from "@/components/logo";
import { Features } from "@/components/home/features";
import { Cta } from "@/components/home/cta";

export const metadata: Metadata = {
  title: "About us",
  description: `${BRAND}: small-group tours across India and beyond, run by people who travel the routes themselves.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="px-4 py-16 sm:px-8 sm:py-24">
        <h1 className="display max-w-3xl text-4xl font-medium sm:text-6xl">
          Trips planned by people who have actually been there
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="text-lg text-ink-soft">
            {BRAND} started as a group of friends organising road trips for each other. We still plan
            every itinerary the same way: we travel it first, fix what does not work, and only then
            offer it to you.
          </p>
          <dl className="grid grid-cols-3 gap-4">
            {site.about.stats.map((s) => (
              <div key={s.label}>
                <dd className="display text-3xl font-medium">{s.value}</dd>
                <dt className="mt-1 text-sm text-ink-soft">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Features />
      <Cta />
    </>
  );
}
