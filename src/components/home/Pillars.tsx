import type { Pillar } from "@/lib/types";
import Reveal from "../ui/Reveal";

/** Numbered editorial list instead of icon cards. */
export default function Pillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <ol className="border-t border-line">
      {pillars.map((p, i) => (
        <Reveal as="li" key={p.title} delay={0.04 * i} y={20} className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-b border-line py-6 md:grid-cols-[6rem_1fr_1.2fr] md:py-8">
          <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="display text-3xl transition-colors duration-300 group-hover:text-red md:text-5xl">{p.title}</h3>
          <p className="col-start-2 mt-2 text-muted md:col-start-3 md:mt-0 md:text-lg">{p.description}</p>
        </Reveal>
      ))}
    </ol>
  );
}
