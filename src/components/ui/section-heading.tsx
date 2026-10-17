export function SectionHeading({
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Tag className="display text-3xl font-medium sm:text-4xl">{title}</Tag>
      {subtitle && <p className="mt-3 text-ink-soft">{subtitle}</p>}
    </div>
  );
}
