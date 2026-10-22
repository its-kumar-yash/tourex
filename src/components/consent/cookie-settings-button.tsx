"use client";

import { openConsentSettings } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <button type="button" onClick={openConsentSettings} className="underline-offset-4 hover:text-ink hover:underline">
      Cookie settings
    </button>
  );
}
