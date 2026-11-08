import { defineField, defineType } from "sanity";
import { imageWithAlt, socialsField } from "./helpers";

export default defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    imageWithAlt("photo", "Photo"),
    defineField({ name: "role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "chapter", type: "reference", to: [{ type: "chapter" }] }),
    socialsField,
    defineField({ name: "order", title: "Display order (lower = first)", type: "number", initialValue: 10 }),
    defineField({ name: "isCore", title: "Core team?", type: "boolean", initialValue: false }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
