import { defineArrayMember, defineField, defineType } from "sanity";
import { EVENT_TYPES, LEAGUES, imageWithAlt } from "./helpers";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "after", title: "After the event" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "basics", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", group: "basics", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "date", title: "Start date & time", type: "datetime", group: "basics", validation: (r) => r.required() }),
    defineField({ name: "endDate", title: "End date & time (optional)", type: "datetime", group: "basics" }),
    defineField({ name: "venue", type: "string", group: "basics" }),
    defineField({ name: "mapUrl", title: "Google Maps link", type: "url", group: "basics" }),
    defineField({ name: "chapter", type: "reference", to: [{ type: "chapter" }], group: "basics" }),
    defineField({ name: "type", type: "string", group: "basics", options: { list: EVENT_TYPES, layout: "radio" }, validation: (r) => r.required() }),
    defineField({ name: "league", type: "string", group: "basics", options: { list: LEAGUES, layout: "radio" }, initialValue: "ipl" }),
    defineField({ name: "opponent", title: "Opponent (screenings only)", type: "string", group: "basics" }),
    imageWithAlt("cover", "Cover image"),
    defineField({ name: "summary", title: "One-line summary", type: "string", group: "basics" }),
    defineField({ name: "description", type: "array", group: "basics", of: [defineArrayMember({ type: "block" })] }),
    defineField({
      name: "schedule",
      type: "array",
      group: "basics",
      of: [{ type: "object", fields: [defineField({ name: "time", type: "string" }), defineField({ name: "item", type: "string" })] }],
    }),
    defineField({ name: "rsvpUrl", title: "RSVP link", type: "url", group: "basics" }),
    defineField({
      name: "gallery",
      type: "array",
      group: "after",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })],
        }),
      ],
      options: { layout: "grid" },
    }),
    defineField({ name: "recap", type: "text", rows: 4, group: "after" }),
    defineField({
      name: "impactStats",
      title: "Impact numbers",
      type: "array",
      group: "after",
      of: [{ type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "value", type: "string" })] }],
    }),
  ],
  orderings: [{ title: "Date (newest)", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", date: "date", media: "cover" }, prepare: ({ title, date, media }) => ({ title, subtitle: date ? new Date(date).toDateString() : "", media }) },
});
