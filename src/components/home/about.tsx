import Image from "next/image";
import { site } from "@/content/site";

const IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=75";

export function About() {
  return (
    <section className="grid gap-8 px-4 pb-16 sm:px-8 sm:pb-24 md:grid-cols-2 md:items-center">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-cloud md:aspect-[5/6]">
        <Image
          src={IMAGE}
          alt="Lake between mountains"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div>
        <h2 className="display text-3xl font-medium sm:text-4xl">{site.about.title}</h2>
        <p className="mt-4 text-ink-soft">{site.about.body}</p>
        <dl className="mt-8 divide-y divide-line">
          {site.about.stats.map((s) => (
            <div key={s.label} className="flex items-center justify-between py-4">
              <dt className="order-2 text-sm text-ink-soft">{s.label}</dt>
              <dd className="order-1 display text-3xl font-medium">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
