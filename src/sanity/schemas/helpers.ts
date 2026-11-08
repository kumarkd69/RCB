import { defineField } from "sanity";

/** Image field with a REQUIRED alt text (accessibility rule). */
export const imageWithAlt = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text (describe the photo for blind visitors)",
        type: "string",
        validation: (r) => r.required().error("Alt text is required"),
      }),
    ],
    validation: required ? (r) => r.required() : undefined,
  });

export const socialsField = defineField({
  name: "socials",
  title: "Social links",
  type: "object",
  fields: [
    defineField({ name: "instagram", title: "Instagram handle (without @)", type: "string" }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "x", title: "X / Twitter URL", type: "url" }),
  ],
});

export const EVENT_TYPES = [
  { title: "Screening", value: "screening" },
  { title: "Social Initiative", value: "social" },
  { title: "Fan Meet", value: "fanmeet" },
  { title: "Away Trip", value: "awaytrip" },
];
export const LEAGUES = [
  { title: "IPL", value: "ipl" },
  { title: "WPL", value: "wpl" },
  { title: "Off-season", value: "offseason" },
];
