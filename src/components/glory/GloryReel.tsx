"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { GloryMoment } from "@/lib/types";
import { useMotion } from "../layout/MotionProvider";
import Media from "../ui/Media";

function Card({ m, i }: { m: GloryMoment; i: number }) {
  return (
    <figure data-card className="relative h-[62vh] w-[78vw] shrink-0 overflow-hidden rounded-[var(--radius)] border border-line md:w-[38vw]" style={{ clipPath: "inset(0 0 0 0 round 1.25rem)" }}>
      <div data-inner className="absolute inset-[-8%]">
        {m.videoUrl ? (
          <video src={m.videoUrl} poster={m.image?.src} muted loop playsInline autoPlay preload="none" className="h-full w-full object-cover" aria-label={m.image?.alt ?? m.title} />
        ) : m.image?.src ? (
          <Image src={m.image.src} alt={m.image.alt} fill sizes="(max-width:768px) 80vw, 40vw" className="object-cover" placeholder={m.image.blur ? "blur" : "empty"} blurDataURL={m.image.blur} />
        ) : (
          <Media img={null} seed={i} label={m.title} />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-6">
        {m.year && <p className="text-xs uppercase tracking-[0.3em] text-gold">{m.league} · {m.year}</p>}
        <p className="display mt-1 text-4xl md:text-5xl">{m.title}</p>
      </figcaption>
    </figure>
  );
}

/** Horizontal pinned reel of winning moments with clip-path reveals and inner parallax. */
export default function GloryReel({ items }: { items: GloryMoment[] }) {
  const { reduced } = useMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !section.current || !track.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const dist = () => track.current!.scrollWidth - window.innerWidth;
      const move = gsap.to(track.current, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } });
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
        gsap.fromTo(card, { clipPath: "inset(18% 12% 18% 12% round 1.25rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", ease: "power2.out", scrollTrigger: { trigger: card, containerAnimation: move, start: "left 95%", end: "left 45%", scrub: true } });
        gsap.fromTo(card.querySelector("[data-inner]"), { xPercent: -6, scale: 1.15 }, { xPercent: 6, scale: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: move, start: "left right", end: "right left", scrub: true } });
      });
      gsap.to("[data-champ]", { xPercent: -30, ease: "none", scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, section);
    return () => ctx.revert();
  }, [reduced, items.length]);

  const heading = (
    <div className="shrink-0 pr-[6vw] md:w-[34vw]">
      <p className="mb-3 text-sm font-semibold text-red">Glory moments</p>
      <h2 id="glory" className="display text-[clamp(3rem,7vw,6rem)] leading-[0.92]">Nights we <span className="text-red">never</span> <span className="text-gradient-gold">forget</span></h2>
      <p className="mt-4 max-w-sm text-muted">Scroll through the wins that made a city cry happy tears.</p>
    </div>
  );

  if (reduced) {
    return (
      <section aria-labelledby="glory" className="py-24">
        <div className="container-x">{heading}</div>
        <div className="mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-4">{items.map((m, i) => <div key={i} className="snap-start"><Card m={m} i={i} /></div>)}</div>
      </section>
    );
  }

  return (
    <section ref={section} aria-labelledby="glory" className="relative" style={{ height: `${Math.max(250, items.length * 70)}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <p data-champ aria-hidden className="display text-outline pointer-events-none absolute bottom-[4vh] left-0 whitespace-nowrap text-[18vw] leading-none opacity-50">CHAMPIONS · CHAMPIONS</p>
        <div ref={track} className="relative flex items-center gap-6 pl-4 pr-[10vw] will-change-transform md:pl-[6vw]">
          {heading}
          {items.map((m, i) => <Card key={i} m={m} i={i} />)}
        </div>
      </div>
    </section>
  );
}
