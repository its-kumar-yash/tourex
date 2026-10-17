import { ButtonLink } from "@/components/ui/button";

/**
 * Phase 0 placeholder. The full home page (hero with search card, stats,
 * destination grid, features, CTA) lands in Phase 2.
 */
export default function HomePage() {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24">
      <h1 className="display max-w-3xl text-5xl font-medium sm:text-7xl">
        Let’s find your next adventure
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        Hand-picked tour packages to the world’s most beautiful places. Browse
        destinations, compare prices and reserve your trip.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/packages" variant="soft" size="lg">
          Take a tour
        </ButtonLink>
        <ButtonLink href="/login" variant="outline" size="lg">
          Sign In
        </ButtonLink>
      </div>
    </section>
  );
}
