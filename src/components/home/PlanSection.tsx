"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Contest, Initiative, PillarKey } from "@/lib/types";
import Media from "../ui/Media";
import Reveal from "../ui/Reveal";

const PILLARS: { key: PillarKey; n: string; title: string; line: string }[] = [
  { key: "connect", n: "i.", title: "Connect", line: "Give fans a voice and one shared symbol" },
  { key: "giveback", n: "ii.", title: "Give back", line: "Show up for the communities our fans come from" },
  { key: "play", n: "iii.", title: "Play together", line: "Bring match day to where fans live, all year" },
];

const ROADMAP = [
  { at: 0, to: 20, label: "Fans Family Podcast", pillar: "Connect" },
  { at: 20, to: 45, label: "Menstrual hygiene drive", pillar: "Give back" },
  { at: 45, to: 65, label: "School fun days", pillar: "Give back" },
  { at: 65, to: 90, label: "Off-Season Showdown", pillar: "Play together" },
];

/**
 * What we do and what's next: three pillars, six initiatives (with photos),
 * a 90-day roll-out line that fills as you scroll, and the fan contests.
 */
export default function PlanSection({ initiatives, contests }: { initiatives: Initiative[]; contests: Contest[] }) {
  const road = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: road, offset: ["start 90%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const byPillar = (k: PillarKey) => initiatives.filter((i) => i.pillar === k).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section id="plan" aria-labelledby="plan-h" className="scroll-mt-20 bg-ink py-20 md:py-28">
      <div className="container-x">
        <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow mb-4">What we do, and what&apos;s next</p>
            <h2 id="plan-h" className="display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.92]">Three pillars.<br /><span className="text-gold">Six initiatives.</span></h2>
          </div>
          <p className="text-lg text-muted">Every initiative builds the same thing: a fan family that shows up for RCB and for each other, on and off the field. Here is our 90-day community plan.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3 lg:gap-6">
          {PILLARS.map((p, pi) => (
            <div key={p.key}>
              <Reveal delay={pi * 0.06}>
                <div className="mb-5 border-t-2 border-red pt-4">
                  <span className="font-[family-name:var(--font-hero)] text-lg italic text-gold">{p.n}</span>
                  <h3 className="display text-4xl md:text-5xl">{p.title}</h3>
                  <p className="mt-1 text-muted">{p.line}</p>
                </div>
              </Reveal>
              <ul className="space-y-4">
                {byPillar(p.key).map((it, ii) => (
                  <Reveal as="li" key={it._id} delay={pi * 0.06 + ii * 0.05}>
                    <article className="group overflow-hidden rounded-[var(--radius)] border border-line bg-black">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Media img={it.images?.[0]} label={it.title} sizes="(max-width:1024px) 100vw, 33vw" className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]" />
                        {it.window && <span className="absolute left-3 top-3 rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-gold">{it.window}</span>}
                      </div>
                      <div className="p-5">
                        <h4 className="display text-2xl md:text-3xl">{it.title}</h4>
                        {it.summary && <p className="mt-2 text-muted">{it.summary}</p>}
                        {it.points?.length ? (
                          <ul className="mt-3 space-y-1 text-sm text-white/80">
                            {it.points.slice(0, 3).map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="mt-2 h-1 w-3 shrink-0 -skew-x-12 bg-red" />{x}</li>)}
                          </ul>
                        ) : null}
                      </div>
                    </article>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 90-day roll-out */}
        <div ref={road} className="mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h3 className="display text-3xl md:text-4xl">The roll-out: 90 days, in order</h3>
            <p className="text-sm text-muted">One initiative at a time, so every event gets the whole team</p>
          </div>
          <div className="relative">
            <div className="h-1 rounded-full bg-white/10" />
            <motion.div style={{ scaleX: fill }} className="absolute inset-x-0 top-0 h-1 origin-left rounded-full bg-gold" />
            <ol className="relative mt-4 grid gap-4 md:block md:h-28">
              {ROADMAP.map((r) => (
                <li key={r.label} className="md:absolute md:top-0" style={{ left: `${(r.at / 90) * 100}%`, width: `${((r.to - r.at) / 90) * 100}%` }}>
                  <div className="border-l-2 border-red pl-3 md:pr-3">
                    <p className="text-xs font-semibold text-gold">Days {r.at === 0 ? 1 : r.at}–{r.to}</p>
                    <p className="font-semibold leading-snug">{r.label}</p>
                    <p className="text-xs text-muted">{r.pillar}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted">
            <span><span className="font-semibold text-white">Throughout:</span> the Namma Banner, signed at every event</span>
            <span><span className="font-semibold text-white">In season:</span> Namma Match Day screenings, WPL and IPL</span>
          </p>
        </div>

        {/* contests */}
        {contests.length > 0 && (
          <div className="mt-20">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h3 className="display text-3xl md:text-4xl">Contests that keep fans playing</h3>
              <p className="text-sm text-muted">Online every week, and live at our screenings</p>
            </div>
            <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:px-0 lg:grid-cols-6">
              {contests.map((c, i) => (
                <li key={c.title} className="w-[62%] shrink-0 snap-start md:w-auto">
                  <div className="h-full rounded-[var(--radius)] border border-line bg-black p-5 transition-colors hover:border-gold">
                    <span className="font-[family-name:var(--font-hand)] text-3xl leading-none text-red">{String(i + 1).padStart(2, "0")}</span>
                    <p className="display mt-3 text-2xl">{c.title}</p>
                    <p className="mt-1 text-sm text-muted">{c.description}</p>
                    <p className="mt-3 text-xs font-semibold text-gold">{c.where}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
