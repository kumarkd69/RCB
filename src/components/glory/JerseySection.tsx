"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "../layout/MotionProvider";
import { useNearViewport } from "@/lib/useScrollProgress";
import MagneticButton from "../ui/MagneticButton";

const JerseyScene = dynamic(() => import("./JerseyScene"), { ssr: false });

const lines = [
  { k: "Wear", w: "the red", b: "Every match day, every city. Our colours, our pride." },
  { k: "Bleed", w: "gold", b: "From the first ball to the last chant, we never sit down." },
  { k: "Be the", w: "12th man", b: "The team plays with eleven. We are number twelve." },
];

/** Pinned 3D fan-jersey turn: front → back (#12) → front as you scroll. */
export default function JerseySection() {
  const { reduced, lowEnd } = useMotion();
  const section = useRef<HTMLElement>(null);
  const progress = useRef({ value: 0 });
  const [i, setI] = useState(0);
  const near = useNearViewport(section, "400px", reduced || lowEnd);

  useEffect(() => {
    if (reduced || !section.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({ trigger: section.current, start: "top top", end: "bottom bottom", onUpdate: (s) => { progress.current.value = s.progress; setI(Math.min(2, Math.floor(s.progress * 3 * 0.999))); } });
    const tw = gsap.fromTo(section.current.querySelector("[data-marq]"), { xPercent: 0 }, { xPercent: -45, ease: "none", scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true } });
    return () => { st.kill(); tw.scrollTrigger?.kill(); tw.kill(); };
  }, [reduced]);

  if (reduced || lowEnd) {
    return (
      <section aria-labelledby="jersey" className="container-x grid items-center gap-10 py-24 md:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-600.webp" alt="Namma RCB HQ crest" className="mx-auto w-56" loading="lazy" />
        <div>
          <h2 id="jersey" className="display text-6xl">Wear the red, be the 12th man</h2>
          <p className="mt-4 text-lg text-muted">{lines[2].b}</p>
          <div className="mt-6"><MagneticButton href="/join">Join the community</MagneticButton></div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} aria-labelledby="jersey" className="relative h-[300vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(215,25,32,.35),transparent_45%)]" />
        <p data-marq aria-hidden className="display text-outline pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[22vw] leading-none opacity-60">
          NAMMA RCB HQ · NAMMA RCB HQ
        </p>
        <div className="absolute inset-0">{near && <JerseyScene progress={progress} />}</div>

        <div className="container-x pointer-events-none relative flex h-full items-end pb-16 md:items-center md:pb-0">
          <div className="max-w-md">
            <p className="eyebrow mb-3">The jersey</p>
            <h2 id="jersey" className="sr-only">Wear the red, bleed gold, be the 12th man</h2>
            <AnimatePresence mode="wait">
              <motion.div key={i} aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <p className="display text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.9]">
                  {[lines[i].k, lines[i].w].map((w, n) => (
                    <span key={n} className="block overflow-hidden">
                      <motion.span className={n ? "block text-gradient-gold" : "block"} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: n * 0.08, ease: [0.16, 1, 0.3, 1] }}>{w}</motion.span>
                    </span>
                  ))}
                </p>
                <p className="mt-4 text-lg text-muted">{lines[i].b}</p>
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-auto mt-6"><MagneticButton href="/join" variant="gold">Join the community</MagneticButton></div>
          </div>
        </div>
      </div>
    </section>
  );
}
