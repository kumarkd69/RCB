"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMotion } from "../layout/MotionProvider";
import { Icon } from "../ui/Icon";
import Countdown from "../ui/Countdown";
import { fmtDate } from "@/lib/utils";
import type { ClubEvent } from "@/lib/types";

/**
 * Scroll-driven video hero. The fan footage is a sequence of frames drawn to a canvas,
 * so the video plays forward and backward exactly with the scroll (smooth on every
 * browser, including iPhone). Three story beats fade over it:
 *   1. Namma RCB HQ   2. RCB fandom is family   3. Connect · Give back · Play together
 * Reduced motion: no pinning, the first frame as a still and beat 1 only.
 */

const FRAMES = 95;
const src = (set: "d" | "m", i: number) => `/media/hero-frames/${set}/${String(i + 1).padStart(3, "0")}.webp`;
const ease = [0.22, 1, 0.36, 1] as const;

/** Load order: first frame, then every 8th, every 4th, every 2nd, then the rest, so scrubbing works early. */
function loadOrder(n: number) {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const step of [n, 8, 4, 2, 1]) for (let i = 0; i < n; i += step) if (!seen.has(i)) { seen.add(i); out.push(i); }
  return out;
}

/** Text that fades/rises in over [a,b] and out over [c,d]. "visibleAtStart" skips the fade-in. */
function Beat({ p, range, visibleAtStart, children, className }: { p: MotionValue<number>; range: [number, number, number, number]; visibleAtStart?: boolean; children: React.ReactNode; className?: string }) {
  const [a, b, c, d] = range.map((x) => Math.min(1, Math.max(0, x)));
  // always map the full 0→1 range (native scroll animations otherwise fall back at the ends)
  const input = visibleAtStart ? [0, c, d, 1] : [0, a, b, c, d, 1];
  const opacity = useTransform(p, input, visibleAtStart ? [1, 1, 0, 0] : [0, 0, 1, 1, 0, 0]);
  const y = useTransform(p, input, visibleAtStart ? [0, 0, -40, -40] : [40, 40, 0, 0, -40, -40]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  return <motion.div style={{ opacity, y, pointerEvents }} className={className}>{children}</motion.div>;
}

const pillars = [
  { n: "i.", t: "Connect", d: "Give fans a voice and one shared symbol" },
  { n: "ii.", t: "Give back", d: "Show up for the towns our fans come from" },
  { n: "iii.", t: "Play together", d: "Bring match day to where fans live, all year" },
];

export default function ScrollHero({ nextEvent }: { nextEvent: ClubEvent | null }) {
  const { reduced } = useMotion();
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const current = useRef(0);
  const [set, setSet] = useState<"d" | "m" | null>(null);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const p = scrollYProgress;
  const shade = useTransform(scrollYProgress, [0, 0.3, 0.9, 1], [0.35, 0.55, 0.7, 0.7]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const hint = useTransform(scrollYProgress, [0, 0.06, 1], [1, 0, 0]);

  useEffect(() => setSet(window.matchMedia("(max-width: 767px), (orientation: portrait)").matches ? "m" : "d"), []);

  // draw nearest loaded frame, cover-fit with the subject kept right of centre
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
    const cw = c.width, ch = c.height, s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) * 0.7, (ch - h) / 2, w, h);
  };

  // size canvas to the screen
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      draw(current.current);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [set]);

  // progressive frame loading
  useEffect(() => {
    if (!set) return;
    images.current = new Array(FRAMES).fill(null);
    const order = reduced ? [0] : loadOrder(FRAMES);
    let cancelled = false;
    let inflight = 0, idx = 0;
    const next = () => {
      while (!cancelled && inflight < 6 && idx < order.length) {
        const i = order[idx++];
        const img = new Image();
        img.decoding = "async";
        inflight++;
        img.onload = img.onerror = () => {
          inflight--;
          if (i === current.current || i === 0) draw(current.current);
          next();
        };
        img.src = src(set, i);
        images.current[i] = img;
      }
    };
    next();
    return () => { cancelled = true; };
  }, [set, reduced]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduced) return;
    const f = Math.min(FRAMES - 1, Math.max(0, Math.round(v * (FRAMES - 1))));
    if (f !== current.current) { current.current = f; requestAnimationFrame(() => draw(f)); }
  });

  return (
    <section ref={section} aria-labelledby="hero-title" className={reduced ? "relative h-[100svh] min-h-[560px]" : "relative h-[320vh]"}>
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden">
        {/* first frame as a real image for fast first paint, the canvas draws over it */}
        <picture>
          <source media="(max-width: 767px), (orientation: portrait)" srcSet={src("m", 0)} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src("d", 0)} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        </picture>
        <motion.canvas ref={canvas} style={{ scale: zoom }} aria-hidden className="absolute inset-0 h-full w-full" />
        <motion.div aria-hidden style={{ opacity: shade }} className="absolute inset-0 bg-black" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.35)_45%,transparent_75%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

        <div className="container-x relative h-full">
          {/* Beat 1: name */}
          <Beat p={p} visibleAtStart range={[0, 0, 0.18, 0.28]} className="absolute inset-x-4 bottom-24 md:inset-x-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
            <h1 id="hero-title" className="font-[family-name:var(--font-hero)] text-[clamp(3.6rem,11vw,9.5rem)] font-black italic leading-[0.88] tracking-[-0.03em]">
              <span className="block overflow-hidden pb-[0.06em] pr-[0.1em]"><motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.2 }}>Namma</motion.span></span>
              <span className="block overflow-hidden pb-[0.06em] pr-[0.1em]"><motion.span className="block text-red" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.32 }}>RCB HQ</motion.span></span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="mt-6 max-w-md text-xl font-medium leading-snug text-white/90 md:text-2xl">
              For the fans. By the fans.<br />From Bengaluru. For RCB.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.85 }} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/join" className="group inline-flex items-center gap-3 rounded-full bg-red px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-red-deep">
                Join the Community <Icon name="arrow" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/events" className="text-base font-semibold text-white/90 underline-offset-4 hover:underline">Upcoming events</Link>
            </motion.div>
          </Beat>

          {!reduced && (
            <>
              {/* Beat 2: who we are */}
              <Beat p={p} range={[0.3, 0.38, 0.55, 0.63]} className="absolute inset-x-4 bottom-24 max-w-3xl md:inset-x-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                <p className="eyebrow mb-4">Who we are</p>
                <p className="display text-[clamp(3rem,8vw,7rem)] leading-[0.92]">RCB fandom<br />is <span className="text-gold">family</span></p>
                <p className="mt-6 max-w-lg text-lg text-white/85 md:text-xl">A fan club for RCB supporters across Karnataka. We bring fans together on match days and give back to the towns we come from.</p>
              </Beat>

              {/* Beat 3: three pillars */}
              <Beat p={p} range={[0.65, 0.73, 0.985, 0.995]} className="absolute inset-x-4 bottom-20 md:inset-x-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                <p className="eyebrow mb-4">What we do</p>
                <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
                  {pillars.map((x) => (
                    <li key={x.t} className="border-t-2 border-red pt-4">
                      <span className="font-[family-name:var(--font-hero)] text-lg italic text-gold">{x.n}</span>
                      <p className="display mt-1 text-4xl md:text-6xl">{x.t}</p>
                      <p className="mt-2 text-white/80 md:text-lg">{x.d}</p>
                    </li>
                  ))}
                </ol>
                <Link href="#plan" className="mt-8 inline-flex items-center gap-2 font-semibold text-gold hover:underline">See the six initiatives <Icon name="arrow" className="h-4 w-4" /></Link>
              </Beat>

              {/* progress + scroll hint */}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
                <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-gold" />
              </div>
              <motion.div aria-hidden style={{ opacity: hint }} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-white/70 md:flex">
                Scroll to play
                <span className="h-8 w-px bg-gradient-to-b from-white/70 to-transparent" />
              </motion.div>
            </>
          )}
        </div>

        {nextEvent && (
          <motion.div style={{ opacity: hint }} className="absolute bottom-6 right-4 hidden items-center gap-5 border-l-2 border-red bg-black/60 py-3 pl-4 pr-5 backdrop-blur-md md:right-8 md:flex">
            <div>
              <p className="text-xs font-semibold text-white/60">Next up · {fmtDate(nextEvent.date, { day: "numeric", month: "short" })}</p>
              <Link href={`/events/${nextEvent.slug}`} className="font-semibold hover:text-gold">{nextEvent.title}</Link>
            </div>
            <Countdown to={nextEvent.date} compact />
          </motion.div>
        )}
      </div>
    </section>
  );
}
