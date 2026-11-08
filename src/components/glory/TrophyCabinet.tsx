"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Trophy } from "@/lib/types";
import { useMotion } from "../layout/MotionProvider";
import { useNearViewport } from "@/lib/useScrollProgress";

function Summary({ trophies }: { trophies: Trophy[] }) {
  const rows = (["IPL", "WPL"] as const).map((l) => ({ l, years: trophies.filter((t) => t.league === l).map((t) => t.year).sort() }));
  return (
    <table className="w-full min-w-[19rem] text-left [&_td]:pr-5 [&_th]:pr-5">
      <caption className="sr-only">RCB trophies by league</caption>
      <thead><tr className="text-xs text-muted"><th className="pb-2 font-normal">League</th><th className="pb-2 font-normal">Titles</th><th className="pb-2 font-normal">Years</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.l} className="border-t border-line">
            <td className="py-3 display text-2xl">{r.l === "IPL" ? "IPL (Men's)" : "WPL (Women's)"}</td>
            <td className="py-3 display text-4xl tabular-nums text-gold">{r.years.length}</td>
            <td className="py-3 text-lg">{r.years.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Pinned "trophy cabinet": the trophy video plays while you scroll through each title,
 * with giant outlined years and confetti that intensifies. Ends on a league summary.
 */
export default function TrophyCabinet({ trophies }: { trophies: Trophy[] }) {
  const list = [...trophies].sort((a, b) => a.year - b.year || a.league.localeCompare(b.league));
  const steps = list.length + 1;
  const { reduced } = useMotion();
  const vid = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);
  const progress = useRef({ value: 0 });
  const [i, setI] = useState(0);
  const animated = !reduced;
  const near = useNearViewport(section, "400px", animated);

  useEffect(() => {
    if (!animated || !section.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: section.current, start: "top top", end: "bottom bottom",
      onUpdate: (s) => {
        progress.current.value = s.progress;
        setI(Math.min(steps - 1, Math.floor(s.progress * steps * 0.999)));
        section.current?.style.setProperty("--p", String(s.progress));
      },
      onToggle: (s) => { const v = vid.current; if (!v) return; if (s.isActive) v.play().catch(() => {}); else v.pause(); },
    });
    return () => st.kill();
  }, [animated, steps]);

  if (!animated) {
    return (
      <section aria-labelledby="trophies" className="container-x py-24">
        <p className="eyebrow mb-3">Trophy cabinet</p>
        <h2 id="trophies" className="display text-6xl">RCB&apos;s {list.length} titles</h2>
        <div className="mt-10 grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/trophy.jpg" alt="Gold championship trophy with red Champions ribbons" className="mx-auto w-full max-w-md mix-blend-lighten" loading="lazy" />
          <div>
            <ul className="mb-8 grid grid-cols-2 gap-3">{list.map((t) => <li key={`${t.league}${t.year}`} className="glass rounded-2xl p-4"><p className="display text-4xl text-gradient-gold">{t.year}</p><p className="text-sm text-muted">{t.league} Champions</p></li>)}</ul>
            <Summary trophies={list} />
          </div>
        </div>
      </section>
    );
  }

  const cur = list[i];
  return (
    <section ref={section} aria-labelledby="trophies" className="relative" style={{ height: `${steps * 100}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden bg-black">
        {/* backdrop */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(215,25,32,.22),transparent_60%)]" />

        {/* giant outlined year behind the trophy */}
        {/* Trophy video */}
        <div className="absolute inset-0">
          {/* Studio-black video blended with "lighten" so only the trophy shows over the page */}
          <div className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 mix-blend-lighten md:left-[62%] md:top-1/2">
            <video
              ref={vid}
              src={near ? "/media/trophy.mp4" : undefined}
              poster="/media/trophy.jpg"
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              className="h-[46svh] w-auto max-w-none object-contain [transform:scale(calc(0.92_+_var(--p,0)_*_0.16))] sm:h-[70svh] md:h-[92svh]"
            />
          </div>
        </div>

        {/* Year as one word, solid, on the calm left side of the trophy (above it on mobile) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[23%] flex justify-center md:inset-y-0 md:top-0 md:items-center md:justify-start md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={i} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                {cur && <span className="display block text-[clamp(4.5rem,13vw,13rem)] leading-[0.85] tabular-nums text-gold">{cur.year}</span>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* copy */}
        <div className="container-x pointer-events-none relative flex h-full flex-col justify-between py-24 md:py-28">
          <div>
            <p className="eyebrow mb-2">Trophy cabinet</p>
            <h2 id="trophies" className="display text-4xl md:text-6xl">RCB&apos;s {list.length} titles</h2>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45 }} className="pointer-events-auto max-w-md rounded-[var(--radius)] border border-line bg-black/75 p-5 backdrop-blur-md">
                {cur ? (
                  <>
                    <p className="text-xs text-gold">Title {i + 1} of {list.length} · {cur.league === "IPL" ? "Men's" : "Women's"}</p>
                    <p className="display mt-1 text-4xl md:text-5xl">{cur.league} {cur.year}</p>
                    <p className="mt-1 text-muted">{cur.title ?? `${cur.league} Champions`}</p>
                  </>
                ) : (
                  <Summary trophies={list} />
                )}
              </motion.div>
            </AnimatePresence>
            <ol className="flex gap-2" aria-label="Titles">
              {list.map((t, k) => (
                <li key={k} className="flex flex-col items-center gap-1">
                  <span className={`h-1.5 w-10 rounded-full transition-colors duration-500 md:w-14 ${k <= i ? "bg-gold" : "bg-white/15"}`} />
                  <span className={`text-xs ${k === i ? "text-gold" : "text-muted"}`}>{t.league} {String(t.year).slice(2)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        {/* screen-reader summary of the whole cabinet */}
        <div className="sr-only"><Summary trophies={list} /></div>
      </div>
    </section>
  );
}
