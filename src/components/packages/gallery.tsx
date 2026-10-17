import Image from "next/image";
import type { Tables } from "@/lib/supabase/types";

export function Gallery({
  images,
  title,
}: {
  images: Tables<"package_images">[];
  title: string;
}) {
  const [first, ...rest] = images;
  if (!first) {
    return <div className="aspect-[16/9] rounded-[var(--radius-card)] bg-cloud" />;
  }
  const thumbs = rest.slice(0, 4);

  return (
    <div className="grid gap-2 md:grid-cols-[2fr_1fr] md:grid-rows-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-cloud md:row-span-2 md:aspect-auto md:min-h-[420px]">
        <Image
          src={first.url}
          alt={first.alt || title}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>
      {thumbs.length > 0 && (
        <ul className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 md:col-start-2 md:row-span-2 md:mx-0 md:grid md:grid-rows-2 md:overflow-visible md:px-0">
          {thumbs.map((img) => (
            <li
              key={img.id}
              className="relative aspect-[4/3] w-40 shrink-0 snap-start overflow-hidden rounded-2xl bg-cloud md:w-auto md:min-h-[204px]"
            >
              <Image
                src={img.url}
                alt={img.alt || title}
                fill
                sizes="(min-width: 1024px) 30vw, 160px"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
