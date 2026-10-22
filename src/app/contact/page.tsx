import type { Metadata } from "next";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Call, WhatsApp or email us about any package or a custom trip. We reply within a working day.",
};

const cards = [
  { icon: PhoneIcon, label: "Call us", value: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, "")}` },
  { icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with our team", href: `https://wa.me/${site.contact.whatsapp}`, external: true },
  { icon: MailIcon, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
  { icon: ClockIcon, label: "Office hours", value: site.contact.hours },
] as const;

export default function ContactPage() {
  return (
    <div className="px-4 py-14 sm:px-8 sm:py-20">
      <SectionHeading as="h1" kicker="नमस्ते" title="Contact us" subtitle="Questions about a package, or want a custom itinerary? We reply within a working day." />

      {/* auto-fit with a 240px minimum: cards wrap instead of squeezing, and long
          values like the email break inside their own card. */}
      <ul className="mx-auto mt-12 grid max-w-5xl gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {cards.map((c) => {
          const Icon = c.icon;
          const inner = (
            <>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky text-maroon">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-ink-soft">{c.label}</span>
                <span className="block font-medium [overflow-wrap:anywhere]">{c.value}</span>
              </span>
            </>
          );
          return (
            <li key={c.label} className="min-w-0">
              {"href" in c ? (
                <a
                  href={c.href}
                  {...("external" in c ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex h-full items-start gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 transition-shadow hover:shadow-[var(--shadow-card)]"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex h-full items-start gap-4 rounded-[var(--radius-card)] border border-line bg-cloud p-5">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mx-auto mt-6 flex max-w-5xl flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-cloud p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-3">
          <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-maroon" />
          <span>
            <span className="block text-sm text-ink-soft">Office</span>
            <span className="font-medium">{site.contact.address}</span>
          </span>
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.contact.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses({ variant: "outline", size: "sm", className: "self-start sm:self-auto" })}
        >
          Open in Maps
        </a>
      </div>
    </div>
  );
}
