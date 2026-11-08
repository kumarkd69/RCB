import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Club content")
    .items([
      S.listItem().title("⚙️ Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("event").title("📅 Events"),
      S.documentTypeListItem("album").title("🖼️ Photo albums"),
      S.documentTypeListItem("initiative").title("❤️ Initiatives"),
      S.divider(),
      S.documentTypeListItem("chapter").title("📍 Chapters"),
      S.documentTypeListItem("teamMember").title("👥 Team"),
      S.documentTypeListItem("milestone").title("🏆 Milestones"),
      S.documentTypeListItem("faq").title("❓ FAQ"),
    ]);
