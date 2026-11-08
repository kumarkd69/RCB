"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotion } from "../layout/MotionProvider";
import MagneticButton from "../ui/MagneticButton";
import Countdown from "../ui/Countdown";
import { fmtDate, fmtTime } from "@/lib/utils";
import type { ClubEvent } from "@/lib/types";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function hasWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

/** Static stadium (CSS) — shown first, and permanently on low-end / reduced-motion devices. */
function StaticStadium() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_85%,#3a0a0c_0%,#0a0a0a_60%)]">
      <div className="beam left-[8%]" style={{ ["--r" as string]: "-22deg" }} />
      <div className="beam left-[30%]" style={{ ["--r" as string]: "-8deg", animationDelay: "-3s" }} />
      <div className="beam right-[30%]" style={{ ["--r" as string]: "8deg", animationDelay: "-5s" }} />
      <div className="beam right-[8%]" style={{ ["--r" as string]: "22deg", animationDelay: "-1s" }} />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(215,25,32,.35),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 [background:radial-gradient(circle,rgba(201,162,39,.6)_1px,transparent_1.5px)_0_0/14px_10px] opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]" />
    </div>
  );
}

const words = (s: string) => s.split(" ");

export default function Hero({ tagline, nextEvent }: { tagline: string; nextEvent: ClubEvent | null }) {
  const { reduced, lowEnd } = useMotion();
  const [use3D, setUse3D] = useState(false);
  const { scrollY } = useScroll();
  const crestY = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 160]);
  const crestR = useTransform(scrollY, [0, 800], [0, reduced ? 0 : -12]);

  useEffect(() => {
    if (reduced || lowEnd || window.innerWidth < 380 || !hasWebGL()) return setUse3D(false);
    // wait for idle so the 3D chunk never blocks first paint
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setUse3D(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setUse3D(true), 1200);
    return () => clearTimeout(id);
  }, [reduced, lowEnd]);

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32 md:items-center md:pb-0" aria-labelledby="hero-title">
      <div className="absolute inset-0 -z-10">
        <StaticStadium />
        {use3D && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
            <HeroScene />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
      </div>

      <div className="container-x grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
        <div className="order-2 md:order-1">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red" /></span>
          Official RCB-recognised fan club
        </motion.p>

        <h1 id="hero-title" className="display max-w-5xl text-[clamp(3.5rem,9vw,7.5rem)]">
          {["Namma", "RCB", "HQ"].map((w, i) => (
            <span key={w} className="mr-[0.2em] inline-block overflow-hidden pb-2 align-bottom">
              <motion.span className={i === 1 ? "inline-block text-red drop-shadow-[0_0_30px_rgba(215,25,32,.6)]" : "inline-block"} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <p className="mt-2 max-w-2xl text-xl text-text/90 md:text-2xl">
          {words(tagline).map((w, i) => (
            <motion.span key={i} className="mr-[0.28em] inline-block" initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: 0.8 + i * 0.06 }}>
              {w}
            </motion.span>
          ))}
        </p>
        <p lang="kn" className="mt-2 font-kn text-lg text-gold/90">ನಮ್ಮ ತಂಡ, ನಮ್ಮ ಹೆಮ್ಮೆ</p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-8 flex flex-wrap items-center gap-4">
          <MagneticButton href="/join" size="lg">Join the Army</MagneticButton>
          <MagneticButton href="/events" variant="ghost" size="lg">See events</MagneticButton>
        </motion.div>

        {nextEvent && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="glass mt-10 inline-flex flex-col gap-3 rounded-[var(--radius)] p-4 md:flex-row md:items-center md:gap-6 md:p-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Next up</p>
              <a href={`/events/${nextEvent.slug}`} className="display text-2xl hover:text-gold">{nextEvent.title}</a>
              <p className="text-sm text-muted">{fmtDate(nextEvent.date)} · {fmtTime(nextEvent.date)}{nextEvent.venue ? ` · ${nextEvent.venue}` : ""}</p>
            </div>
            <Countdown to={nextEvent.date} compact />
          </motion.div>
        )}
        </div>

        {/* Club crest: rises in, floats, drifts with scroll */}
        <motion.div style={{ y: crestY, rotate: crestR }} className="relative order-1 mx-auto w-32 [perspective:800px] sm:w-40 md:order-2 md:w-full md:max-w-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotateY: -40 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative animate-[float-y_6s_ease-in-out_infinite]"
          >
            <div aria-hidden className="absolute inset-[15%] rounded-full bg-red/50 blur-[60px]" />
            <div aria-hidden className="absolute inset-[25%] rounded-full bg-gold/30 blur-[50px]" />
            <Image src="/brand/logo-600.png" alt="Namma RCB HQ crest" width={600} height={883} priority sizes="(max-width:768px) 160px, 384px" className="relative h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,.8)]" />
          </motion.div>
        </motion.div>
      </div>

      <div aria-hidden className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted md:flex">
        Scroll
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
