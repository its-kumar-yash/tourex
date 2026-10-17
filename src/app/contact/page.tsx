import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Call, email or write to us about any package or a custom trip.",
};

export default function ContactPage() {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24">
      <h1 className="display text-4xl font-medium sm:text-6xl">Contact us</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        Questions about a package, or want a custom itinerary? We reply within a working day.
      </p>
      <dl className="mt-10 grid max-w-2xl gap-6 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-ink-soft">Email</dt>
          <dd className="mt-1 font-medium">
            <a href={`mailto:${site.contact.email}`} className="hover:underline">
              {site.contact.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-soft">Phone</dt>
          <dd className="mt-1 font-medium">
            <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="hover:underline">
              {site.contact.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-soft">Office</dt>
          <dd className="mt-1 font-medium">{site.contact.address}</dd>
        </div>
      </dl>
    </section>
  );
}
