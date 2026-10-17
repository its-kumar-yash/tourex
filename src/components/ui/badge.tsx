export function Badge({
  children,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark" | "sky";
  className?: string;
}) {
  const tones = {
    light: "bg-white/90 text-ink",
    dark: "bg-ink text-white",
    sky: "bg-sky text-ink",
  };
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
