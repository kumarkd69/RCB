"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import type { SiteSettings } from "@/lib/types";

/**
 * Club identity: "RCB fandom is family" + the Namma Banner, the one banner that travels
 * to every event. As you scroll past it, fans' handwritten messages appear one by one.
 */

// where each signature sits on the banner (%), and its tilt
const SPOTS: [number, number, number][] = [
  [3, 7, -6], [70, 6, 4], [3, 33, 3], [72, 32, -5], [3, 60, -3], [72, 58, 5], [4, 84, 2], [68, 84, -3], [36, 4, -2], [36, 88, 2],
];
const INK = ["text-white", "text-gold", "text-black", "text-white", "text-gold", "text-black", "text-white", "text-gold", "text-white", "text-black"];

const steps = [
  ["Carry", "Take it to every event"],
  ["Engage", "Invite fans to join in"],
  ["Write & sign", "A message and a name"],
  ["Display", "Shown on match day"],
];

export default function FanBanner({ messages, intro, stats }: { messages: string[]; intro: string; stats: SiteSettings["stats"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setShown((n) => Math.max(n, Math.ceil(v * messages.length))));

  const figures: [string, string][] = [
    [`${stats.members.toLocaleString("en-IN")}+`, "Members"],
    [`${stats.events}+`, "Events hosted"],
    [stats.reach ? `${Math.round(stats.reach / 1000)}K` : `${stats.cities}`, stats.reach ? "Social reach" : "Cities"],
  ];

  return (
    <section aria-labelledby="family" className="relative overflow-hidden py-20 md:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="eyebrow mb-4">Namma RCB HQ</p>
          <h2 id="family" className="display text-[clamp(3rem,7vw,6rem)] leading-[0.92]">One banner.<br /><span className="text-red">Every fan.</span></h2>
          <p className="mt-6 max-w-lg text-lg text-muted">{intro}</p>
          <p className="mt-4 max-w-lg text-lg text-muted">
            Our symbol is the <span className="text-white">Namma Banner</span>. It travels with us to every screening, school visit and drive. Fans write a message and sign it, and on match day we display it for the team.
          </p>
          <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {steps.map(([t, d], i) => (
              <li key={t}>
                <span className="font-[family-name:var(--font-hand)] text-3xl leading-none text-gold">{i + 1}</span>
                <p className="mt-1 font-semibold">{t}</p>
                <p className="text-sm text-muted">{d}</p>
              </li>
            ))}
          </ol>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
            {figures.map(([v, l]) => (
              <div key={l}><dd className="display text-4xl tabular-nums md:text-5xl">{v}</dd><dt className="text-sm text-muted">{l}</dt></div>
            ))}
          </dl>
        </div>

        {/* The banner */}
        <div ref={ref} className="relative [perspective:1200px]">
          <motion.div
            initial={{ rotateX: 18, rotateZ: -3, opacity: 0, y: 40 }}
            whileInView={{ rotateX: 6, rotateZ: -2, opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-red shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)]"
          >
            {/* cloth folds: tone steps of the same red */}
            <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(100deg,rgba(0,0,0,0)_0px,rgba(0,0,0,.10)_60px,rgba(0,0,0,0)_120px,rgba(255,255,255,.05)_180px,rgba(0,0,0,0)_240px)]" />
            <div aria-hidden className="absolute inset-3 border-2 border-dashed border-gold/70" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <Image src="/brand/logo-600.png" alt="Namma RCB HQ crest" width={600} height={883} className="h-auto w-[15%] min-w-14" sizes="160px" />
              <p className="display mt-2 text-[clamp(1.4rem,3.4vw,2.6rem)] leading-none">Namma RCB HQ</p>
              <p className="mt-1 text-[clamp(.55rem,1vw,.75rem)] font-semibold tracking-wide text-black/70">ONE BANNER · EVERY EVENT · EVERY FAN</p>
            </div>
            {messages.slice(0, SPOTS.length).map((m, i) => (
              <motion.span
                key={m}
                lang={/[ಀ-೿]/.test(m) ? "kn" : undefined}
                initial={false}
                animate={i < shown ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 1.25, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ left: `${SPOTS[i][0]}%`, top: `${SPOTS[i][1]}%`, rotate: `${SPOTS[i][2]}deg` }}
                className={`absolute max-w-[28%] font-[family-name:var(--font-hand)] text-[clamp(1rem,2.2vw,1.65rem)] leading-tight ${INK[i]} ${/[ಀ-೿]/.test(m) ? "font-kn text-[clamp(.9rem,1.8vw,1.3rem)]" : ""}`}
              >
                {m}
              </motion.span>
            ))}
          </motion.div>
          <p className="mt-4 text-center text-sm text-muted" aria-live="polite">
            {Math.min(shown, messages.length)} of {messages.length} messages signed
          </p>
          {/* screen readers get the whole list */}
          <ul className="sr-only">{messages.map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
