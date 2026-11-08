"use client";
import { useMemo, useState } from "react";
import type { Album, Chapter } from "@/lib/types";
import { cn } from "@/lib/utils";
import MasonryLightbox from "./MasonryLightbox";

export default function GalleryExplorer({ albums, chapters }: { albums: Album[]; chapters: Chapter[] }) {
  const all = useMemo(() => albums.flatMap((a) => a.items), [albums]);
  const years = useMemo(() => [...new Set(all.map((i) => i.year).filter(Boolean))].sort((a, b) => b! - a!) as number[], [all]);
  const [f, setF] = useState({ chapter: "all", event: "all", year: "all", kind: "all" });
  const items = all.filter((i) =>
    (f.chapter === "all" || (f.chapter === "hq" ? !i.chapterSlug : i.chapterSlug === f.chapter)) &&
    (f.event === "all" || i.eventSlug === f.event) &&
    (f.year === "all" || String(i.year) === f.year) &&
    (f.kind === "all" || i.kind === f.kind));

  const sel = (label: string, key: keyof typeof f, opts: [string, string][]) => (
    <label className="flex flex-col gap-1 text-xs text-muted">
      {label}
      <select value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })} className="glass max-w-56 rounded-full px-4 py-2 text-sm normal-case tracking-normal text-text">
        <option value="all">All</option>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end gap-4">
        {sel("Chapter", "chapter", [["hq", "HQ"], ...chapters.map((c) => [c.slug, c.name] as [string, string])])}
        {sel("Event", "event", albums.filter((a) => a.eventSlug).map((a) => [a.eventSlug!, a.title]))}
        {sel("Year", "year", years.map((y) => [String(y), String(y)]))}
        <div role="group" aria-label="Media type" className="glass flex rounded-full p-1">
          {[["all", "All"], ["photo", "Photos"], ["video", "Videos"]].map(([v, l]) => (
            <button key={v} onClick={() => setF({ ...f, kind: v })} aria-pressed={f.kind === v} className={cn("rounded-full px-4 py-1.5 text-sm", f.kind === v ? "bg-red" : "text-muted")}>{l}</button>
          ))}
        </div>
      </div>
      <MasonryLightbox items={items} />
    </div>
  );
}
