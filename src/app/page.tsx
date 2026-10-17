import { getCountries, getHomePackages } from "@/lib/data/packages";
import { addDays, toISODate } from "@/lib/format";
import { Hero } from "@/components/home/hero";
import { Statement } from "@/components/home/statement";
import { About } from "@/components/home/about";
import { Destinations } from "@/components/home/destinations";
import { Features } from "@/components/home/features";
import { Cta } from "@/components/home/cta";

export const revalidate = 3600;

export default async function HomePage() {
  const [packages, countries] = await Promise.all([getHomePackages(5), getCountries()]);
  const today = toISODate(new Date());

  return (
    <>
      <Hero countries={countries} today={today} defaultCheckIn={addDays(today, 7)} />
      <Statement />
      <About />
      <Destinations packages={packages} />
      <Features />
      <Cta />
    </>
  );
}
