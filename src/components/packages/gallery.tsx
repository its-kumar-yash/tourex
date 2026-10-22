"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Tables } from "@/lib/supabase/types";

type Img = Tables<"package_images">;

/**
 * Mobile: swipeable full-width strip with a counter.
 * Tablet and up: one large photo plus up to four tiles, laid out by how many
 * photos exist so nothing is cropped into slivers or pushed off-screen.
 * Any photo opens a full-screen viewer with keyboard and swipe support.
 */
export function Gallery({ images, title }: { images: Img[]; title: string }) {
  const [viewer, setViewer] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const strip = useRef<HTMLUListElement>(null);

  if (images.length === 0) return <div className="aspect-[16/9] rounded-[var(--radius-card)] bg-cloud" />;

  const tiles = images.slice(1, 5);
  const desktopCols = tiles.length === 0 ? "md:grid-cols-1" : tiles.length <= 2 ? "md:grid-cols-3" : "md:grid-cols-4";

  return (
    <>
      {/* Mobile strip */}
      <div className="relative md:hidden">
        <ul
          ref={strip}
          onScroll={(e) => {
            const el = e.currentTarget;
            setSlide(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-[var(--radius-card)] [scrollbar-width:none]"
        >
          {images.map((img, i) => (
            <li key={img.id} className="relative aspect-[4/3] w-full shrink-0 snap-center bg-cloud">
              <button type="button" className="absolute inset-0" onClick={() => setViewer(i)} aria-label={`Open photo ${i + 1} of ${images.length}`}>
                <Image src={img.url} alt={img.alt || title} fill priority={i === 0} sizes="100vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
        {images.length > 1 && (
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs text-white">
            {slide + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Tablet and desktop grid */}
      <div className={`hidden h-[440px] gap-2 md:grid md:grid-rows-2 ${desktopCols}`}>
        {images.slice(0, 5).map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setViewer(i)}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
            className={`group relative overflow-hidden bg-cloud ${
              i === 0 ? `row-span-2 rounded-l-[var(--radius-card)] ${tiles.length === 0 ? "rounded-r-[var(--radius-card)]" : "col-span-2"}` : ""
            } ${tiles.length === 1 && i === 1 ? "row-span-2 rounded-r-[var(--radius-card)]" : ""} ${
              i > 0 && tiles.length > 1 ? "rounded-xl" : ""
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt || title}
              fill
              priority={i === 0}
              sizes={i === 0 ? "(min-width: 1024px) 50vw, 66vw" : "25vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {i === 4 && images.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-medium text-white">+{images.length - 5} more</span>
            )}
          </button>
        ))}
      </div>

      {viewer !== null && <Viewer images={images} title={title} start={viewer} onClose={() => setViewer(null)} />}
    </>
  );
}

function Viewer({ images, title, start, onClose }: { images: Img[]; title: string; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const touchX = useRef<number | null>(null);
  const go = useCallback((d: number) => setI((v) => (v + d + images.length) % images.length), [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const img = images[i];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="fixed inset-0 z-[70] flex flex-col bg-black/92 text-white"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-sm">
        <span>{i + 1} / {images.length}</span>
        <button type="button" onClick={onClose} autoFocus className="rounded-full px-3 py-1.5 hover:bg-white/10">Close ✕</button>
      </div>
      <div className="relative flex-1">
        <Image src={img.url} alt={img.alt || title} fill sizes="100vw" className="object-contain" />
        {images.length > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-xl hover:bg-white/25">‹</button>
            <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-xl hover:bg-white/25">›</button>
          </>
        )}
      </div>
      {img.alt && <p className="px-4 py-3 text-center text-sm text-white/80">{img.alt}</p>}
    </div>
  );
}
