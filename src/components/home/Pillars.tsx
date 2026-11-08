import type { Pillar } from "@/lib/types";
import TiltCard from "../ui/TiltCard";
import Reveal from "../ui/Reveal";
import { Icon } from "../ui/Icon";

export default function Pillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pillars.map((p, i) => (
        <Reveal as="li" key={p.title} delay={(i % 3) * 0.08}>
          <TiltCard className="h-full rounded-[var(--radius)]">
            <div className="glass sweep h-full rounded-[var(--radius)] p-6 [transform:translateZ(0)]">
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-red to-red-deep shadow-[var(--glow-red)] [transform:translateZ(40px)]">
                <Icon name={p.icon} className="h-7 w-7" />
              </div>
              <h3 className="display text-3xl">{p.title}</h3>
              <p className="mt-2 text-muted">{p.description}</p>
            </div>
          </TiltCard>
        </Reveal>
      ))}
    </ul>
  );
}
