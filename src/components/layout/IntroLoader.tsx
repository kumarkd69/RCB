"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * First-visit intro: crest rises out of the dark with a gold flare, a 0→100 counter runs,
 * then red curtains split open. Shown once per browser session; skipped on reduced motion.
 * An inline script in the root layout adds `intro-seen` to <html> before paint so repeat
 * visits never flash it.
 */
export default function IntroLoader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (html.classList.contains("intro-seen") || reduce) { html.classList.add("intro-seen"); setGone(true); return; }
    try { sessionStorage.setItem("nrh-intro", "1"); } catch {}
    document.body.style.overflow = "hidden";
    const count = { v: 0 };
    const el = root.current!;
    const num = el.querySelector<HTMLElement>("[data-count]")!;
    const tl = gsap.timeline({
      onComplete: () => { document.body.style.overflow = ""; html.classList.add("intro-seen"); setGone(true); },
    });
    tl.fromTo("[data-crest]", { scale: 0.6, autoAlpha: 0, filter: "brightness(0) blur(12px)" }, { scale: 1, autoAlpha: 1, filter: "brightness(1) blur(0px)", duration: 1.2, ease: "expo.out" })
      .fromTo("[data-flare]", { xPercent: -150 }, { xPercent: 150, duration: 1, ease: "power2.inOut" }, 0.5)
      .to(count, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => { num.textContent = String(Math.round(count.v)).padStart(3, "0"); } }, 0)
      .fromTo("[data-word]", { yPercent: 110 }, { yPercent: 0, stagger: 0.08, duration: 0.8, ease: "expo.out" }, 0.4)
      .to("[data-crest], [data-meta]", { scale: 1.15, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "+=0.15")
      .to("[data-top]", { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.1")
      .to("[data-bot]", { yPercent: 100, duration: 1, ease: "expo.inOut" }, "<")
      .to("[data-seam]", { scaleX: 0, duration: 0.6, ease: "power2.in" }, "<");
    return () => { tl.kill(); document.body.style.overflow = ""; };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="intro-loader fixed inset-0 z-[90]" aria-hidden>
      <div data-top className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_100%,#3a0a0c,#0a0a0a_70%)]" />
      <div data-bot className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_0%,#3a0a0c,#0a0a0a_70%)]" />
      <div data-seam className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <div data-crest className="relative h-[38vh] max-h-80" style={{ aspectRatio: "0.68" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-600.webp" alt="" className="h-full w-full object-contain drop-shadow-[0_0_40px_rgba(201,162,39,.5)]" />
          <div className="absolute inset-0 overflow-hidden [mask-image:url(/brand/logo-600.webp)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]"><div data-flare className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent" /></div>
        </div>
        <div data-meta className="flex items-end gap-6">
          <p className="display flex gap-[0.25em] overflow-hidden text-2xl tracking-[0.2em] md:text-3xl">
            {["Ee", "Sala", "Namde"].map((w) => <span key={w} data-word className="inline-block">{w}</span>)}
          </p>
          <span data-count className="display text-2xl tabular-nums text-gold md:text-3xl">000</span>
        </div>
      </div>
    </div>
  );
}
