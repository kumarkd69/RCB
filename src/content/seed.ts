/**
 * SAMPLE DATA — used when Sanity is not connected, and exported to
 * sanity/seed/seed.ndjson by `npm run seed`.
 *
 * Everything marked [PLACEHOLDER] must be replaced with real club info.
 * Event dates are relative to "today" so the demo always has upcoming events.
 */
import type {
  Album, Chapter, ClubEvent, Faq, GalleryItem, Initiative, Milestone, SiteSettings, TeamMember,
} from "@/lib/types";

const DAY = 86_400_000;
const at = (days: number, hour = 19, min = 30) => {
  const d = new Date(Date.now() + days * DAY);
  d.setUTCHours(hour - 5, min - 30, 0, 0); // IST → UTC
  return d.toISOString();
};
const block = (text: string) => ({
  _type: "block", _key: Math.random().toString(36).slice(2, 10), style: "normal", markDefs: [],
  children: [{ _type: "span", _key: "s" + Math.random().toString(36).slice(2, 8), text, marks: [] }],
});

export const settings: SiteSettings = {
  tagline: "Ee Sala Namde. Every Season.",
  intro:
    "[PLACEHOLDER] Namma RCB HQ Official is a fan-run community of Royal Challengers Bengaluru supporters. We bring fans together for match-day screenings, fan meets, away trips and social drives across Karnataka.",
  logo: null,
  stats: { members: 5000, events: 120, cities: 4, years: 5 }, // [PLACEHOLDER] real numbers needed
  recognition: {
    title: "Officially recognised by RCB",
    note: "[PLACEHOLDER] Add the recognition note and upload the proof letter in Studio → Site settings.",
    badge: null,
    proof: null,
  },
  pillars: [
    { title: "Match-Day Screenings", description: "Big screens, loud chants and a full house for every RCB game.", icon: "screen" },
    { title: "Fan Meets", description: "Meet the family. Quizzes, jersey swaps and stories from the stands.", icon: "users" },
    { title: "Away Trips", description: "We travel together to back the team in other cities.", icon: "bus" },
    { title: "Blood Donation", description: "Regular drives with partner blood banks in every chapter city.", icon: "drop" },
    { title: "Social Drives", description: "Tree planting, clean-ups and school kit donations.", icon: "leaf" },
    { title: "Grassroots Cricket", description: "Clinics and tournaments for young cricketers.", icon: "star" },
  ],
  mission: "To unite RCB fans across Karnataka into one loud, kind and organised family that shows up for the team and for our cities.",
  vision: "A Namma RCB HQ chapter in every district of Karnataka, known as much for its service as for its chants.",
  values: ["Loyalty, win or lose", "Respect for every fan", "Give back to our cities", "Celebrate together"],
  story:
    "[PLACEHOLDER] Tell the founding story here: when, where and how the club started.",
  whatsappLink: undefined, // [PLACEHOLDER] WhatsApp community link
  contactEmail: undefined, // [PLACEHOLDER]
  contactPhone: undefined,
  highlights: [
    { image: null, caption: "Screening night" },
    { image: null, caption: "Fan meet" },
    { image: null, caption: "Blood drive" },
    { image: null, caption: "Away trip" },
    { image: null, caption: "Victory lap" },
  ],
  trophies: [
    { league: "WPL", year: 2024, title: "Women's Premier League Champions" },
    { league: "IPL", year: 2025, title: "Indian Premier League Champions" },
    { league: "IPL", year: 2026, title: "Indian Premier League Champions" },
    { league: "WPL", year: 2026, title: "Women's Premier League Champions" },
  ],
  // [PLACEHOLDER] Upload winning photos/videos in Studio → Site settings → Glory moments
  // (only images the club has rights/permission to use).
  glory: [
    { title: "The first one", year: 2024, league: "WPL", image: null },
    { title: "18 years. Finally.", year: 2025, league: "IPL", image: null },
    { title: "Back to back", year: 2026, league: "IPL", image: null },
    { title: "Queens again", year: 2026, league: "WPL", image: null },
    { title: "The streets of Bengaluru", year: 2025, league: "IPL", image: null },
  ],
};

export const team: TeamMember[] = [
  { _id: "tm-1", name: "[PLACEHOLDER] Founder", role: "Founder & President", photo: null, chapter: null, isCore: true, order: 1, socials: { instagram: "nammarcbhqofficial" } },
  { _id: "tm-2", name: "[PLACEHOLDER] Member 2", role: "General Secretary", photo: null, chapter: null, isCore: true, order: 2, socials: {} },
  { _id: "tm-3", name: "[PLACEHOLDER] Member 3", role: "Events Head", photo: null, chapter: null, isCore: true, order: 3, socials: {} },
  { _id: "tm-4", name: "[PLACEHOLDER] Member 4", role: "Hubballi Chapter Lead", photo: null, chapter: { name: "Hubballi", slug: "hubballi" }, isCore: false, order: 4, socials: { instagram: "nammarcbhq_hubballi" } },
  { _id: "tm-5", name: "[PLACEHOLDER] Member 5", role: "Kolar Chapter Lead", photo: null, chapter: { name: "Kolar", slug: "kolar" }, isCore: false, order: 5, socials: { instagram: "nammarcbhq_kolar" } },
  { _id: "tm-6", name: "[PLACEHOLDER] Member 6", role: "Belagavi Chapter Lead", photo: null, chapter: { name: "Belagavi", slug: "belagavi" }, isCore: false, order: 6, socials: {} },
];

const leadOf = (id: string) => {
  const m = team.find((t) => t._id === id)!;
  return { name: m.name, role: m.role, photo: m.photo, socials: m.socials };
};

export const chapters: Chapter[] = [
  { _id: "ch-hubballi", name: "Hubballi", slug: "hubballi", city: "Hubballi–Dharwad", lat: 15.3647, lng: 75.124, lead: leadOf("tm-4"), instagram: "nammarcbhq_hubballi", memberCount: 0, about: "[PLACEHOLDER] North Karnataka's loudest RCB corner.", screeningVenue: "[PLACEHOLDER] Venue", cover: null },
  { _id: "ch-kolar", name: "Kolar", slug: "kolar", city: "Kolar", lat: 13.1367, lng: 78.1292, lead: leadOf("tm-5"), instagram: "nammarcbhq_kolar", memberCount: 0, about: "[PLACEHOLDER] Gold-field city, red-and-gold hearts.", screeningVenue: "[PLACEHOLDER] Venue", cover: null },
  { _id: "ch-belagavi", name: "Belagavi", slug: "belagavi", city: "Belagavi", lat: 15.8497, lng: 74.4977, lead: leadOf("tm-6"), instagram: undefined, memberCount: 0, about: "[PLACEHOLDER] Our newest chapter on the border.", screeningVenue: "[PLACEHOLDER] Venue", cover: null },
];

const ref = (slug: string) => {
  const c = chapters.find((x) => x.slug === slug)!;
  return { name: c.name, slug: c.slug, city: c.city };
};

export const events: ClubEvent[] = [
  {
    _id: "ev-1", title: "Off-Season Fan Meet", slug: "off-season-fan-meet", date: at(9, 17, 0), venue: "[SAMPLE] Bengaluru", chapter: null,
    type: "fanmeet", league: "offseason", cover: null, summary: "Quiz, jersey swap and auction-season predictions.",
    description: [block("Sample event. Join fans from every chapter for an evening of quizzes, stories and season predictions.")],
    schedule: [{ time: "5:00 PM", item: "Check-in" }, { time: "5:30 PM", item: "Fan quiz" }, { time: "7:00 PM", item: "Jersey swap" }],
    rsvpUrl: undefined,
  },
  {
    _id: "ev-2", title: "Blood Donation Drive", slug: "blood-donation-drive-hubballi", date: at(18, 9, 0), venue: "[SAMPLE] Hubballi", chapter: ref("hubballi"),
    type: "social", league: "offseason", cover: null, summary: "Donate blood, save lives. Partner blood bank on site.",
    description: [block("Sample event. Walk in, donate, and get a Namma RCB HQ donor badge.")],
  },
  {
    _id: "ev-3", title: "WPL Screening: RCB vs TBD", slug: "wpl-screening-belagavi", date: at(34, 19, 30), venue: "[SAMPLE] Belagavi", chapter: ref("belagavi"),
    type: "screening", league: "wpl", opponent: "TBD", cover: null, summary: "Big screen, full house. Wear red.",
    description: [block("Sample event. Fixture to be confirmed once the schedule is out.")],
  },
  {
    _id: "ev-4", title: "Kids Cricket Clinic", slug: "kids-cricket-clinic-kolar", date: at(46, 7, 30), venue: "[SAMPLE] Kolar", chapter: ref("kolar"),
    type: "social", league: "offseason", cover: null, summary: "A morning of coaching for under-14s.",
    description: [block("Sample event. Free clinic with local coaches. Bring your own water bottle.")],
  },
  {
    _id: "ev-5", title: "Season Finale Screening", slug: "season-finale-screening", date: at(-160, 19, 30), venue: "[SAMPLE] Hubballi", chapter: ref("hubballi"),
    type: "screening", league: "ipl", opponent: "TBD", cover: null, summary: "The loudest night of the season.",
    recap: "Sample recap. A packed hall, a thousand flags and one voice.",
    impactStats: [{ label: "Fans", value: "800+" }, { label: "Flags", value: "1,000" }],
  },
  {
    _id: "ev-6", title: "Tree Plantation Drive", slug: "tree-plantation-kolar", date: at(-120, 8, 0), venue: "[SAMPLE] Kolar", chapter: ref("kolar"),
    type: "social", league: "offseason", cover: null, summary: "Greening our city.",
    recap: "Sample recap. Volunteers planted saplings along the lake road.",
    impactStats: [{ label: "Saplings", value: "250" }, { label: "Volunteers", value: "60" }],
  },
  {
    _id: "ev-7", title: "Away Trip: Chepauk", slug: "away-trip-chennai", date: at(-200, 6, 0), venue: "[SAMPLE] Chennai", chapter: null,
    type: "awaytrip", league: "ipl", opponent: "TBD", cover: null, summary: "Two buses, one dream.",
    recap: "Sample recap. 90 fans made the trip and sang for four hours straight.",
    impactStats: [{ label: "Fans travelled", value: "90" }],
  },
  {
    _id: "ev-8", title: "Founders' Fan Meet", slug: "founders-fan-meet", date: at(-330, 17, 0), venue: "[SAMPLE] Bengaluru", chapter: null,
    type: "fanmeet", league: "offseason", cover: null, summary: "Where it all started.",
    recap: "Sample recap.",
  },
];

export const initiatives: Initiative[] = [
  { _id: "in-1", title: "Blood Donation Drives", chapter: null, summary: "Regular drives with partner blood banks.", impact: "[PLACEHOLDER] units collected" },
  { _id: "in-2", title: "Tree Plantation", chapter: ref("kolar"), summary: "Saplings planted around Kolar.", impact: "[PLACEHOLDER]" },
];

export const milestones: Milestone[] = [
  { _id: "ms-1", year: 2021, title: "[PLACEHOLDER] Club founded", description: "Replace with the real founding year and story." },
  { _id: "ms-2", year: 2022, title: "[PLACEHOLDER] First away trip" },
  { _id: "ms-3", year: 2023, title: "[PLACEHOLDER] Hubballi chapter launched" },
  { _id: "ms-4", year: 2024, title: "[PLACEHOLDER] Officially recognised by RCB" },
  { _id: "ms-5", year: 2025, title: "[PLACEHOLDER] Kolar & Belagavi chapters" },
];

export const faqs: Faq[] = [
  { _id: "fq-1", question: "Is membership free?", answer: "[PLACEHOLDER] Yes. Fill the form and you'll be added to your chapter's WhatsApp group." },
  { _id: "fq-2", question: "Is this the official RCB team?", answer: "No. We are an independent fan club recognised by RCB, not operated by Royal Challengers Sports Pvt. Ltd." },
  { _id: "fq-3", question: "There's no chapter in my city. What now?", answer: "Start one! Use the “Start a chapter” form on the Chapters page and we'll help you set it up." },
  { _id: "fq-4", question: "Are screenings open to non-members?", answer: "[PLACEHOLDER] Most screenings are open to all fans. Some need an RSVP because of venue capacity." },
];

/** Placeholder gallery: 18 tiles with mixed shapes. */
const ratios = [0.75, 1.33, 1, 0.8, 1.5, 0.66, 1, 1.25, 0.75, 1.77, 1, 0.8, 1.33, 0.66, 1, 1.5, 0.75, 1.2];
export const albums: Album[] = events.filter((e) => new Date(e.date) < new Date()).map((e, ai) => ({
  _id: "al-" + e._id,
  title: e.title,
  date: e.date,
  chapter: e.chapter,
  eventSlug: e.slug,
  items: Array.from({ length: 4 + (ai % 2) }, (_, i): GalleryItem => {
    const n = ai * 5 + i;
    return {
      id: `${e._id}-${i}`,
      kind: n % 7 === 3 ? "video" : "photo",
      image: null,
      ratio: ratios[n % ratios.length],
      chapterSlug: e.chapter?.slug,
      eventSlug: e.slug,
      eventTitle: e.title,
      year: new Date(e.date).getFullYear(),
      caption: `${e.title} — photo ${i + 1}`,
    };
  }),
}));
