import { defineArrayMember, defineField, defineType } from "sanity";

export const initiative = defineType({
  name: "initiative",
  title: "Initiative",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "pillar",
      title: "Pillar (home page plan)",
      type: "string",
      options: { list: [{ title: "Connect", value: "connect" }, { title: "Give back", value: "giveback" }, { title: "Play together", value: "play" }], layout: "radio" },
    }),
    defineField({ name: "window", title: "When (e.g. Days 21–45, Every event)", type: "string" }),
    defineField({ name: "order", title: "Display order", type: "number" }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "chapter", type: "reference", to: [{ type: "chapter" }] }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({ name: "points", title: "Key points (2–4 short lines)", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })] })],
    }),
    defineField({ name: "impact", title: "Impact (e.g. 120 units of blood)", type: "string" }),
  ],
});

export const milestone = defineType({
  name: "milestone",
  title: "Milestone",
  type: "document",
  fields: [
    defineField({ name: "year", type: "number", validation: (r) => r.required() }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
  ],
  orderings: [{ title: "Year", name: "year", by: [{ field: "year", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "year" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", initialValue: 10 }),
  ],
});

export const album = defineType({
  name: "album",
  title: "Photo album",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "chapter", type: "reference", to: [{ type: "chapter" }] }),
    defineField({ name: "event", type: "reference", to: [{ type: "event" }] }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })] }),
        defineArrayMember({
          type: "object",
          name: "video",
          fields: [
            defineField({ name: "url", type: "url", validation: (r) => r.required() }),
            defineField({ name: "poster", type: "image", fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })] }),
          ],
        }),
      ],
    }),
  ],
});
