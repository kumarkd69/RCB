"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KA_PATH, KA_VIEWBOX, project } from "@/lib/karnataka";
import { site } from "@/lib/config";
import type { Chapter } from "@/lib/types";
import { Icon } from "../ui/Icon";

/**
 * 2.5D Karnataka map: extruded SVG outline on a tilted plane with chapter pins.
 * Pins are real links/buttons, so the map works with keyboard and screen readers.
 */
export default function ChapterMap({ chapters }: { chapters: Chapter[] }) {
  const plane = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(chapters[0]?.slug ?? null);
  const current = chapters.find((c) => c.slug === active);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || document.documentElement.classList.contains("reduce-motion")) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    plane.current!.style.transform = `rotateX(${32 - py * 12}deg) rotateZ(${-8 + px * 10}deg)`;
  };
  const leave = () => { if (plane.current) plane.current.style.transform = ""; };
  const hq = project(site.hq.lat, site.hq.lng);
  const layers = [24, 18, 12, 6];

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div onPointerMove={move} onPointerLeave={leave} className="relative mx-auto aspect-[4/5] w-full max-w-xl [perspective:1400px]">
        <div ref={plane} className="relative h-full w-full transition-transform duration-700 ease-[var(--ease-out)] [transform-style:preserve-3d] [transform:rotateX(32deg)_rotateZ(-8deg)]">
          <svg viewBox={`0 0 ${KA_VIEWBOX.w} ${KA_VIEWBOX.h}`} className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label="Map of Karnataka with Namma RCB HQ chapters">
            <defs>
              <linearGradient id="ka-top" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2a0709" />
                <stop offset="1" stopColor="#140304" />
              </linearGradient>
              <pattern id="ka-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="rgba(201,162,39,.12)" strokeWidth="1" />
              </pattern>
            </defs>
            {/* extrusion: stacked offset copies */}
            {layers.map((o, i) => (
              <path key={o} d={KA_PATH} transform={`translate(0 ${o})`} fill={i === 0 ? "#050101" : "#1a0405"} stroke="#3d0a0d" strokeWidth="2" />
            ))}
            <path d={KA_PATH} fill="url(#ka-top)" stroke="#d71920" strokeWidth="2.5" />
            <path d={KA_PATH} fill="url(#ka-grid)" />

            {/* HQ pin */}
            <g transform={`translate(${hq.x} ${hq.y})`}>
              <circle r="14" fill="#c9a227" />
              <text x="24" y="8" fill="#e5c96a" fontSize="38" fontFamily="var(--font-anton)">HQ</text>
            </g>
          </svg>

          {/* chapter pins as HTML for a11y */}
          {chapters.map((c) => {
            const p = project(c.lat, c.lng);
            const on = c.slug === active;
            return (
              <button
                key={c._id}
                type="button"
                onClick={() => setActive(c.slug)}
                onFocus={() => setActive(c.slug)}
                onMouseEnter={() => setActive(c.slug)}
                aria-pressed={on}
                aria-label={`${c.name} chapter`}
                style={{ left: `${(p.x / KA_VIEWBOX.w) * 100}%`, top: `${(p.y / KA_VIEWBOX.h) * 100}%` }}
                className={`group absolute -translate-x-1/2 -translate-y-full [transform-style:preserve-3d] ${on ? "z-20" : "z-10"}`}
              >
                <span className="relative block origin-bottom [transform:rotateX(-32deg)]">
                  <span className={`relative flex flex-col items-center transition-transform duration-300 ${on ? "-translate-y-2 scale-110" : "group-hover:-translate-y-1"}`}>
                    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold shadow-lg transition-opacity ${on ? "bg-gold text-black opacity-100" : "bg-red text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>{c.name}</span>
                    <span className={`h-6 w-0.5 ${on ? "bg-gold" : "bg-red"}`} />
                    <span className={`h-3 w-3 rounded-full ${on ? "bg-gold" : "bg-red"}`} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div aria-live="polite" className="min-h-64">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div key={current.slug} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="glass rounded-[var(--radius)] p-6 md:p-8">
              <p className="text-xs text-muted">{current.city}</p>
              <h3 className="display mt-1 text-5xl">{current.name}</h3>
              <p className="mt-3 text-muted">{current.about}</p>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted">Lead</dt><dd className="font-semibold">{current.lead?.name ?? "TBA"}</dd></div>
                <div><dt className="text-muted">Members</dt><dd className="font-semibold">{current.memberCount ? current.memberCount.toLocaleString("en-IN") : "Growing"}</dd></div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/chapters/${current.slug}`} className="inline-flex items-center gap-2 rounded-full bg-red px-5 py-2 text-sm font-semibold hover:bg-red-deep">Visit chapter <Icon name="arrow" className="h-4 w-4" /></Link>
                {current.instagram && <a href={`https://www.instagram.com/${current.instagram}/`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm hover:border-gold hover:text-gold"><Icon name="instagram" className="h-4 w-4" />@{current.instagram}</a>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="mt-4 text-sm text-muted">No chapter near you? <Link href="/chapters#start" className="text-gold underline-offset-4 hover:underline">Start one in your city →</Link></p>
      </div>
    </div>
  );
}
