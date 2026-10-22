import { formatPrice } from "@/lib/format";

/** Phones only: price and a Reserve button always in reach; jumps to the booking card. */
export function MobileReserveBar({ priceMinor, currency }: { priceMinor: number; currency: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgb(91_40_20/0.25)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <p className="text-xs text-ink-soft">
          From
          <span className="block text-lg font-semibold text-maroon">{formatPrice(priceMinor, currency)}</span>
        </p>
        <a href="#reserve" className="inline-flex h-11 items-center rounded-full bg-maroon px-6 text-sm font-medium text-white shadow-sm hover:bg-maroon-dark">
          Reserve now
        </a>
      </div>
    </div>
  );
}
