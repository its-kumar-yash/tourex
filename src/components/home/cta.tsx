import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Mandala } from "@/components/ui/motifs";

export function Cta() {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-maroon px-6 py-14 text-center text-white sm:px-12">
        <Mandala className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 text-marigold/25" />
        <Mandala className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 text-marigold/20" />
        <p className="relative font-display text-xl text-marigold">{site.cta.kicker}</p>
        <h2 className="display relative mt-1 text-3xl sm:text-5xl">{site.cta.title}</h2>
        <p className="relative mx-auto mt-4 max-w-lg text-white/85">{site.cta.body}</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/packages" variant="accent" size="lg">Browse packages</ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
            Talk to us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
