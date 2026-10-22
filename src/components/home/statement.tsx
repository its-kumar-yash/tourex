import Image from "next/image";
import { site } from "@/content/site";
import { Mandala } from "@/components/ui/motifs";

const PILLS = [
  { src: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&q=70", alt: "Houseboat on the Kerala backwaters" },
  { src: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=70", alt: "Hawa Mahal in Jaipur" },
];

function Pill({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative mx-1 inline-block h-[0.85em] w-[2.1em] overflow-hidden rounded-full align-[-0.1em] ring-2 ring-sky">
      <Image src={src} alt={alt} fill sizes="160px" className="object-cover" />
    </span>
  );
}

export function Statement() {
  return (
    <section className="relative overflow-hidden px-4 py-16 text-center sm:px-8 sm:py-24">
      <Mandala className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 text-sky-deep/25 sm:h-96 sm:w-96" />
      <Mandala className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 text-sky-deep/25 sm:h-96 sm:w-96" />
      <p className="display relative mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
        From the backwaters <Pill {...PILLS[0]} /> to the palaces <Pill {...PILLS[1]} /> of Rajasthan, India is waiting.
      </p>
      <p className="relative mx-auto mt-8 max-w-xl text-ink-soft">{site.about.body}</p>
    </section>
  );
}
