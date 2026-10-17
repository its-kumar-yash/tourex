import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="px-4 py-16 text-center sm:px-8 sm:py-24">
      <h2 className="display text-3xl font-medium sm:text-4xl">{site.cta.title}</h2>
      <p className="mx-auto mt-4 max-w-lg text-ink-soft">{site.cta.body}</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/packages" size="lg">
          Browse packages
        </ButtonLink>
        <ButtonLink href="/contact" variant="outline" size="lg">
          Talk to us
        </ButtonLink>
      </div>
    </section>
  );
}
