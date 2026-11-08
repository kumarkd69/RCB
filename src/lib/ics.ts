import type { ClubEvent } from "./types";
import { site } from "./config";

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s = "") => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\;");

export function eventToIcs(e: ClubEvent) {
  const start = new Date(e.date);
  const end = e.endDate ? new Date(e.endDate) : new Date(start.getTime() + 3 * 3600_000);
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Namma RCB HQ//Events//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e._id}@nammarcbhq`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc((e.summary ?? "") + "\n" + site.url + "/events/" + e.slug)}`,
    `LOCATION:${esc(e.venue ?? "")}`,
    `URL:${site.url}/events/${e.slug}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export function googleCalUrl(e: ClubEvent) {
  const start = new Date(e.date);
  const end = e.endDate ? new Date(e.endDate) : new Date(start.getTime() + 3 * 3600_000);
  const p = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${stamp(start)}/${stamp(end)}`, details: e.summary ?? "", location: e.venue ?? "" });
  return `https://calendar.google.com/calendar/render?${p}`;
}
