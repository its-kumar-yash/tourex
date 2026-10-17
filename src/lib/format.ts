const priceFormatters = new Map<string, Intl.NumberFormat>();

/** "₹24,999" from minor units. Whole units only; packages are priced in whole rupees. */
export function formatPrice(minor: number, currency = "INR") {
  let fmt = priceFormatters.get(currency);
  if (!fmt) {
    fmt = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    priceFormatters.set(currency, fmt);
  }
  return fmt.format(minor / 100);
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** "Sun, 12 Feb 2026" from an ISO date (yyyy-mm-dd). */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return dateFmt.format(new Date(Date.UTC(y, m - 1, d, 12)));
}

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return toISODate(new Date(Date.UTC(y, m - 1, d + days, 12)));
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
