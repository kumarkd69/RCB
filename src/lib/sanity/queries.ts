import { groq } from "next-sanity";

/** Image projection → { src, alt, width, height, blur } */
const img = (f: string) => `${f}{ "src": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "blur": asset->metadata.lqip }`;
const chapterRef = `chapter->{ name, "slug": slug.current, city }`;

export const settingsQuery = groq`*[_id == "siteSettings"][0]{
  tagline, intro, ${img("logo")}, stats,
  recognition{ title, note, ${img("badge")}, ${img("proof")}, "proofFileUrl": proofFile.asset->url },
  pillars[]{ title, description, icon, frequency, ${img("image")} }, "heroVideoUrl": heroVideo.asset->url, "trophyVideoUrl": trophyVideo.asset->url, mission, vision, values, story, whatsappLink, contactEmail, contactPhone,
  highlights[]{ ${img("image")}, videoUrl, caption },
  trophies[]{ league, year, title, note },
  glory[]{ title, year, league, ${img("image")}, "videoUrl": coalesce(video.asset->url, videoUrl) }
}`;

const eventFields = `_id, title, "slug": slug.current, date, endDate, venue, mapUrl, ${chapterRef}, type, league, opponent,
  ${img("cover")}, summary, description, schedule, rsvpUrl, "gallery": gallery[]{ "src": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "blur": asset->metadata.lqip }, recap, impactStats`;

export const eventsQuery = groq`*[_type == "event" && defined(slug.current)] | order(date asc){ ${eventFields} }`;
export const eventBySlugQuery = groq`*[_type == "event" && slug.current == $slug][0]{ ${eventFields} }`;

const memberFields = `_id, name, role, ${img("photo")}, ${chapterRef}, socials, order, isCore`;
export const teamQuery = groq`*[_type == "teamMember"] | order(order asc){ ${memberFields} }`;

const chapterFields = `_id, name, "slug": slug.current, city, lat, lng, lead->{ name, role, ${img("photo")}, socials }, instagram, linkedin, memberCount, about, screeningVenue, ${img("cover")}`;
export const chaptersQuery = groq`*[_type == "chapter"] | order(name asc){ ${chapterFields} }`;

export const initiativesQuery = groq`*[_type == "initiative"] | order(date desc){ _id, title, date, ${chapterRef}, summary, impact, "images": images[]{ "src": asset->url, alt } }`;
export const milestonesQuery = groq`*[_type == "milestone"] | order(year asc){ _id, year, title, description }`;
export const faqsQuery = groq`*[_type == "faq"] | order(order asc){ _id, question, answer }`;

export const albumsQuery = groq`*[_type == "album"] | order(date desc){
  _id, title, date, ${chapterRef}, "eventSlug": event->slug.current, "eventTitle": event->title,
  "items": items[]{ _key, _type, "src": coalesce(asset->url, poster.asset->url), "alt": coalesce(alt, poster.alt),
    "width": coalesce(asset->metadata.dimensions.width, poster.asset->metadata.dimensions.width),
    "height": coalesce(asset->metadata.dimensions.height, poster.asset->metadata.dimensions.height),
    "blur": coalesce(asset->metadata.lqip, poster.asset->metadata.lqip), url }
}`;
