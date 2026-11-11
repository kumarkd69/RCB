import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./helpers";

export default defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "tagline", title: "Hero tagline", type: "string" }),
    defineField({ name: "intro", title: "Who we are (short intro)", type: "text", rows: 4 }),
    imageWithAlt("logo", "Club logo"),
    defineField({
      name: "stats",
      title: "Stats",
      type: "object",
      fields: [
        defineField({ name: "members", type: "number" }),
        defineField({ name: "events", type: "number" }),
        defineField({ name: "cities", type: "number" }),
        defineField({ name: "years", type: "number" }),
      ],
    }),
    defineField({
      name: "recognition",
      title: "Official recognition",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "note", type: "text", rows: 3 }),
        imageWithAlt("badge", "Badge image"),
        imageWithAlt("proof", "Proof letter / certificate"),
        defineField({ name: "proofFile", title: "Proof (PDF)", type: "file" }),
      ],
    }),
    defineField({
      name: "pillars",
      title: "What we do (pillars)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "description", type: "text", rows: 2 }),
            defineField({
              name: "icon",
              type: "string",
              options: { list: ["screen", "heart", "users", "bus", "drop", "leaf", "star"] },
            }),
            defineField({ name: "frequency", title: "How often (e.g. Every RCB match)", type: "string" }),
            imageWithAlt("image", "Photo (the first activity is shown large on the home page)"),
          ],
        },
      ],
    }),
    defineField({ name: "mission", type: "text", rows: 3 }),
    defineField({ name: "vision", type: "text", rows: 3 }),
    defineField({ name: "values", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "story", title: "Our story (short)", type: "text", rows: 5 }),
    defineField({ name: "heroVideo", title: "Home page video (mp4, muted, under 10 MB)", type: "file", options: { accept: "video/mp4" } }),
    defineField({ name: "trophyVideo", title: "Trophy video (mp4 on a black background)", type: "file", options: { accept: "video/mp4" } }),
    defineField({ name: "whatsappLink", title: "WhatsApp community link", type: "url" }),
    defineField({ name: "contactEmail", type: "string" }),
    defineField({ name: "contactPhone", type: "string" }),
    defineField({
      name: "highlights",
      title: "Highlights reel",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            imageWithAlt("image", "Image / video poster", true),
            defineField({ name: "videoUrl", title: "Video URL (mp4 or YouTube)", type: "url" }),
            defineField({ name: "caption", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "trophies",
      title: "RCB trophy cabinet",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "league", type: "string", options: { list: ["IPL", "WPL"] }, validation: (r) => r.required() }),
            defineField({ name: "year", type: "number", validation: (r) => r.required() }),
            defineField({ name: "date", title: "Date of the final (sets the order)", type: "date" }),
            defineField({ name: "title", type: "string" }),
            defineField({ name: "result", title: "Result (e.g. Beat Delhi Capitals by 8 wickets)", type: "string" }),
            defineField({ name: "venue", type: "string" }),
            defineField({ name: "note", type: "string" }),
          ],
          preview: { select: { title: "league", subtitle: "year" } },
        },
      ],
    }),
    defineField({
      name: "glory",
      title: "Glory moments (winning photos / videos)",
      description: "Only upload media the club owns or has permission to use.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "year", type: "number" }),
            defineField({ name: "league", type: "string", options: { list: ["IPL", "WPL"] } }),
            imageWithAlt("image", "Photo / video poster", true),
            defineField({ name: "video", title: "Video file (mp4, optional)", type: "file", options: { accept: "video/mp4" } }),
            defineField({ name: "videoUrl", title: "…or video URL (mp4)", type: "url" }),
          ],
          preview: { select: { title: "title", subtitle: "year", media: "image" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
