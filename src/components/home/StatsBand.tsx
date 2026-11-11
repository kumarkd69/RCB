"use client";
import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { SiteSettings } from "@/lib/types";

function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView || document.documentElement.classList.contains("reduce-motion")) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className="tabular-nums">{v.toLocaleString("en-IN")}{suffix}</span>;
}

/** The club in numbers, big. */
export default function StatsBand({ stats }: { stats: SiteSettings["stats"] }) {
  const items: [number, string, string][] = [
    [stats.members, "+", "Members"],
    [stats.events, "+", "Events run"],
    [stats.cities, "", "Cities"],
    [stats.years, "", "Seasons together"],
  ];
  return (
    <section aria-label="Namma RCB HQ in numbers" className="border-y border-line bg-ink">
      <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
        {items.map(([n, s, l], i) => (
          <div key={l} className={`py-10 md:py-14 ${i % 2 ? "pl-6 md:pl-10" : ""} ${i > 0 ? "lg:border-l lg:border-line lg:pl-10" : ""} ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""}`}>
            <dd className="display text-[clamp(3.5rem,8vw,7rem)] leading-none text-gold"><Count to={n} suffix={s} /></dd>
            <dt className="mt-3 text-base text-muted md:text-lg">{l}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
