import { site } from "@/content/site";
import { GuideIcon, HeartIcon, RupeeIcon, ShieldIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";

const icons = { guide: GuideIcon, heart: HeartIcon, rupee: RupeeIcon, shield: ShieldIcon };

export function Features() {
  return (
    <section className="border-y border-line bg-cloud px-4 py-16 sm:px-8">
      <SectionHeading kicker="क्यों हम" title="Why travel with us" />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {site.features.map((f) => {
          const Icon = icons[f.icon];
          return (
            <li key={f.title} className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky text-maroon">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{f.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
