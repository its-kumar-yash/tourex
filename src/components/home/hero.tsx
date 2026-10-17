import Image from "next/image";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { SearchCard } from "./search-card";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&q=70";

export function Hero({
  countries,
  today,
  defaultCheckIn,
}: {
  countries: string[];
  today: string;
  defaultCheckIn: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />

      <div className="relative grid gap-10 px-4 pb-10 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1fr_380px] lg:items-center lg:pb-20">
        <div>
          <h1 className="display text-5xl font-medium sm:text-6xl lg:text-7xl">
            {site.hero.title[0]}
            <br />
            {site.hero.title[1]}
          </h1>
          <p className="mt-5 max-w-md text-base text-white/85 sm:text-lg">{site.hero.subtitle}</p>
          <ButtonLink href="/packages" variant="soft" size="lg" className="mt-8 pr-1.5">
            Take a tour
            <span className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
              <ArrowUpRightIcon className="h-5 w-5" />
            </span>
          </ButtonLink>
        </div>

        <div className="text-ink">
          <SearchCard countries={countries} today={today} defaultCheckIn={defaultCheckIn} />
        </div>
      </div>
    </section>
  );
}
