import { Divider } from "./motifs";

export function SectionHeading({
  title,
  subtitle,
  kicker,
  align = "center",
  as: Tag = "h2",
}: {
  title: string;
  subtitle?: string;
  kicker?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {kicker && <p className="font-display text-lg text-saffron-deep">{kicker}</p>}
      <Tag className="display text-3xl sm:text-4xl">{title}</Tag>
      <Divider className={`mt-3 ${align === "center" ? "" : ""}`} />
      {subtitle && <p className="mt-2 text-ink-soft">{subtitle}</p>}
    </div>
  );
}
