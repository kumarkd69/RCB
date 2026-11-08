import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { getChapters, getEvents } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, chapters] = await Promise.all([getEvents(), getChapters()]);
  const now = new Date();
  return [
    ...["", "/about", "/chapters", "/events", "/gallery", "/join"].map((p) => ({ url: `${site.url}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p ? 0.8 : 1 })),
    ...chapters.map((c) => ({ url: `${site.url}/chapters/${c.slug}`, lastModified: now, priority: 0.6 })),
    ...events.map((e) => ({ url: `${site.url}/events/${e.slug}`, lastModified: new Date(e.date), priority: 0.7 })),
  ];
}
