"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Ctx = { reduced: boolean; lowEnd: boolean };
const MotionCtx = createContext<Ctx>({ reduced: true, lowEnd: true });
export const useMotion = () => useContext(MotionCtx);

/** Detects reduced motion + low-end devices, runs Lenis smooth scroll synced with GSAP ScrollTrigger. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Ctx>({ reduced: true, lowEnd: true });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowEnd = (nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) < 4 || !!nav.connection?.saveData;
    const update = () => {
      setState({ reduced: mq.matches, lowEnd });
      document.documentElement.classList.toggle("reduce-motion", mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (state.reduced) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, [state.reduced]);

  return <MotionCtx.Provider value={state}>{children}</MotionCtx.Provider>;
}
