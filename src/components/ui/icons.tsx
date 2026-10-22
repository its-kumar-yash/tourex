import type { ComponentProps } from "react";

type Props = ComponentProps<"svg">;
const base = (p: Props) => ({
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const PinIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 21s-6-5.7-6-11a6 6 0 1 1 12 0c0 5.3-6 11-6 11Z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);
export const CalendarIcon = (p: Props) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);
export const UserIcon = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);
export const ClockIcon = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const ArrowUpRightIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);
export const ArrowLeftIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);
export const PlaneIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M10.5 13.5 3 11l1.5-1.5 7 1.5 5-5a1.6 1.6 0 1 1 2.3 2.3l-5 5 1.5 7L13.5 21l-3-7.5Z" />
  </svg>
);
export const FlightIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M2.5 16.5 21 9l-2.5-1.5-6.5 2L7 6 5 7l3 4-4.5 2 1.5 2.5 4.5-1 2.5 4 1.5-1-1-4.5Z" />
  </svg>
);
export const HotelIcon = (p: Props) => (
  <svg {...base(p)}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" />
  </svg>
);
export const RouteIcon = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <path d="M8.5 18H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.5" />
  </svg>
);
export const GuideIcon = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="7" r="3.5" />
    <path d="M5 21a7 7 0 0 1 14 0M12 14v3M9.5 16.5 12 19l2.5-2.5" />
  </svg>
);
export const ShieldIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" />
    <path d="m9.5 12 1.8 1.8 3.5-3.6" />
  </svg>
);
export const SearchIcon = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4-4" />
  </svg>
);
export const HeartIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
);
export const RupeeIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M7 5h10M7 9h10M7 5h3.5a4 4 0 0 1 0 8H7l7 6" />
  </svg>
);
export const PhoneIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M5 4h3l1.5 4-2 1.2a11 11 0 0 0 5.3 5.3l1.2-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const MailIcon = (p: Props) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const WhatsAppIcon = (p: Props) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
  </svg>
);
export const ClockSmallIcon = ClockIcon;
