"use client";
import { useRef, useState } from "react";
import { KA_PATH, KA_VIEWBOX, project } from "@/lib/karnataka";
import { instagramAccounts, site } from "@/lib/config";
import type { Chapter } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Icon } from "../ui/Icon";

type Pin = { key: string; name: string; sub: string; lat: number; lng: number; handle: string; members?: number };

/** close cities get their labels on opposite sides of the pin (Belagavi/Hubballi, Bengaluru/Kolar) */
const BELOW = new Set(["hubballi", "kolar"]);

const MAIN = instagramAccounts.find((a) => a.key === "main")!.handle!;

/** Bengaluru HQ + every chapter, each linked to its own Instagram page (HQ's page if a chapter has none yet). */
function pinsFor(chapters: Chapter[]): Pin[] {
  return [
    { key: "bengaluru", name: "Bengaluru", sub: "HQ", lat: site.hq.lat, lng: site.hq.lng, handle: MAIN },
    ...chapters.map((c) => ({
      key: c.slug,
      name: c.name,
      sub: "Chapter",
      lat: c.lat,
      lng: c.lng,
      members: c.memberCount,
      handle: c.instagram || instagramAccounts.find((a) => a.chapterSlug === c.slug)?.handle || MAIN,
    })),
  ];
}

const ig = (h: string) => `https://www.instagram.com/${h}/`;

/**
 * 2.5D Karnataka map with tappable city pins. Tapping a pin (or a row in the list)
 * opens that chapter's Instagram page in a new tab.
 */
export default function ChapterMap({ chapters }: { chapters: Chapter[] }) {
  const plane = useRef<HTMLDivElement>(null);
  const pins = pinsFor(chapters);
  const [hover, setHover] = useState<string | null>(null);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || document.documentElement.classList.contains("reduce-motion")) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    plane.current!.style.transform = `rotateX(${28 - py * 10}deg) rotateZ(${-6 + px * 8}deg)`;
  };
  const leave = () => { if (plane.current) plane.current.style.transform = ""; };

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div onPointerMove={move} onPointerLeave={leave} className="relative mx-auto aspect-[4/5] w-full max-w-md [perspective:1400px] lg:max-w-lg">
        <div ref={plane} className="relative h-full w-full transition-transform duration-700 ease-[var(--ease-out)] [transform-style:preserve-3d] [transform:rotateX(28deg)_rotateZ(-6deg)]">
          <svg viewBox={`0 0 ${KA_VIEWBOX.w} ${KA_VIEWBOX.h}`} className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label="Map of Karnataka with Namma RCB HQ in Bengaluru, Hubballi, Kolar and Belagavi">
            <defs>
              <pattern id="ka-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="rgba(203,161,53,.14)" strokeWidth="1" />
              </pattern>
            </defs>
            {[24, 18, 12, 6].map((o, i) => (
              <path key={o} d={KA_PATH} transform={`translate(0 ${o})`} fill={i === 0 ? "#000000" : "#141414"} stroke="#2B2B2B" strokeWidth="2" />
            ))}
            <path d={KA_PATH} fill="#121212" stroke="#EC1C24" strokeWidth="3" />
            <path d={KA_PATH} fill="url(#ka-grid)" />
          </svg>

          {pins.map((p) => {
            const pt = project(p.lat, p.lng);
            const hq = p.key === "bengaluru";
            const on = hover === p.key;
            return (
              <a
                key={p.key}
                href={ig(p.handle)}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHover(p.key)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(p.key)}
                onBlur={() => setHover(null)}
                aria-label={`${p.name} ${p.sub} on Instagram, @${p.handle}`}
                style={{ left: `${(pt.x / KA_VIEWBOX.w) * 100}%`, top: `${(pt.y / KA_VIEWBOX.h) * 100}%` }}
                className={cn("group absolute -translate-x-1/2 [transform-style:preserve-3d]", BELOW.has(p.key) ? "" : "-translate-y-full", on ? "z-30" : "z-10")}
              >
                <span className={cn("relative flex flex-col items-center", BELOW.has(p.key) ? "flex-col-reverse [transform:translateZ(2px)]" : "origin-bottom [transform:rotateX(-28deg)]")}>
                  <span className={cn("flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold shadow-lg transition-colors", p.key === "kolar" && "-translate-x-[35%]", hq || on ? "bg-gold text-black" : "bg-red text-white")}>
                    <Icon name="instagram" className="h-3.5 w-3.5" />
                    {p.name}
                  </span>
                  <span className={cn("h-5 w-0.5", hq || on ? "bg-gold" : "bg-red")} />
                  <span className={cn("rounded-full ring-4 ring-black/60 transition-transform group-hover:scale-125", hq ? "h-4 w-4 bg-gold" : "h-3 w-3 bg-red")} />
                </span>
              </a>
            );
          })}
        </div>
      </div>

      <ul className="space-y-2">
        {pins.map((p) => (
          <li key={p.key}>
            <a
              href={ig(p.handle)}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHover(p.key)}
              onMouseLeave={() => setHover(null)}
              className={cn("flex items-center justify-between gap-4 rounded-[var(--radius)] border bg-ink px-5 py-4 transition-colors", hover === p.key ? "border-gold" : "border-line")}
            >
              <span>
                <span className="display block text-3xl">{p.name}</span>
                <span className="text-sm text-muted">{p.sub}{p.members ? ` · ${p.members.toLocaleString("en-IN")} members` : ""}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
                <Icon name="instagram" className="h-4 w-4" />@{p.handle}
              </span>
            </a>
          </li>
        ))}
        <li className="pt-2 text-sm text-muted">Tap a city to open its Instagram page.</li>
      </ul>
    </div>
  );
}
