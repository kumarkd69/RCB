"use client";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setV(to);
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref} className="tabular-nums">{v.toLocaleString("en-IN")}{suffix}</span>;
}

export default function Stats({ stats }: { stats: { members: number; events: number; cities: number; years: number } }) {
  const items = [
    { label: "Members", v: stats.members, s: "+" },
    { label: "Events run", v: stats.events, s: "+" },
    { label: "Cities", v: stats.cities, s: "" },
    { label: "Years", v: stats.years, s: "" },
  ];
  return (
    <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
      {items.map((i, n) => (
        <div key={i.label} className={`py-6 ${n % 2 ? "pl-6" : "pr-6"} md:px-0 md:pr-8 ${n ? "md:border-l md:border-line md:pl-8" : ""}`}>
          <dd className="display text-5xl md:text-7xl"><Counter to={i.v} suffix={i.s} /></dd>
          <dt className="mt-2 text-sm text-muted">{i.label}</dt>
        </div>
      ))}
    </dl>
  );
}
