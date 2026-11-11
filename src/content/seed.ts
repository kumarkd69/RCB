/**
 * SAMPLE DATA — shown while Sanity is not connected, and exported to
 * sanity/seed/seed.ndjson by `npm run seed`.
 *
 * Everything here is dummy content so the site looks complete. Names, numbers,
 * venues, dates and photos must be replaced with real club information.
 * Photos are stills cut from the club's own videos (public/media/dummy).
 * Event dates are relative to "today" so the demo always has upcoming events.
 */
import type {
  Album, Chapter, ClubEvent, Faq, GalleryItem, GloryMoment, Img, Initiative, Milestone, SiteSettings, TeamMember,
} from "@/lib/types";

const DAY = 86_400_000;
const at = (days: number, hour = 19, min = 30) => {
  const d = new Date(Date.now() + days * DAY);
  d.setUTCHours(hour - 5, min - 30, 0, 0); // IST → UTC
  return d.toISOString();
};
let k = 0;
const block = (text: string) => ({
  _type: "block", _key: `b${k++}`, style: "normal", markDefs: [],
  children: [{ _type: "span", _key: `s${k++}`, text, marks: [] }],
});
const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/* ── Dummy photos (width × height of each file) ───────────────────────── */
const SIZES: Record<string, [number, number]> = {
  "crowd-scarves": [1100, 780], "flag-night": [770, 520], "fans-celebrate": [1020, 730], "floodlights-flag": [1200, 700],
  "crowd-right": [540, 660], "smoke-fans": [960, 630], "flag-wave": [920, 620], "flag-tall": [760, 1080],
  "floodlight-tall": [740, 900], "crowd-flags": [820, 800], "stadium-wide": [1600, 900], "scarf-fans": [960, 780],
  "match-night": [1600, 900], roar: [1020, 630], stands: [1600, 900],
  "p-1": [600, 800], "p-2": [500, 667], "p-3": [480, 639], "p-4": [480, 639], "p-5": [480, 639], "p-6": [500, 667],
  "trophy-1": [800, 720], "trophy-2": [800, 720], "trophy-3": [800, 720], "trophy-4": [800, 720],
  "recognition-sample": [1200, 1600], "fan-flag": [546, 649],
};
const photo = (name: string, alt: string): Img => ({ src: `/media/dummy/${name}.jpg`, alt, width: SIZES[name][0], height: SIZES[name][1] });
/** Photos from the 90-day plan deck (public/media/plan) */
const PLAN: Record<string, [number, number]> = { podcast: [771, 900], "box-cricket": [990, 717], "hygiene-drive": [1047, 672], "school-fun-day": [1074, 672], "crowd-dark": [1600, 900] };
const planPhoto = (name: string, alt: string): Img => ({ src: `/media/plan/${name}.jpg`, alt, width: PLAN[name][0], height: PLAN[name][1] });

const FAN_PHOTOS: [string, string][] = [
  ["stadium-wide", "Fans waving red flags under the floodlights"],
  ["fans-celebrate", "Two fans in RCB jerseys celebrating a boundary"],
  ["flag-tall", "A big red flag waved high in the stands"],
  ["crowd-scarves", "Fans holding RCB scarves above their heads"],
  ["floodlight-tall", "Floodlights and smoke over the crowd"],
  ["smoke-fans", "Red smoke drifting over cheering fans"],
  ["crowd-right", "A fan shouting with his fist in the air"],
  ["flag-wave", "A red flag mid-wave against the night sky"],
  ["crowd-flags", "Rows of fans with flags in the upper stand"],
  ["scarf-fans", "A group of fans singing with scarves raised"],
  ["roar", "Fans roaring after a wicket"],
  ["flag-night", "A black and red flag lit by the floodlights"],
  ["match-night", "The stands full on match night"],
  ["floodlights-flag", "A flag in front of the stadium floodlights"],
  ["stands", "The packed stands before the first ball"],
  ["fan-flag", "A fan in an RCB jersey waving a big red flag"],
];

/* ── Site settings ────────────────────────────────────────────────────── */
export const settings: SiteSettings = {
  tagline: "For the fans. By the fans. From Bengaluru. For RCB",
  intro:
    "A fan club for RCB supporters across Karnataka, built on one idea: RCB fandom is family. We bring fans together on match days and give back to the towns we come from.",
  logo: null,
  stats: { members: 5200, events: 140, cities: 4, years: 5, reach: 250000 }, // sample figures
  recognition: {
    title: "Officially recognised by RCB",
    note: "In 2024 Royal Challengers Bengaluru recognised Namma RCB HQ as an official fan club. That means early news on fan events, a seat at fan club meet-ups and a direct line to the team's fan engagement desk.",
    badge: { src: "/brand/logo-600.png", alt: "Namma RCB HQ crest", width: 600, height: 883 },
    proof: photo("recognition-sample", "Sample recognition certificate for Namma RCB HQ Official"),
  },
  pillars: [
    { title: "Match-day screenings", frequency: "Every RCB match, IPL and WPL", description: "Big screens, loud chants and a full house in every chapter city. Free for members, open to all fans.", icon: "screen", image: photo("stadium-wide", "Fans waving red flags at a match-day screening") },
    { title: "Fan meets", frequency: "Once a month", description: "Quizzes, jersey swaps and stories from the stands.", icon: "users", image: photo("fans-celebrate", "Two fans laughing at a fan meet") },
    { title: "Away trips", frequency: "2–3 a season", description: "Buses and blocks of seats to back the team in other cities.", icon: "bus", image: photo("fan-flag", "A fan waving a flag in the away stand") },
    { title: "Social drives", frequency: "Every quarter", description: "Blood donation, tree planting, lake clean-ups and school kits.", icon: "leaf", image: photo("smoke-fans", "Volunteers at a social drive") },
    { title: "Blood donation", frequency: "4 drives a year", description: "Drives with partner blood banks in every chapter city.", icon: "drop", image: photo("crowd-right", "A donor cheering after giving blood") },
    { title: "Grassroots cricket", frequency: "Weekends, off-season", description: "Free clinics and a tape-ball tournament for under-14s.", icon: "star", image: photo("scarf-fans", "Kids and coaches at a cricket clinic") },
  ],
  mission: "To unite RCB fans across Karnataka into one loud, kind and organised family that shows up for the team and for our cities.",
  vision: "A Namma RCB HQ chapter in every district of Karnataka, known as much for its service as for its chants.",
  values: ["Loyalty, win or lose", "Respect for every fan", "Give back to our cities", "Celebrate together"],
  story:
    "It started in 2021 with 40 friends, one projector and a rented hall in Jayanagar. Five seasons later we are more than five thousand members across four cities, still screening every game together.",
  whatsappLink: "https://chat.whatsapp.com/",
  contactEmail: "hello@nammarcbhq.in",
  contactPhone: "+91 98450 12345",
  highlights: [
    { image: photo("stadium-wide", "Fans waving flags at a screening"), caption: "Screening night" },
    { image: photo("flag-tall", "A red flag raised at a fan meet"), caption: "Fan meet" },
    { image: photo("fans-celebrate", "Volunteers celebrating after the blood drive"), caption: "Blood drive" },
    { image: photo("floodlight-tall", "Fans under the floodlights on an away trip"), caption: "Away trip" },
    { image: photo("crowd-scarves", "Fans with scarves at the victory screening"), caption: "Victory night" },
    { image: photo("crowd-right", "A fan cheering at the season finale"), caption: "Season finale" },
  ],
  bannerMessages: [
    "Ee sala cup namde!",
    "Namma hemme, RCB",
    "Since 2008, always",
    "For every last-over finish",
    "12th Man Army, Hubballi",
    "Belagavi bleeds red",
    "Kolar is with you",
    "Play bold, always",
    "ನಮ್ಮ RCB, ನಮ್ಮ ಹೆಮ್ಮೆ",
  ],
  contests: [
    { title: "Predict & win", description: "Guess the score before each match", where: "Online · every match" },
    { title: "RCB trivia", description: "A weekly quiz on all things RCB", where: "Online · weekly" },
    { title: "Fan art challenge", description: "Draw or design your favourite RCB moment", where: "Online" },
    { title: "Reel challenge", description: "Film your best RCB chant", where: "Online" },
    { title: "Best fan look", description: "Jersey and face-paint contest", where: "At screenings" },
    { title: "Her RCB story", description: "Women fans share what RCB means to them", where: "WPL spotlight" },
  ],
  trophies: [
    { league: "WPL", year: 2024, title: "Women's Premier League Champions" },
    { league: "IPL", year: 2025, title: "Indian Premier League Champions" },
    { league: "IPL", year: 2026, title: "Indian Premier League Champions" },
    { league: "WPL", year: 2026, title: "Women's Premier League Champions" },
  ],
  glory: [
    { title: "The first one", year: 2024, league: "WPL", image: photo("trophy-1", "Gold trophy with red Champions ribbons") },
    { title: "18 years. Finally", year: 2025, league: "IPL", image: photo("fans-celebrate", "Fans celebrating the 2025 title") },
    { title: "The streets of Bengaluru", year: 2025, league: "IPL", image: photo("stadium-wide", "Flags everywhere on title night") },
    { title: "Back to back", year: 2026, league: "IPL", image: photo("trophy-3", "The trophy turning under studio light") },
    { title: "Queens again", year: 2026, league: "WPL", image: photo("crowd-scarves", "Fans with scarves after the WPL final") },
  ] satisfies GloryMoment[],
};

/* ── Team ─────────────────────────────────────────────────────────────── */
const hub = { name: "Hubballi", slug: "hubballi", city: "Hubballi–Dharwad" };
const kol = { name: "Kolar", slug: "kolar", city: "Kolar" };
const bel = { name: "Belagavi", slug: "belagavi", city: "Belagavi" };

/** Real team, from the 90-day plan deck. Photos to come (cards show initials until uploaded). */
export const team: TeamMember[] = [
  { _id: "tm-1", name: "Siddeshwaraprasad M R", role: "Founder & Chapter Head · Head of Strategy", photo: null, chapter: null, isCore: true, order: 1, socials: { instagram: "nammarcbhqofficial" } },
  { _id: "tm-2", name: "Arun Aribenchi", role: "Co-founder · Event Head", photo: null, chapter: null, isCore: true, order: 2, socials: {} },
  { _id: "tm-3", name: "Mike Tyson Dsilva", role: "Creative Head", photo: null, chapter: null, isCore: true, order: 3, socials: {} },
  { _id: "tm-4", name: "Manasa Vashisht", role: "Strategic Marketing Head", photo: null, chapter: null, isCore: true, order: 4, socials: {} },
  { _id: "tm-5", name: "Kumar K D", role: "IT Head", photo: null, chapter: null, isCore: true, order: 5, socials: {} },
  { _id: "tm-6", name: "Marilyn", role: "Host · IT Admin", photo: null, chapter: null, isCore: true, order: 6, socials: {} },
  { _id: "tm-7", name: "Athirath", role: "Media Head", photo: null, chapter: null, isCore: true, order: 7, socials: {} },
  { _id: "tm-8", name: "Ankush", role: "Emerging Member", photo: null, chapter: null, isCore: false, order: 8, socials: {} },
  { _id: "tm-9", name: "Prashanth", role: "Emerging Member", photo: null, chapter: null, isCore: false, order: 9, socials: {} },
];


/* ── Chapters ─────────────────────────────────────────────────────────── */
export const chapters: Chapter[] = [
  { _id: "ch-hubballi", name: "Hubballi", slug: "hubballi", city: "Hubballi–Dharwad", lat: 15.3647, lng: 75.124, lead: null, instagram: "nammarcbhq_hubballi", memberCount: 1400, about: "North Karnataka's loudest RCB corner. Screenings every match day and a blood drive every quarter.", screeningVenue: "Vidyanagar community hall", cover: photo("crowd-flags", "Hubballi chapter fans with flags") },
  { _id: "ch-kolar", name: "Kolar", slug: "kolar", city: "Kolar", lat: 13.1367, lng: 78.1292, lead: null, instagram: "nammarcbhq_kolar", memberCount: 850, about: "Gold-field city, red-and-gold hearts. Known for the kids' cricket clinic and the lake clean-up.", screeningVenue: "Town hall grounds", cover: photo("smoke-fans", "Kolar chapter fans in red smoke") },
  { _id: "ch-belagavi", name: "Belagavi", slug: "belagavi", city: "Belagavi", lat: 15.8497, lng: 74.4977, lead: null, instagram: undefined, memberCount: 600, about: "Our newest chapter, on the border, growing every season.", screeningVenue: "Tilakwadi club house", cover: photo("roar", "Belagavi chapter fans roaring") },
];

/* ── Events ───────────────────────────────────────────────────────────── */
const ev = (e: Omit<ClubEvent, "chapter" | "cover"> & { ch?: typeof hub; cover: string }): ClubEvent => {
  const { ch, cover, ...rest } = e;
  const alt = FAN_PHOTOS.find(([n]) => n === cover)?.[1] ?? e.title;
  return { ...rest, chapter: ch ?? null, cover: photo(cover, alt) };
};

export const events: ClubEvent[] = [
  // Upcoming
  ev({
    _id: "ev-1", title: "Off-season fan meet", slug: "off-season-fan-meet", date: at(9, 17, 0), venue: "Jayanagar community hall, Bengaluru", mapUrl: maps("Jayanagar Bengaluru"),
    type: "fanmeet", league: "offseason", cover: "stadium-wide", summary: "Quiz, jersey swap and auction-season predictions",
    description: [block("Fans from every chapter meet for an evening of quizzes, stories and predictions for the auction."), block("Bring an old jersey to swap. Snacks and chai are on us.")],
    schedule: [{ time: "5:00 PM", item: "Check-in" }, { time: "5:30 PM", item: "Fan quiz, three rounds" }, { time: "6:45 PM", item: "Auction predictions panel" }, { time: "7:30 PM", item: "Jersey swap" }],
    rsvpUrl: "/join",
  }),
  ev({
    _id: "ev-2", title: "Blood donation drive", slug: "blood-donation-drive-hubballi", date: at(16, 9, 0), venue: "Vidyanagar community hall, Hubballi", mapUrl: maps("Vidyanagar Hubballi"), ch: hub,
    type: "social", league: "offseason", cover: "fans-celebrate", summary: "Donate blood with our partner blood bank on site",
    description: [block("Walk in between 9 AM and 2 PM. The blood bank team runs a quick check before you donate."), block("Every donor gets a certificate and a Namma RCB HQ donor badge.")],
    schedule: [{ time: "9:00 AM", item: "Registration opens" }, { time: "9:30 AM", item: "Donations begin" }, { time: "2:00 PM", item: "Last donor" }],
    rsvpUrl: "/join",
  }),
  ev({
    _id: "ev-3", title: "IPL auction watch party", slug: "ipl-auction-watch-party", date: at(23, 14, 0), venue: "Indiranagar club house, Bengaluru", mapUrl: maps("Indiranagar Bengaluru"),
    type: "fanmeet", league: "offseason", cover: "crowd-scarves", summary: "Every bid on the big screen, with a live fantasy draft",
    description: [block("We watch the auction live and run our own fantasy draft alongside it. Prizes for the best squad.")],
    schedule: [{ time: "2:00 PM", item: "Doors open" }, { time: "2:30 PM", item: "Auction live" }, { time: "7:00 PM", item: "Fantasy draft results" }],
    rsvpUrl: "/join",
  }),
  ev({
    _id: "ev-4", title: "WPL screening: RCB vs Mumbai", slug: "wpl-screening-belagavi", date: at(34, 19, 30), venue: "Tilakwadi club house, Belagavi", mapUrl: maps("Tilakwadi Belagavi"), ch: bel,
    type: "screening", league: "wpl", opponent: "Mumbai", cover: "flag-tall", summary: "Big screen and a full house. Wear red",
    description: [block("The Belagavi chapter's first WPL screening of the season. Seats are first come, first served.")],
    schedule: [{ time: "6:30 PM", item: "Doors open" }, { time: "7:30 PM", item: "First ball" }],
    rsvpUrl: "/join",
  }),
  ev({
    _id: "ev-5", title: "Kids cricket clinic", slug: "kids-cricket-clinic-kolar", date: at(41, 7, 30), venue: "Town hall grounds, Kolar", mapUrl: maps("Kolar town hall"), ch: kol,
    type: "social", league: "offseason", cover: "scarf-fans", summary: "A free morning of coaching for under-14s",
    description: [block("Local coaches run batting, bowling and fielding stations. Bring a water bottle and your own bat if you have one.")],
    schedule: [{ time: "7:30 AM", item: "Warm-up" }, { time: "8:00 AM", item: "Skill stations" }, { time: "10:00 AM", item: "Mini match" }],
    rsvpUrl: "/join",
  }),
  ev({
    _id: "ev-6", title: "WPL screening: RCB vs Delhi", slug: "wpl-screening-hubballi", date: at(48, 19, 30), venue: "Vidyanagar community hall, Hubballi", mapUrl: maps("Vidyanagar Hubballi"), ch: hub,
    type: "screening", league: "wpl", opponent: "Delhi", cover: "floodlights-flag", summary: "Second WPL screening in Hubballi",
    description: [block("Projector, sound system and 300 seats. Flags and face paint at the door.")],
    rsvpUrl: "/join",
  }),

  // Past
  ev({
    _id: "ev-7", title: "Season finale screening", slug: "season-finale-screening", date: at(-160, 19, 30), venue: "Vidyanagar community hall, Hubballi", ch: hub,
    type: "screening", league: "ipl", opponent: "Punjab", cover: "match-night", summary: "The loudest night of the season",
    recap: "A packed hall, a thousand flags and one voice. Doors closed forty minutes before the toss because every seat was taken.",
    impactStats: [{ label: "Fans", value: "820" }, { label: "Flags handed out", value: "1,000" }],
  }),
  ev({
    _id: "ev-8", title: "Title celebration", slug: "title-celebration-bengaluru", date: at(-158, 18, 0), venue: "Jayanagar, Bengaluru",
    type: "fanmeet", league: "ipl", cover: "fans-celebrate", summary: "Cake, dhol and a very long night",
    recap: "Members from all four chapters came to Bengaluru to celebrate together. The dhol players did not stop for three hours.",
    impactStats: [{ label: "Members", value: "1,200" }, { label: "Chapters", value: "4" }],
  }),
  ev({
    _id: "ev-9", title: "Tree plantation drive", slug: "tree-plantation-kolar", date: at(-120, 8, 0), venue: "Kolar lake road", ch: kol,
    type: "social", league: "offseason", cover: "smoke-fans", summary: "Greening our city",
    recap: "Volunteers planted saplings along the lake road and set up a watering rota for the summer.",
    impactStats: [{ label: "Saplings", value: "250" }, { label: "Volunteers", value: "60" }],
  }),
  ev({
    _id: "ev-10", title: "Away trip: Chepauk", slug: "away-trip-chennai", date: at(-200, 6, 0), venue: "Chennai",
    type: "awaytrip", league: "ipl", opponent: "Chennai", cover: "fan-flag", summary: "Two buses, one dream",
    recap: "Ninety fans made the trip and sang for four hours straight in the away block.",
    impactStats: [{ label: "Fans travelled", value: "90" }, { label: "Buses", value: "2" }],
  }),
  ev({
    _id: "ev-11", title: "Blood donation drive", slug: "blood-donation-drive-belagavi", date: at(-95, 9, 0), venue: "Tilakwadi club house, Belagavi", ch: bel,
    type: "social", league: "offseason", cover: "crowd-right", summary: "Belagavi's first drive",
    recap: "The new chapter's first blood drive filled every slot by noon.",
    impactStats: [{ label: "Units collected", value: "74" }, { label: "Donors", value: "80" }],
  }),
  ev({
    _id: "ev-12", title: "WPL final screening", slug: "wpl-final-screening", date: at(-250, 19, 30), venue: "Indiranagar club house, Bengaluru",
    type: "screening", league: "wpl", opponent: "Delhi", cover: "crowd-scarves", summary: "Queens of Bengaluru",
    recap: "Our biggest WPL crowd yet watched the final together and stayed long after the last ball.",
    impactStats: [{ label: "Fans", value: "540" }],
  }),
  ev({
    _id: "ev-13", title: "Lake clean-up", slug: "lake-clean-up-kolar", date: at(-60, 7, 0), venue: "Kolaramma lake, Kolar", ch: kol,
    type: "social", league: "offseason", cover: "flag-wave", summary: "Two tonnes of waste off the lake bed",
    recap: "A Sunday morning, gloves and sacks. The municipality picked up the waste the same day.",
    impactStats: [{ label: "Waste removed", value: "2 t" }, { label: "Volunteers", value: "45" }],
  }),
  ev({
    _id: "ev-14", title: "Away trip: Hyderabad", slug: "away-trip-hyderabad", date: at(-185, 5, 30), venue: "Hyderabad",
    type: "awaytrip", league: "ipl", opponent: "Hyderabad", cover: "crowd-flags", summary: "Overnight train, front-row seats",
    recap: "Sixty fans took the overnight train and filled a whole stand section in red.",
    impactStats: [{ label: "Fans travelled", value: "60" }],
  }),
  ev({
    _id: "ev-15", title: "Founders' fan meet", slug: "founders-fan-meet", date: at(-330, 17, 0), venue: "Jayanagar community hall, Bengaluru",
    type: "fanmeet", league: "offseason", cover: "stands", summary: "Where it all started",
    recap: "The founding members told the story of the first screening and welcomed two hundred new members.",
    impactStats: [{ label: "New members", value: "200" }],
  }),
  ev({
    _id: "ev-16", title: "School kit donation", slug: "school-kit-donation-hubballi", date: at(-40, 10, 0), venue: "Government school, Old Hubballi", ch: hub,
    type: "social", league: "offseason", cover: "roar", summary: "Bags, books and cricket kits for 300 students",
    recap: "Members collected and packed kits over two weekends and handed them out with the school staff.",
    impactStats: [{ label: "Kits", value: "300" }, { label: "Cricket sets", value: "12" }],
  }),
];

/* ── Initiatives, milestones, FAQ ─────────────────────────────────────── */
/** The 90-day community plan: three pillars, six initiatives (from the plan deck). */
export const initiatives: Initiative[] = [
  { _id: "in-1", order: 1, pillar: "connect", title: "RCB Fans Family Podcast", window: "Days 1–20", chapter: null, summary: "Fan stories, on the mic.", points: ["Conversations with fans and fan clubs", "Fan journeys and match-day memories", "Short clips as a regular series"], impact: "A stronger RCB fan family", images: [planPhoto("podcast", "A podcast microphone and an RCB mug on a desk")] },
  { _id: "in-2", order: 2, pillar: "connect", title: "The Namma Banner", window: "Every event", chapter: null, summary: "One banner travels to every event. Fans write a message and sign it. On match day we display it for the team.", points: ["Carry it to every event", "Invite fans to join in", "Fans write a message and sign", "Display it on match day"], images: [planPhoto("crowd-dark", "A red flag over a crowd at night")] },
  { _id: "in-3", order: 3, pillar: "giveback", title: "Menstrual hygiene drive", window: "Days 21–45", chapter: null, summary: "Sanitary pad distribution for rural girls and women, with privacy and dignity.", points: ["Tie up with NGOs and ASHA workers", "Plan quantity, material and logistics", "Distribute in rural areas"], images: [planPhoto("hygiene-drive", "A smiling schoolgirl receiving a hygiene kit")] },
  { _id: "in-4", order: 4, pillar: "giveback", title: "Fun days at 3 government schools", window: "Days 46–65", chapter: null, summary: "Teamwork games beyond the stadium, for every child.", points: ["Relay races and tug of war", "Team puzzles and ball games", "A drawing challenge"], images: [planPhoto("school-fun-day", "Children in school uniform in a tug of war")] },
  { _id: "in-5", order: 5, pillar: "play", title: "Namma Match Day", window: "WPL & IPL season", chapter: null, summary: "Screenings and contests for WPL and IPL, in apartment communities.", points: ["Pitch to the residents' association", "Screen, seating, banner, photo wall", "Host-led live match, then sign the banner"], images: [photo("stadium-wide", "Fans watching a match together with flags")] },
  { _id: "in-6", order: 6, pillar: "play", title: "Off-Season Showdown", window: "Days 66–90", chapter: null, summary: "One day. Every official fan club. One Namma Cup.", points: ["Box cricket: club vs club, 6-over matches", "Challenge games: relay, penalties, fan-IQ", "Winner takes the Namma Cup"], images: [planPhoto("box-cricket", "A batter in an RCB jersey at a box cricket game")] },
];

export const milestones: Milestone[] = [
  { _id: "ms-1", year: 2021, title: "First screening", description: "40 friends, one projector and a rented hall in Jayanagar." },
  { _id: "ms-2", year: 2022, title: "First away trip", description: "One bus to Chennai. We came back with 300 new members." },
  { _id: "ms-3", year: 2023, title: "Hubballi chapter", description: "Our first chapter outside Bengaluru." },
  { _id: "ms-4", year: 2024, title: "Recognised by RCB", description: "Named an official fan club by Royal Challengers Bengaluru." },
  { _id: "ms-5", year: 2025, title: "Kolar and Belagavi", description: "Two new chapters and the title we waited 18 years for." },
  { _id: "ms-6", year: 2026, title: "5,000 members", description: "Back-to-back IPL titles and a second WPL trophy." },
];

export const faqs: Faq[] = [
  { _id: "fq-1", question: "Is membership free?", answer: "Yes. Fill in the form and your chapter lead adds you to the WhatsApp group within two days." },
  { _id: "fq-2", question: "Is this the official RCB team?", answer: "No. We are an independent fan club recognised by RCB, not operated by Royal Challengers Sports Pvt. Ltd." },
  { _id: "fq-3", question: "There's no chapter in my city. What now?", answer: "Start one. Use the “Start a chapter” form on the Chapters page and we will help with your first screening." },
  { _id: "fq-4", question: "Are screenings open to non-members?", answer: "Most are. Some need an RSVP because of venue size, which the event page will say." },
  { _id: "fq-5", question: "Do you sell match tickets?", answer: "No. We share official ticket links in the WhatsApp group as soon as sales open." },
  { _id: "fq-6", question: "How do I volunteer?", answer: "Tell your chapter lead or tick “volunteer” when you join. Every drive needs hands." },
];

/* ── Albums: one per past event, filled with dummy photos ─────────────── */
export const albums: Album[] = events
  .filter((e) => new Date(e.date) < new Date())
  .map((e, ai) => ({
    _id: "al-" + e._id,
    title: e.title,
    date: e.date,
    chapter: e.chapter,
    eventSlug: e.slug,
    items: Array.from({ length: 4 + (ai % 3) }, (_, i): GalleryItem => {
      const [name, alt] = FAN_PHOTOS[(ai * 5 + i) % FAN_PHOTOS.length];
      const [w, h] = SIZES[name];
      return {
        id: `${e._id}-${i}`,
        kind: "photo",
        image: photo(name, alt),
        ratio: w / h,
        chapterSlug: e.chapter?.slug,
        eventSlug: e.slug,
        eventTitle: e.title,
        year: new Date(e.date).getFullYear(),
        caption: alt,
      };
    }),
  }));

/** Dummy Instagram tiles, used until a real feed is connected. */
export const instaPlaceholderPhotos = FAN_PHOTOS.map(([n]) => `/media/dummy/${n}.jpg`);
