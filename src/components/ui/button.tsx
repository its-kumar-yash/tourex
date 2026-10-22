import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "accent" | "soft" | "outline" | "ghost";
type Size = "xs" | "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] font-medium transition-[background-color,color,box-shadow,transform] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-maroon text-white shadow-sm hover:bg-maroon-dark",
  accent: "bg-saffron-dark text-white shadow-sm hover:bg-saffron-deep",
  soft: "bg-sky text-ink hover:bg-[#fbd3a2]",
  outline: "border border-line bg-white text-ink hover:border-sky-deep hover:bg-cloud",
  ghost: "text-ink hover:bg-cloud",
};

const sizes: Record<Size, string> = {
  xs: "h-8 px-3 text-xs",
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type SharedProps = { variant?: Variant; size?: Size; className?: string };

export function buttonClasses({ variant = "primary", size = "md", className = "" }: SharedProps) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`animate-spin ${className}`} fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Button({
  variant,
  size,
  className,
  loading = false,
  children,
  disabled,
  ...props
}: SharedProps & ComponentProps<"button"> & { loading?: boolean }) {
  return (
    <button
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, className, ...props }: SharedProps & ComponentProps<typeof Link>) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
