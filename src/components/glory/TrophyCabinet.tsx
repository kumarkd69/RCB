"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Trophy } from "@/lib/types";
import { useMotion } from "../layout/MotionProvider";
import { useNearViewport } from "@/lib/useScrollProgress";
import TrophySvg from "./TrophySvg";

const TrophyScene = dynamic(() => import("./TrophyScene"), { ssr: false });

function Summary({ trophies }: { trophies: Trophy[] }) {
  const rows = (["IPL", "WPL"] as const).map((l) => ({ l, years: trophies.filter((t) => t.league === l).map((t) => t.year).sort() }));
  return (
    <table className="w-full min-w-[19rem] text-left [&_td]:pr-5 [&_th]:pr-5">
      <caption className="sr-only">RCB trophies by league</caption>
      <thead><tr className="text-[10px] uppercase tracking-[0.25em] text-muted"><th className="pb-2 font-normal">League</th><th className="pb-2 font-normal">Titles</th><th className="pb-2 font-normal">Years</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.l} className="border-t border-line">
            <td className="py-3 display text-2xl">{r.l === "IPL" ? "IPL (Men's)" : "WPL (Women's)"}</td>
            <td className="py-3 display text-4xl text-gradient-gold">{r.years.length}</td>
            <td className="py-3 text-lg">{r.years.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Pinned "trophy cabinet": a 3D gold trophy spins as you scroll through each title,
 * with giant outlined years and confetti that intensifies. Ends on a league summary.
 */
export default function TrophyCabinet({ trophies }: { trophies: Trophy[] }) {
  const list = [...trophies].sort((a, b) => a.year - b.year || a.league.localeCompare(b.league));
  const steps = list.length + 1;
  const { reduced, lowEnd } = useMotion();
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
      onUpdate: (s) => { progress.current.value = s.progress; setI(Math.min(steps - 1, Math.floor(s.progress * steps * 0.999))); },
    });
    return () => st.kill();
  }, [animated, steps]);

  if (!animated) {
    return (
      <section aria-labelledby="trophies" className="container-x py-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">Trophy cabinet</p>
        <h2 id="trophies" className="display text-6xl">{list.length} titles. <span className="text-red">One family.</span></h2>
        <div className="mt-10 grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
          <TrophySvg className="mx-auto w-48" />
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
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* backdrop */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(201,162,39,.18),transparent_55%),radial-gradient(ellipse_at_50%_100%,rgba(215,25,32,.35),transparent_60%)]" />
        <div aria-hidden className="beam left-[20%]" style={{ ["--r" as string]: "-14deg" }} />
        <div aria-hidden className="beam right-[20%]" style={{ ["--r" as string]: "14deg", animationDelay: "-4s" }} />

        {/* giant outlined year behind the trophy */}
        <AnimatePresence mode="popLayout">
          <motion.p
            key={cur ? cur.year + cur.league : "all"}
            aria-hidden
            initial={{ y: "40%", opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-40%", opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="display text-outline pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[clamp(8rem,32vw,30rem)] leading-none"
          >
            {cur ? cur.year : list.length}
          </motion.p>
        </AnimatePresence>

        {/* 3D trophy */}
        <div className="absolute inset-0">
          {near && !lowEnd ? <TrophyScene progress={progress} /> : <div className="grid h-full place-items-center"><TrophySvg className="h-[45vh] w-auto drop-shadow-[0_0_60px_rgba(201,162,39,.4)]" /></div>}
        </div>

        {/* copy */}
        <div className="container-x pointer-events-none relative flex h-full flex-col justify-between py-24 md:py-28">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">Trophy cabinet</p>
            <h2 id="trophies" className="display text-4xl md:text-6xl">RCB&apos;s <span className="text-gradient-gold">{list.length} titles</span></h2>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45 }} className="glass pointer-events-auto max-w-md rounded-[var(--radius)] p-5">
                {cur ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">Title {i + 1} of {list.length} · {cur.league === "IPL" ? "Men's" : "Women's"}</p>
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
                  <span className={`text-[10px] tracking-widest ${k === i ? "text-gold" : "text-muted"}`}>{t.league} {String(t.year).slice(2)}</span>
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
