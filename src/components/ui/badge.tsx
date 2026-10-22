export function Badge({
  children,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark" | "sky" | "saffron";
  className?: string;
}) {
  const tones = {
    light: "bg-white/95 text-ink",
    dark: "bg-maroon text-white",
    sky: "bg-sky text-ink",
    saffron: "bg-saffron-deep text-white",
  };
  return (
    <span className={`inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 text-xs font-medium shadow-sm ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
