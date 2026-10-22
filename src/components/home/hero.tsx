import Image from "next/image";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { SearchCard } from "./search-card";

const HERO_IMAGE = "https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=70";

export function Hero({ locations }: { locations: string[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-maroon text-white">
      <Image src={HERO_IMAGE} alt="The Taj Mahal framed by a carved red sandstone arch" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#2b0d14]/85 via-[#2b0d14]/50 to-[#2b0d14]/10" />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 px-4 pb-12 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:pb-20">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm backdrop-blur">
            <span className="font-display text-base text-marigold">{site.hero.kicker}</span>
            <span className="text-white/80">· {site.hero.kickerMeaning}</span>
          </p>
          <h1 className="display mt-5 text-5xl sm:text-6xl lg:text-7xl">
            {site.hero.title[0]}
            <br />
            <span className="text-marigold">{site.hero.title[1]}</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-white/85 sm:text-lg">{site.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/packages" variant="accent" size="lg" className="pr-2">
              Explore packages
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <ArrowUpRightIcon className="h-5 w-5" />
              </span>
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" size="lg" className="text-white hover:bg-white/10">
              Plan a custom trip
            </ButtonLink>
          </div>
        </div>

        <div className="text-ink">
          <SearchCard locations={locations} />
        </div>
      </div>
    </section>
  );
}
