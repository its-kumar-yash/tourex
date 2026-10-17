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
