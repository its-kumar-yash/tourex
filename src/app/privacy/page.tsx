import type { Metadata } from "next";
import { BRAND } from "@/components/logo";
import { site } from "@/content/site";
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";

export const metadata: Metadata = {
  title: "Privacy and cookies",
  description: `How ${BRAND} uses personal data and cookies.`,
};

// Plain-language starting point. Have it reviewed before relying on it legally.
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8 sm:py-24">
      <h1 className="display text-4xl font-medium sm:text-5xl">Privacy and cookies</h1>
      <p className="mt-4 text-ink-soft">Last updated 22 October 2026.</p>

      <div className="mt-10 space-y-8 leading-relaxed text-ink-soft">
        <section>
          <h2 className="text-xl font-medium text-ink">What we collect</h2>
          <p className="mt-2">
            When you create an account we store your name, email address and, if you give it, your
            phone number. When you request a booking we store the package, dates, number of guests
            and the contact details you enter, so we can confirm the trip with you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-ink">Cookies</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-ink">Essential.</span> Keep you signed in, protect
              forms, and count visits anonymously with a 30-minute session id that holds no personal
              data. These are always on because the site needs them.
            </li>
            <li>
              <span className="font-medium text-ink">Analytics.</span> Google Analytics cookies that
              measure how visitors use the site. Only set if you accept analytics.
            </li>
            <li>
              <span className="font-medium text-ink">Marketing.</span> Allow Google to use data for
              advertising and personalisation. Only set if you accept marketing.
            </li>
          </ul>
          <p className="mt-3">
            Until you choose, Google receives only cookieless signals without identifiers. You can
            change your choice at any time: <CookieSettingsButton />.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-ink">Who we share it with</h2>
          <p className="mt-2">
            Our hosting and database providers process data on our behalf. Google receives analytics
            data only as described above. We do not sell personal data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-ink">Your rights</h2>
          <p className="mt-2">
            You can ask us to see, correct or delete your data. Email{" "}
            <a href={`mailto:${site.contact.email}`} className="text-ink underline underline-offset-2">
              {site.contact.email}
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
