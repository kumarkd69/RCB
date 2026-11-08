/**
 * Static, developer-owned config. Everything club members edit lives in Sanity.
 */
export const site = {
  name: "Namma RCB HQ Official",
  shortName: "Namma RCB HQ",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description:
    "Independent fan club of Royal Challengers Bengaluru with city chapters across Karnataka. Match-day screenings, fan meets, away trips and social initiatives.",
  disclaimer:
    "Independent fan club, not operated by Royal Challengers Sports Pvt. Ltd.",
  rcbLinks: {
    website: "https://www.royalchallengers.com",
    app: "https://www.royalchallengers.com/rcb-app",
  },
  /** HQ pin shown on the map in addition to chapters */
  hq: { name: "HQ — Bengaluru", lat: 12.9716, lng: 77.5946 },
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/chapters", label: "Chapters" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
];

export type InstaAccount = {
  key: string;
  label: string;
  /** null = handle not confirmed yet (shown as "coming soon") */
  handle: string | null;
  chapterSlug?: string;
  tokenEnv: string;
  beholdEnv: string;
};

/** Add / edit Instagram handles here. Belagavi handle: TBD. */
export const instagramAccounts: InstaAccount[] = [
  { key: "main", label: "HQ", handle: "nammarcbhqofficial", tokenEnv: "INSTAGRAM_TOKEN_MAIN", beholdEnv: "BEHOLD_FEED_MAIN" },
  { key: "hubballi", label: "Hubballi", handle: "nammarcbhq_hubballi", chapterSlug: "hubballi", tokenEnv: "INSTAGRAM_TOKEN_HUBBALLI", beholdEnv: "BEHOLD_FEED_HUBBALLI" },
  { key: "kolar", label: "Kolar", handle: "nammarcbhq_kolar", chapterSlug: "kolar", tokenEnv: "INSTAGRAM_TOKEN_KOLAR", beholdEnv: "BEHOLD_FEED_KOLAR" },
  { key: "belagavi", label: "Belagavi", handle: null, chapterSlug: "belagavi", tokenEnv: "INSTAGRAM_TOKEN_BELAGAVI", beholdEnv: "BEHOLD_FEED_BELAGAVI" },
];

export const EVENT_TYPE_LABEL: Record<string, string> = {
  screening: "Screening",
  social: "Social Initiative",
  fanmeet: "Fan Meet",
  awaytrip: "Away Trip",
};
export const LEAGUE_LABEL: Record<string, string> = { ipl: "IPL", wpl: "WPL", offseason: "Off-season" };
