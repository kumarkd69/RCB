/**
 * Converts src/content/seed.ts into sanity/seed/seed.ndjson for `sanity dataset import`.
 * Photos are included: the import uploads every file in public/ that the sample data uses,
 * so the Studio starts with the same filled-in site you see locally.
 *
 * Run: npm run seed   (needs NEXT_PUBLIC_SANITY_PROJECT_ID and `npx sanity login`)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import * as seed from "../src/content/seed.ts";
import type { Img } from "../src/lib/types.ts";

const docs: Record<string, unknown>[] = [];
const ref = (id: string) => ({ _type: "reference", _ref: id });
const slug = (s: string) => ({ _type: "slug", current: s });
const chapterId = (s?: string) => (s ? `chapter-${s}` : undefined);
const clean = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null));
let k = 0;
const key = () => `k${(k++).toString(36)}`;
const day = (iso?: string) => iso?.slice(0, 10);

/** Local image → Sanity image field with an upload instruction for `dataset import`. */
const image = (img: Img | undefined) =>
  img?.src ? { _type: "image", _sanityAsset: `image@file://${resolve("public" + img.src)}`, alt: img.alt } : undefined;

const s = seed.settings;
docs.push(clean({
  _id: "siteSettings", _type: "siteSettings",
  tagline: s.tagline, intro: s.intro, stats: s.stats, mission: s.mission, vision: s.vision, values: s.values, story: s.story,
  whatsappLink: s.whatsappLink, contactEmail: s.contactEmail, contactPhone: s.contactPhone,
  recognition: clean({ title: s.recognition.title, note: s.recognition.note, badge: image(s.recognition.badge), proof: image(s.recognition.proof) }),
  pillars: s.pillars.map((p) => clean({ _key: key(), title: p.title, description: p.description, icon: p.icon, frequency: p.frequency, image: image(p.image) })),
  trophies: s.trophies.map((t) => ({ _key: key(), ...t })),
  highlights: s.highlights.map((h) => clean({ _key: key(), caption: h.caption, videoUrl: h.videoUrl, image: image(h.image) })),
  glory: s.glory.map((g) => clean({ _key: key(), title: g.title, year: g.year, league: g.league, image: image(g.image) })),
}));

for (const m of seed.team) {
  docs.push(clean({ _id: `member-${m._id}`, _type: "teamMember", name: m.name, role: m.role, isCore: m.isCore, order: m.order, socials: m.socials, photo: image(m.photo), chapter: m.chapter ? ref(chapterId(m.chapter.slug)!) : undefined }));
}
for (const c of seed.chapters) {
  const lead = seed.team.find((t) => t.name === c.lead?.name);
  docs.push(clean({ _id: chapterId(c.slug), _type: "chapter", name: c.name, slug: slug(c.slug), city: c.city, lat: c.lat, lng: c.lng, instagram: c.instagram, memberCount: c.memberCount, about: c.about, screeningVenue: c.screeningVenue, cover: image(c.cover), lead: lead ? ref(`member-${lead._id}`) : undefined }));
}
for (const e of seed.events) {
  docs.push(clean({
    _id: `event-${e.slug}`, _type: "event", title: e.title, slug: slug(e.slug), date: e.date, endDate: e.endDate, venue: e.venue, mapUrl: e.mapUrl,
    type: e.type, league: e.league, opponent: e.opponent, summary: e.summary, description: e.description, rsvpUrl: e.rsvpUrl?.startsWith("http") ? e.rsvpUrl : undefined, recap: e.recap,
    cover: image(e.cover),
    chapter: e.chapter ? ref(chapterId(e.chapter.slug)!) : undefined,
    schedule: e.schedule?.map((x) => ({ _key: key(), ...x })),
    impactStats: e.impactStats?.map((x) => ({ _key: key(), ...x })),
  }));
}
for (const a of seed.albums) {
  docs.push(clean({
    _id: `album-${a.eventSlug ?? a._id}`, _type: "album", title: a.title, date: day(a.date),
    chapter: a.chapter ? ref(chapterId(a.chapter.slug)!) : undefined,
    event: a.eventSlug ? ref(`event-${a.eventSlug}`) : undefined,
    items: a.items.map((it) => ({ _key: key(), ...image(it.image)! })),
  }));
}
for (const i of seed.initiatives) docs.push(clean({ _id: `initiative-${i._id}`, _type: "initiative", title: i.title, summary: i.summary, impact: i.impact, chapter: i.chapter ? ref(chapterId(i.chapter.slug)!) : undefined }));
for (const m of seed.milestones) docs.push(clean({ _id: `milestone-${m._id}`, _type: "milestone", year: m.year, title: m.title, description: m.description }));
seed.faqs.forEach((f, i) => docs.push({ _id: `faq-${f._id}`, _type: "faq", question: f.question, answer: f.answer, order: i + 1 }));

mkdirSync("sanity/seed", { recursive: true });
writeFileSync("sanity/seed/seed.ndjson", docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents to sanity/seed/seed.ndjson`);
