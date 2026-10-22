import { getHomePackages, getLocations } from "@/lib/data/packages";
import { Hero } from "@/components/home/hero";
import { Statement } from "@/components/home/statement";
import { About } from "@/components/home/about";
import { Destinations } from "@/components/home/destinations";
import { Features } from "@/components/home/features";
import { Cta } from "@/components/home/cta";

export const revalidate = 3600;

export default async function HomePage() {
  const [packages, locations] = await Promise.all([getHomePackages(5), getLocations()]);
  return (
    <>
      <Hero locations={locations} />
      <Statement />
      <Destinations packages={packages} />
      <About />
      <Features />
      <Cta />
    </>
  );
}
