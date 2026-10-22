import Script from "next/script";
import { CONSENT_KEY, CONSENT_VERSION } from "@/lib/consent";

/**
 * Google tag with Consent Mode v2 (advanced mode). The consent default is
 * pushed before `config`, so nothing is stored until the visitor agrees; a
 * returning visitor's saved choice is applied as the default to avoid a
 * denied-then-granted flicker. Until consent, Google receives cookieless
 * pings only.
 */
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const init = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var c = null;
try { c = JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)})); } catch (e) {}
if (!c || c.v !== ${CONSENT_VERSION}) c = null;
var a = c && c.analytics ? 'granted' : 'denied';
var m = c && c.marketing ? 'granted' : 'denied';
gtag('consent', 'default', {
  analytics_storage: a,
  ad_storage: m,
  ad_user_data: m,
  ad_personalization: m,
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', m === 'denied');
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)});
`;
  return (
    <>
      <Script id="ga-consent-init" strategy="afterInteractive">
        {init}
      </Script>
      <Script
        id="ga-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        strategy="afterInteractive"
      />
    </>
  );
}
