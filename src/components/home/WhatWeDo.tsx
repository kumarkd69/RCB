import Media from "../ui/Media";
import Reveal from "../ui/Reveal";
import type { Pillar } from "@/lib/types";

/** What we do: four equal photo cards, the activity name and how often it happens. */
export default function WhatWeDo({ pillars }: { pillars: Pillar[] }) {
  return (
    <section aria-labelledby="what" className="container-x py-20 md:py-28">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-3">What we do</p>
        <h2 id="what" className="display text-5xl md:text-6xl">Four ways we show up for RCB</h2>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.slice(0, 4).map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 0.06}>
            <article className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius)] border border-line">
              <Media img={p.image} label={p.title} sizes="(max-width:640px) 100vw, 25vw" className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <span className="absolute left-5 top-5 font-mono text-sm text-white/70">{String(i + 1).padStart(2, "0")}</span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                {p.frequency && <p className="text-xs font-semibold text-gold">{p.frequency}</p>}
                <h3 className="display mt-1 text-3xl">{p.title}</h3>
                <p className="mt-2 text-sm text-white/80">{p.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
