import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getAllPackageSlugs } from "@/lib/data/packages";

export const revalidate = 3600;

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl.replace(/\/$/, "");
  const packages = await getAllPackageSlugs();
  const latest = packages.reduce<string | undefined>(
    (max, p) => (!max || p.updated_at > max ? p.updated_at : max),
    undefined,
  );
  return [
    { url: `${base}/`, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/packages`, lastModified: latest, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ...packages.map((p) => ({
      url: `${base}/packages/${p.slug}`,
      lastModified: p.updated_at,
      // Next.js writes image URLs into the XML unescaped, and Unsplash URLs carry
      // `&`, which makes the whole sitemap unparseable for Google.
      images: p.cover_image_url ? [xmlEscape(p.cover_image_url)] : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
