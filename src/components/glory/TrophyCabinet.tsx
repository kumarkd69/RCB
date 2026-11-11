"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import type { Trophy } from "@/lib/types";
import { useMotion } from "../layout/MotionProvider";
import { cn } from "@/lib/utils";

/**
 * Trophy cabinet. The section pins while you scroll through it: the cup turns a little
 * with every scroll (frames of the trophy video drawn to a canvas) and RCB's titles
 * appear one by one along a milestone line, in the order they were won.
 * Reduced motion: no pinning, a still of the cup and the full timeline.
 */

const FRAMES = 95;
const frame = (i: number) => `/media/trophy-frames/${String(i + 1).padStart(3, "0")}.webp`;
const LEAGUE = { IPL: "Indian Premier League", WPL: "Women's Premier League" } as const;
const side = (t: Trophy) => (t.league === "WPL" ? "Women's team" : "Men's team");
const fmt = (d?: string) => (d ? new Date(d + "T12:00:00+05:30").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");

function Milestones({ list, active, done }: { list: Trophy[]; active: number; done: boolean }) {
  return (
    <ol className="relative">
      {list.map((t, i) => {
        const state = done || i < active ? "past" : i === active ? "now" : "next";
        return (
          <li key={`${t.league}${t.year}`} className="relative pb-3 pl-10 last:pb-0 md:pb-8">
            {/* node */}
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full border-2 transition-colors duration-500",
                state === "next" ? "border-white/20 bg-black" : "border-gold bg-gold",
              )}
            >
              {state !== "next" && <span className="h-2 w-2 rounded-full bg-black" />}
            </span>
            <div className={cn("transition-opacity duration-500", state === "next" ? "opacity-30" : state === "past" ? "opacity-70" : "opacity-100")}>
              <p className="text-sm text-muted">{side(t)} · {fmt(t.date) || t.year}</p>
              <p className={cn("display leading-none transition-[font-size] duration-500", state === "now" ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl")}>
                <span className="tabular-nums text-gold">{t.year}</span> {t.league}
              </p>
              <div className={cn("grid transition-[grid-template-rows] duration-500", state === "now" ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <p className="mt-2 text-lg">{t.title ?? `${LEAGUE[t.league]} champions`}</p>
                  {t.result && <p className="text-muted">{t.result}{t.venue ? `, ${t.venue}` : ""}</p>}
                  {t.note && <p className="mt-1 hidden text-sm text-gold md:block">{t.note}</p>}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function TrophyCabinet({ trophies }: { trophies: Trophy[]; videoUrl?: string }) {
  const list = [...trophies].sort((a, b) => (a.date ?? `${a.year}`).localeCompare(b.date ?? `${b.year}`));
  const { reduced } = useMotion();
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const current = useRef(0);
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const fill = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0, 1, 1]);

  const draw = (target: number) => {
    const c = canvas.current;
    if (!c) return;
    let img: HTMLImageElement | null = null;
    for (let d = 0; d < FRAMES && !img; d++) {
      const a = images.current[target - d], b = images.current[target + d];
      img = (a?.complete && a.naturalWidth ? a : null) || (b?.complete && b.naturalWidth ? b : null);
    }
    if (!img) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    const s = Math.min(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  };

  // start loading frames when the section is close
  useEffect(() => {
    if (reduced || !section.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "800px 0px" });
    io.observe(section.current);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!near) return;
    const c = canvas.current!;
    const fit = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr; draw(current.current); };
    fit();
    window.addEventListener("resize", fit);
    images.current = new Array(FRAMES).fill(null);
    const order: number[] = [];
    const seen = new Set<number>();
    for (const step of [FRAMES, 8, 4, 2, 1]) for (let i = 0; i < FRAMES; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
    let idx = 0, inflight = 0, stop = false;
    const next = () => {
      while (!stop && inflight < 6 && idx < order.length) {
        const i = order[idx++];
        const img = new Image();
        inflight++;
        img.onload = img.onerror = () => { inflight--; if (i === 0 || i === current.current) draw(current.current); next(); };
        img.src = frame(i);
        images.current[i] = img;
      }
    };
    next();
    return () => { stop = true; window.removeEventListener("resize", fit); };
  }, [near]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduced) return;
    // the cup turns a little with every scroll
    const f = Math.min(FRAMES - 1, Math.round(v * (FRAMES - 1)));
    if (f !== current.current) { current.current = f; requestAnimationFrame(() => draw(f)); }
    // one milestone per step, the last step shows them all
    setActive(Math.min(list.length, Math.floor(v * (list.length + 1) * 0.999)));
  });

  const heading = (
    <div>
      <p className="eyebrow mb-3">Trophy cabinet</p>
      <h2 id="trophies" className="display text-5xl md:text-6xl">RCB&apos;s {list.length} titles</h2>
      <p className="mt-2 hidden max-w-md text-muted md:block">First the women, then the men. Then both, again.</p>
    </div>
  );

  const done = active >= list.length;
  return (
    <section ref={section} aria-labelledby="trophies" className="relative bg-black" style={{ height: reduced ? "auto" : `${(list.length + 1) * 70 + 30}vh` }}>
      {reduced ? (
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={frame(0)} alt="Gold trophy with red Champions ribbons" className="mx-auto w-full max-w-sm" loading="lazy" />
          <div>{heading}<div className="mt-8"><Milestones list={list} active={list.length} done /></div></div>
        </div>
      ) : (
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_55%,rgba(203,161,53,.12),transparent_55%)]" />
        <div className="container-x relative grid h-full items-center gap-4 pb-6 pt-20 md:grid-cols-[1fr_1fr] md:gap-10 md:py-0">
          {/* cup */}
          <div className="relative h-[26svh] md:h-[78svh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frame(0)} alt="" aria-hidden className={cn("absolute inset-0 h-full w-full object-contain transition-opacity", near ? "opacity-0" : "opacity-100")} />
            <canvas ref={canvas} aria-label="RCB's trophy, turning as you scroll" role="img" className="absolute inset-0 h-full w-full" />
          </div>

          {/* timeline */}
          <div>
            {heading}
            <div className="relative mt-4 md:mt-10">
              {/* connector line: grey track, gold fill as you scroll */}
              <span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-0.5 bg-white/15" />
              <motion.span aria-hidden style={{ scaleY: fill }} className="absolute bottom-3 left-[11px] top-3 w-0.5 origin-top bg-gold" />
              <Milestones list={list} active={Math.min(active, list.length - 1)} done={done} />
            </div>
          </div>
        </div>
      </div>
      )}
    </section>
  );
}
