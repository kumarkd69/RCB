"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "../layout/MotionProvider";

const chapters = [
  { k: "01", title: "We watch together", body: "Every RCB game, on the biggest screens we can find, with the loudest crowd in the city." },
  { k: "02", title: "We travel together", body: "Buses, trains and long nights to back the team in other cities." },
  { k: "03", title: "We give back", body: "Blood drives, tree planting and clinics for young cricketers. Fandom that serves." },
];

/** Pinned scroll storytelling. Falls back to a simple stacked list when motion is reduced. */
export default function ScrollStory() {
  const root = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: `+=${panels.length * 90}%`, scrub: 0.6, pin: true, anticipatePin: 1 },
      });
      panels.forEach((p, i) => {
        if (i > 0) tl.fromTo(p, { autoAlpha: 0, yPercent: 30, scale: 0.96 }, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 1 }, "<");
        if (i < panels.length - 1) tl.to(p, { autoAlpha: 0, yPercent: -30, scale: 1.04, duration: 1 }, "+=0.6");
      });
      tl.to("[data-bar]", { scaleX: 1, ease: "none", duration: tl.duration() }, 0);
      tl.to("[data-glow]", { xPercent: 60, ease: "none", duration: tl.duration() }, 0);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <ol className="container-x grid gap-6 py-16 md:grid-cols-3">
        {chapters.map((c) => (
          <li key={c.k} className="glass rounded-[var(--radius)] p-6">
            <span className="display text-gold">{c.k}</span>
            <h3 className="display mt-2 text-4xl">{c.title}</h3>
            <p className="mt-3 text-muted">{c.body}</p>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div ref={root} className="relative flex h-[100svh] items-center overflow-hidden">
      <div data-glow aria-hidden className="absolute -left-1/3 top-1/4 h-[60vh] w-[60vw] rounded-full bg-red/25 blur-[120px]" />
      <div className="container-x relative h-[60vh]">
        {chapters.map((c, i) => (
          <div key={c.k} data-panel className="absolute inset-x-4 top-0 flex h-full flex-col justify-center md:inset-x-8" style={i ? { opacity: 0, visibility: "hidden" } : undefined}>
            <span className="display text-[clamp(5rem,18vw,14rem)] leading-none text-white/5">{c.k}</span>
            <h3 className="display -mt-[0.5em] text-[clamp(3rem,9vw,7rem)]">{c.title}</h3>
            <p className="mt-4 max-w-xl text-lg text-muted md:text-xl">{c.body}</p>
          </div>
        ))}
        <div className="absolute inset-x-4 bottom-0 h-1 overflow-hidden rounded bg-white/10 md:inset-x-8">
          <div data-bar className="h-full origin-left scale-x-0 bg-gradient-to-r from-red to-gold" />
        </div>
      </div>
    </div>
  );
}
