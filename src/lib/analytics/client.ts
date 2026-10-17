/** Browser-side helpers for first-party analytics. No PII is collected. */

const SID_COOKIE = "dt_sid";
const SID_TTL_MIN = 30;

export function getSessionId(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${SID_COOKIE}=([^;]+)`));
  const id = match?.[1] ?? (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36));
  // Sliding 30-minute window, like a GA session.
  document.cookie = `${SID_COOKIE}=${id}; Max-Age=${SID_TTL_MIN * 60}; Path=/; SameSite=Lax`;
  return id;
}

export function getDevice(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  return w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
}

export type TrackEvent = "page_view" | "package_view" | "booking_started";

export function track(event: TrackEvent, path: string, packageId?: string) {
  if (typeof navigator !== "undefined" && navigator.webdriver) return;
  const body = JSON.stringify({
    event,
    path,
    package_id: packageId ?? null,
    session_id: getSessionId(),
    device: getDevice(),
    referrer: document.referrer ? new URL(document.referrer).hostname : null,
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    // analytics must never break the page
  }
}
