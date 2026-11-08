"use client";
import { useMemo, useState } from "react";
import { instagramAccounts } from "@/lib/config";
import type { InstaPost } from "@/lib/types";
import { cn } from "@/lib/utils";
import Media from "../ui/Media";
import { Icon } from "../ui/Icon";

/** Merged Instagram feed from all club handles, filterable by chapter. */
export default function InstagramGrid({ posts, connected, limit = 12, filters = true }: { posts: InstaPost[]; connected: boolean; limit?: number; filters?: boolean }) {
  const [acc, setAcc] = useState("all");
  const shown = useMemo(() => (acc === "all" ? posts : posts.filter((p) => p.account === acc)).slice(0, limit), [posts, acc, limit]);
  return (
    <div>
      {filters && <div role="group" aria-label="Filter Instagram by chapter" className="mb-6 flex flex-wrap gap-2">
        {[{ key: "all", label: "All", handle: "" }, ...instagramAccounts.filter((a) => a.handle)].map((a) => (
          <button key={a.key} onClick={() => setAcc(a.key)} aria-pressed={acc === a.key} className={cn("rounded-full border px-4 py-1.5 text-sm transition", acc === a.key ? "border-red bg-red text-white" : "border-line text-muted hover:text-text")}>
            {a.label}
          </button>
        ))}
      </div>}
      {!connected && (
        <p className="mb-4 rounded-xl border border-dashed border-gold/40 bg-gold/5 px-4 py-3 text-sm text-gold-soft">
          Instagram isn&apos;t connected yet, so these are placeholders linking to each profile. See README → Instagram.
        </p>
      )}
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {shown.map((p, i) => {
          const src = p.mediaType === "VIDEO" ? p.thumbnailUrl : p.mediaUrl;
          return (
            <li key={p.id} className="group relative aspect-square overflow-hidden rounded-xl">
              <a href={p.permalink} target="_blank" rel="noopener noreferrer" className="block h-full w-full" aria-label={`Instagram post by @${p.handle}: ${p.caption.slice(0, 80)}`}>
                {/* Instagram CDN URLs expire, so use a plain img instead of next/image optimisation */}
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={p.caption.slice(0, 120) || `Post by @${p.handle}`} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <Media img={null} seed={i} label={`@${p.handle}`} />
                )}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 text-xs font-semibold"><Icon name="instagram" className="h-4 w-4 text-red" />@{p.handle}</span>
                  <span className="mt-1 line-clamp-2 text-xs text-white/80">{p.caption}</span>
                </div>
                {p.mediaType === "VIDEO" && <Icon name="play" className="absolute right-2 top-2 h-5 w-5 drop-shadow" />}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
