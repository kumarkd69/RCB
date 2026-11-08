import type { PortableTextBlock } from "@portabletext/react";

export type Img = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blur?: string;
} | null;

export type EventType = "screening" | "social" | "fanmeet" | "awaytrip";
export type League = "ipl" | "wpl" | "offseason";

export type Socials = { instagram?: string; linkedin?: string; x?: string };

export type ChapterRef = { name: string; slug: string; city?: string } | null;

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  photo: Img;
  chapter: ChapterRef;
  socials?: Socials;
  order?: number;
  isCore?: boolean;
};

export type Chapter = {
  _id: string;
  name: string;
  slug: string;
  city: string;
  lat: number;
  lng: number;
  lead: Pick<TeamMember, "name" | "role" | "photo" | "socials"> | null;
  instagram?: string;
  linkedin?: string;
  memberCount?: number;
  about?: string;
  screeningVenue?: string;
  cover: Img;
};

export type ClubEvent = {
  _id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  venue?: string;
  mapUrl?: string;
  chapter: ChapterRef;
  type: EventType;
  league: League;
  opponent?: string;
  cover: Img;
  summary?: string;
  description?: PortableTextBlock[];
  schedule?: { time: string; item: string }[];
  rsvpUrl?: string;
  gallery?: Img[];
  recap?: string;
  impactStats?: { label: string; value: string }[];
};

export type Initiative = {
  _id: string;
  title: string;
  date?: string;
  chapter: ChapterRef;
  summary?: string;
  impact?: string;
  images?: Img[];
};

export type Milestone = { _id: string; year: number; title: string; description?: string };
export type Faq = { _id: string; question: string; answer: string };

export type GalleryItem = {
  id: string;
  kind: "photo" | "video";
  image: Img;
  videoUrl?: string;
  /** used for placeholder tiles + masonry layout */
  ratio: number;
  chapterSlug?: string;
  eventSlug?: string;
  eventTitle?: string;
  year?: number;
  caption?: string;
};

export type Album = {
  _id: string;
  title: string;
  date?: string;
  chapter: ChapterRef;
  eventSlug?: string;
  items: GalleryItem[];
};

export type Pillar = { title: string; description: string; icon: string };

export type SiteSettings = {
  tagline: string;
  intro: string;
  logo: Img;
  stats: { members: number; events: number; cities: number; years: number };
  recognition: { title: string; note: string; badge: Img; proof: Img; proofFileUrl?: string };
  pillars: Pillar[];
  mission: string;
  vision: string;
  values: string[];
  story: string;
  whatsappLink?: string;
  contactEmail?: string;
  contactPhone?: string;
  highlights: { image: Img; videoUrl?: string; caption?: string }[];
  trophies: Trophy[];
  glory: GloryMoment[];
};

export type Trophy = { league: "IPL" | "WPL"; year: number; title?: string; note?: string };
export type GloryMoment = { title: string; year?: number; league?: string; image: Img; videoUrl?: string };

export type InstaPost = {
  id: string;
  account: string; // config key
  handle: string;
  chapterSlug?: string;
  caption: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl: string | null;
  thumbnailUrl?: string | null;
  permalink: string;
  timestamp: string;
  placeholder?: boolean;
};
