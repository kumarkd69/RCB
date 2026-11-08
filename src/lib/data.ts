import "server-only";
import { cache } from "react";
import { sanityEnabled } from "./sanity/env";
import { sanityFetch } from "./sanity/client";
import * as q from "./sanity/queries";
import * as seed from "@/content/seed";
import type { Album, Chapter, ClubEvent, Faq, GalleryItem, Initiative, Milestone, SiteSettings, TeamMember } from "./types";

/** Try Sanity; fall back to sample data when not configured or on error. */
async function load<T>(query: string, fallback: T, tags: string[], params = {}): Promise<T> {
  if (!sanityEnabled) return fallback;
  try {
    const res = await sanityFetch<T>(query, params, tags);
    return (res ?? fallback) as T;
  } catch (e) {
    console.error("[sanity] fetch failed, using sample data", e);
    return fallback;
  }
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const s = await load<Partial<SiteSettings> | null>(q.settingsQuery, seed.settings, ["siteSettings"]);
  // merge so missing fields never crash the UI
  return { ...seed.settings, ...(s ?? {}), stats: { ...seed.settings.stats, ...(s?.stats ?? {}) }, recognition: { ...seed.settings.recognition, ...(s?.recognition ?? {}) }, pillars: s?.pillars?.length ? s.pillars : seed.settings.pillars, highlights: s?.highlights?.length ? s.highlights : seed.settings.highlights, values: s?.values?.length ? s.values : seed.settings.values } as SiteSettings;
});

export const getEvents = cache(() => load<ClubEvent[]>(q.eventsQuery, seed.events, ["event", "chapter"]));
export const getEvent = cache(async (slug: string) => (await getEvents()).find((e) => e.slug === slug) ?? null);

/** Events auto-move from Upcoming to Past once their end (or start + 6h) has passed. */
export function splitEvents(events: ClubEvent[], now = Date.now()) {
  const end = (e: ClubEvent) => new Date(e.endDate ?? e.date).getTime() + (e.endDate ? 0 : 6 * 3600_000);
  const upcoming = events.filter((e) => end(e) >= now).sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const past = events.filter((e) => end(e) < now).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return { upcoming, past };
}

export const getTeam = cache(() => load<TeamMember[]>(q.teamQuery, seed.team, ["teamMember", "chapter"]));
export const getChapters = cache(() => load<Chapter[]>(q.chaptersQuery, seed.chapters, ["chapter", "teamMember"]));
export const getChapter = cache(async (slug: string) => (await getChapters()).find((c) => c.slug === slug) ?? null);
export const getInitiatives = cache(() => load<Initiative[]>(q.initiativesQuery, seed.initiatives, ["initiative"]));
export const getMilestones = cache(() => load<Milestone[]>(q.milestonesQuery, seed.milestones, ["milestone"]));
export const getFaqs = cache(() => load<Faq[]>(q.faqsQuery, seed.faqs, ["faq"]));

type RawAlbum = Omit<Album, "items"> & { eventTitle?: string; items?: { _key: string; _type: string; src?: string; alt?: string; width?: number; height?: number; blur?: string; url?: string }[] };

export const getAlbums = cache(async (): Promise<Album[]> => {
  if (!sanityEnabled) return seed.albums;
  const raw = await load<RawAlbum[]>(q.albumsQuery, [], ["album", "event", "chapter"]);
  const events = await getEvents();
  const fromAlbums: Album[] = raw.map((a) => ({
    ...a,
    items: (a.items ?? []).map((it): GalleryItem => ({
      id: it._key,
      kind: it._type === "video" ? "video" : "photo",
      image: it.src ? { src: it.src, alt: it.alt ?? "", width: it.width, height: it.height, blur: it.blur } : null,
      videoUrl: it.url,
      ratio: it.width && it.height ? it.width / it.height : 1,
      chapterSlug: a.chapter?.slug,
      eventSlug: a.eventSlug,
      eventTitle: a.eventTitle ?? a.title,
      year: a.date ? new Date(a.date).getFullYear() : undefined,
    })),
  }));
  // Event galleries also appear as albums automatically
  const fromEvents: Album[] = events.filter((e) => e.gallery?.length).map((e) => ({
    _id: "ev-album-" + e._id, title: e.title, date: e.date, chapter: e.chapter, eventSlug: e.slug,
    items: e.gallery!.filter(Boolean).map((g, i): GalleryItem => ({
      id: `${e._id}-${i}`, kind: "photo", image: g, ratio: g?.width && g?.height ? g.width / g.height : 1,
      chapterSlug: e.chapter?.slug, eventSlug: e.slug, eventTitle: e.title, year: new Date(e.date).getFullYear(),
    })),
  }));
  return [...fromAlbums, ...fromEvents];
});
