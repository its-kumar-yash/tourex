/**
 * Visitor cookie consent, stored in localStorage and mirrored to Google
 * Consent Mode v2. Bump CONSENT_VERSION when the categories or the privacy
 * page change materially, so everyone is asked again.
 */
export const CONSENT_KEY = "dt_consent";
export const CONSENT_VERSION = 1;
export const OPEN_CONSENT_EVENT = "dt:open-consent";

export type Consent = {
  analytics: boolean;
  marketing: boolean;
  v: number;
  ts: string;
};

type Gtag = (...args: unknown[]) => void;

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    return c.v === CONSENT_VERSION ? c : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }): Consent {
  const consent: Consent = { ...choice, v: CONSENT_VERSION, ts: new Date().toISOString() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // private mode: the choice still applies for this page view
  }
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("consent", "update", toConsentMode(consent));
  if (!consent.analytics) clearGoogleAnalyticsCookies();
  return consent;
}

/** Withdrawing consent removes cookies GA already set, on this host and its parent domains. */
function clearGoogleAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter((n) => n === "_ga" || n.startsWith("_ga_") || n === "_gid");
  const parts = location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join(".")}`);
  for (const name of names) {
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; Path=/${d}`;
  }
}

export function toConsentMode(c: { analytics: boolean; marketing: boolean }) {
  const a = c.analytics ? "granted" : "denied";
  const m = c.marketing ? "granted" : "denied";
  return { analytics_storage: a, ad_storage: m, ad_user_data: m, ad_personalization: m };
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
