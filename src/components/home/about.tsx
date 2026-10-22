import Image from "next/image";
import { site } from "@/content/site";

const IMAGE = "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&q=70";

export function About() {
  return (
    <section className="grid gap-10 px-4 pb-16 sm:px-8 sm:pb-24 md:grid-cols-2 md:items-center">
      {/* Jharokha arch frame */}
      <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-b-3xl rounded-t-[999px] border-[6px] border-sky bg-cloud shadow-[var(--shadow-card)]">
        <Image src={IMAGE} alt="Amer Fort in Jaipur above Maota Lake" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
      </div>
      <div>
        <p className="font-display text-lg text-saffron-deep">{site.about.kicker}</p>
        <h2 className="display mt-1 text-3xl sm:text-4xl">{site.about.title}</h2>
        <p className="mt-4 text-ink-soft">{site.about.body}</p>
        <dl className="mt-8 grid grid-cols-3 gap-3">
          {site.about.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-cloud p-4 text-center">
              <dd className="display text-3xl text-maroon">{s.value}</dd>
              <dt className="mt-1 text-xs text-ink-soft sm:text-sm">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
