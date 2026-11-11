import Link from "next/link";
import Media from "../ui/Media";
import Reveal from "../ui/Reveal";
import type { Pillar, SiteSettings } from "@/lib/types";

/**
 * Home "what we do": the main activity (match-day screenings) as the large card,
 * three other activities beside it, and the club's numbers underneath.
 */
export default function WhatWeDo({ pillars, stats, intro }: { pillars: Pillar[]; stats: SiteSettings["stats"]; intro: string }) {
  const [main, ...rest] = pillars;
  const others = rest.slice(0, 3);
  const figures: [string, number, string][] = [
    ["Members", stats.members, "+"],
    ["Events run", stats.events, "+"],
    ["Cities", stats.cities, ""],
    ["Seasons together", stats.years, ""],
  ];
  return (
    <section aria-labelledby="what" className="container-x py-16 md:py-20">
      <div className="mb-8 grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <p className="eyebrow mb-3">What we do</p>
          <h2 id="what" className="display text-5xl md:text-6xl">We watch every RCB game together</h2>
        </div>
        <p className="text-muted md:text-lg">{intro}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:grid-rows-3">
        {main && (
          <Reveal className="md:row-span-3">
            <article className="group relative h-full min-h-[300px] overflow-hidden rounded-[var(--radius)] border border-line">
              <Media img={main.image} label={main.title} sizes="(max-width:768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                {main.frequency && <p className="mb-2 inline-block rounded-md bg-red px-2 py-1 text-xs font-semibold">{main.frequency}</p>}
                <h3 className="display text-4xl md:text-5xl">{main.title}</h3>
                <p className="mt-2 max-w-md text-white/85">{main.description}</p>
                <Link href="/events" className="mt-4 inline-block text-sm font-semibold text-gold hover:underline">See screenings near you</Link>
              </div>
            </article>
          </Reveal>
        )}
        {others.map((p, i) => (
          <Reveal key={p.title} delay={0.05 * (i + 1)}>
            <article className="grid h-full grid-cols-[112px_1fr] overflow-hidden rounded-[var(--radius)] border border-line bg-ink md:grid-cols-[160px_1fr]">
              <div className="relative min-h-28"><Media img={p.image} label={p.title} sizes="160px" /></div>
              <div className="p-4 md:p-5">
                {p.frequency && <p className="text-xs font-semibold text-gold">{p.frequency}</p>}
                <h3 className="display mt-1 text-2xl md:text-3xl">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <dl className="mt-3 grid grid-cols-2 overflow-hidden rounded-[var(--radius)] border border-line md:grid-cols-4">
        {figures.map(([label, v, s], i) => (
          <div key={label} className={`bg-ink p-5 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}>
            <dd className="display text-4xl tabular-nums text-gold md:text-5xl">{v.toLocaleString("en-IN")}{s}</dd>
            <dt className="mt-1 text-sm text-muted">{label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
