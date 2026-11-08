/**
 * Converts src/content/seed.ts into sanity/seed/seed.ndjson for `sanity dataset import`.
 * Run: npm run seed   (requires NEXT_PUBLIC_SANITY_PROJECT_ID and `npx sanity login`)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import * as seed from "../src/content/seed.ts";

const docs: Record<string, unknown>[] = [];
const ref = (id: string) => ({ _type: "reference", _ref: id });
const slug = (s: string) => ({ _type: "slug", current: s });
const chapterId = (s?: string) => (s ? `chapter-${s}` : undefined);
const clean = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null));
let k = 0;
const key = () => `k${(k++).toString(36)}`;

const { logo, recognition, highlights, glory, ...settings } = seed.settings;
void logo; void highlights; void glory;
docs.push(clean({ _id: "siteSettings", _type: "siteSettings", ...settings, recognition: { title: recognition.title, note: recognition.note }, pillars: settings.pillars.map((p) => ({ _key: key(), ...p })), trophies: settings.trophies.map((t) => ({ _key: key(), ...t })) }));

for (const m of seed.team) {
  docs.push(clean({ _id: `member-${m._id}`, _type: "teamMember", name: m.name, role: m.role, isCore: m.isCore, order: m.order, socials: m.socials, chapter: m.chapter ? ref(chapterId(m.chapter.slug)!) : undefined }));
}
for (const c of seed.chapters) {
  const lead = seed.team.find((t) => t.name === c.lead?.name);
  docs.push(clean({ _id: chapterId(c.slug), _type: "chapter", name: c.name, slug: slug(c.slug), city: c.city, lat: c.lat, lng: c.lng, instagram: c.instagram, memberCount: c.memberCount, about: c.about, screeningVenue: c.screeningVenue, lead: lead ? ref(`member-${lead._id}`) : undefined }));
}
for (const e of seed.events) {
  docs.push(clean({
    _id: `event-${e.slug}`, _type: "event", title: e.title, slug: slug(e.slug), date: e.date, venue: e.venue, type: e.type, league: e.league, opponent: e.opponent, summary: e.summary,
    description: e.description, rsvpUrl: e.rsvpUrl, recap: e.recap,
    chapter: e.chapter ? ref(chapterId(e.chapter.slug)!) : undefined,
    schedule: e.schedule?.map((s) => ({ _key: key(), ...s })),
    impactStats: e.impactStats?.map((s) => ({ _key: key(), ...s })),
  }));
}
for (const i of seed.initiatives) docs.push(clean({ _id: `initiative-${i._id}`, _type: "initiative", title: i.title, summary: i.summary, impact: i.impact, chapter: i.chapter ? ref(chapterId(i.chapter.slug)!) : undefined }));
for (const m of seed.milestones) docs.push(clean({ _id: `milestone-${m._id}`, _type: "milestone", year: m.year, title: m.title, description: m.description }));
seed.faqs.forEach((f, i) => docs.push({ _id: `faq-${f._id}`, _type: "faq", question: f.question, answer: f.answer, order: i + 1 }));

mkdirSync("sanity/seed", { recursive: true });
writeFileSync("sanity/seed/seed.ndjson", docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents to sanity/seed/seed.ndjson`);
