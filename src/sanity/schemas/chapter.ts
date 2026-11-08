import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./helpers";

export default defineType({
  name: "chapter",
  title: "Chapter",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "city", type: "string", validation: (r) => r.required() }),
    defineField({ name: "lat", title: "Latitude", type: "number", validation: (r) => r.required().min(11).max(19) }),
    defineField({ name: "lng", title: "Longitude", type: "number", validation: (r) => r.required().min(74).max(79) }),
    defineField({ name: "lead", type: "reference", to: [{ type: "teamMember" }] }),
    defineField({ name: "instagram", title: "Instagram handle (without @)", type: "string" }),
    defineField({ name: "linkedin", type: "url" }),
    defineField({ name: "memberCount", type: "number" }),
    defineField({ name: "about", type: "text", rows: 3 }),
    defineField({ name: "screeningVenue", title: "Usual screening venue", type: "string" }),
    imageWithAlt("cover", "Cover image"),
  ],
  preview: { select: { title: "name", subtitle: "city", media: "cover" } },
});
