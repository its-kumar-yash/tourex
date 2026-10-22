import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/content/site";
import { BRAND } from "@/components/logo";
import { Features } from "@/components/home/features";
import { Cta } from "@/components/home/cta";
import { Mandala } from "@/components/ui/motifs";

export const metadata: Metadata = {
  title: "About us",
  description: `${BRAND}: a desi travel company running small-group tours across India and beyond, planned by people who travel the routes themselves.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-14 sm:px-8 sm:py-20">
        <Mandala className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 text-sky-deep/25" />
        <p className="font-display text-lg text-saffron-deep">{site.about.kicker}</p>
        <h1 className="display mt-1 max-w-3xl text-4xl sm:text-6xl">Trips planned by people who have actually been there</h1>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          <div className="space-y-4 text-lg text-ink-soft">
            <p>
              {BRAND} started as a group of friends organising road trips for each other across India. We still plan
              every itinerary the same way: we travel it first, fix what does not work, and only then offer it to you.
            </p>
            <p>
              Our guides are locals, our stays are chosen for warmth over glitter, and our prices are one honest
              per-person number in rupees.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-cloud">
            <Image src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=70" alt="Houseboat among coconut palms in Kerala" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
        <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
          {site.about.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-cloud p-4 text-center">
              <dd className="display text-3xl text-maroon">{s.value}</dd>
              <dt className="mt-1 text-xs text-ink-soft sm:text-sm">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>
      <Features />
      <Cta />
    </>
  );
}
