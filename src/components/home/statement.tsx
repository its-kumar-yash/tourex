import Image from "next/image";
import { site } from "@/content/site";

const PILLS = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=70",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=70",
];

function Pill({ src }: { src: string }) {
  return (
    <span className="relative mx-1 inline-block h-[0.9em] w-[2.2em] overflow-hidden rounded-full align-[-0.12em]">
      <Image src={src} alt="" fill sizes="200px" className="object-cover" />
    </span>
  );
}

export function Statement() {
  return (
    <section className="px-4 py-16 text-center sm:px-8 sm:py-24">
      <p className="display mx-auto max-w-4xl text-4xl font-medium sm:text-5xl lg:text-6xl">
        Take the step and explore <Pill src={PILLS[0]} /> the world <Pill src={PILLS[1]} /> waiting
        for you.
      </p>
      <p className="mx-auto mt-8 max-w-xl text-ink-soft">{site.about.body}</p>
    </section>
  );
}
