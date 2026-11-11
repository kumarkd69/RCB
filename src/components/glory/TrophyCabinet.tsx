"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import type { Trophy } from "@/lib/types";
import { useMotion } from "../layout/MotionProvider";
import { cn } from "@/lib/utils";

/**
 * One-screen trophy cabinet: the trophy video on the right, RCB's titles on the left.
 * The highlighted title changes every few seconds while in view; tap a year to pick one.
 */
export default function TrophyCabinet({ trophies, videoUrl }: { trophies: Trophy[]; videoUrl?: string }) {
  const list = [...trophies].sort((a, b) => a.year - b.year || a.league.localeCompare(b.league));
  const { reduced } = useMotion();
  const ref = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [i, setI] = useState(list.length - 1);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (inView && !reduced) v.play().catch(() => {}); else v.pause();
  }, [inView, reduced]);

  useEffect(() => {
    if (!inView || reduced || !auto) return;
    const t = setInterval(() => setI((n) => (n + 1) % list.length), 2800);
    return () => clearInterval(t);
  }, [inView, reduced, auto, list.length]);

  const cur = list[i];
  const leagues = (["IPL", "WPL"] as const).map((l) => ({ l, items: list.map((t, idx) => ({ t, idx })).filter((x) => x.t.league === l) }));

  return (
    <section ref={ref} aria-labelledby="trophies" className="relative overflow-hidden bg-black">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(236,28,36,.18),transparent_60%)]" />
      <div className="container-x relative grid items-center gap-6 py-14 md:grid-cols-[1fr_1.1fr] md:py-16">
        <div className="order-2 md:order-1">
          <p className="eyebrow mb-3">Trophy cabinet</p>
          <h2 id="trophies" className="display text-5xl md:text-6xl">RCB&apos;s {list.length} titles</h2>

          <div className="mt-6 h-[clamp(5rem,11vw,9.5rem)] overflow-hidden" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={i} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <p className="display text-[clamp(5rem,11vw,9.5rem)] leading-none tabular-nums text-gold">{cur.year}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-2 text-lg">{cur.league === "IPL" ? "Indian Premier League" : "Women's Premier League"} champions</p>

          <dl className="mt-8 space-y-3">
            {leagues.map(({ l, items }) => (
              <div key={l} className="flex flex-wrap items-center gap-3 border-t border-line pt-3">
                <dt className="w-32 text-sm text-muted">{l === "IPL" ? "IPL (Men's)" : "WPL (Women's)"} <span className="display ml-1 text-xl text-white">{items.length}</span></dt>
                <dd className="flex gap-2">
                  {items.map(({ t, idx }) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setI(idx); setAuto(false); }}
                      aria-pressed={idx === i}
                      className={cn("rounded-md border px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors", idx === i ? "border-gold bg-gold text-black" : "border-line text-white hover:border-gold")}
                    >
                      {t.year}
                    </button>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Studio-black video blended with "lighten" so only the trophy shows */}
        <div className="relative order-1 mx-auto h-[300px] w-full max-w-[560px] mix-blend-lighten md:order-2 md:h-[520px]">
          <video
            ref={vid}
            src={videoUrl || "/media/trophy.mp4"}
            poster="/media/trophy.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 scale-[1.35] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
