import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "soft" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-black",
  soft: "bg-sky text-ink hover:bg-sky-deep/60",
  outline: "border border-line bg-white text-ink hover:bg-cloud",
  ghost: "text-ink hover:bg-cloud",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type SharedProps = { variant?: Variant; size?: Size; className?: string };

export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: SharedProps) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export function Button({
  variant,
  size,
  className,
  ...props
}: SharedProps & ComponentProps<"button">) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...props} />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: SharedProps & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props} />
  );
}
