import { site } from "@/content/site";
import { GuideIcon, RouteIcon, ShieldIcon } from "@/components/ui/icons";

const icons = { route: RouteIcon, guide: GuideIcon, shield: ShieldIcon };

export function Features() {
  return (
    <section className="border-y border-line bg-cloud px-4 py-14 sm:px-8">
      <ul className="grid gap-10 text-center sm:grid-cols-3">
        {site.features.map((f) => {
          const Icon = icons[f.icon];
          return (
            <li key={f.title} className="mx-auto max-w-xs">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{f.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
