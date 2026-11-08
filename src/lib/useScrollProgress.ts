"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Writes ScrollTrigger progress (0–1) into a ref without re-rendering. Used to drive 3D scenes. */
export function useScrollProgress(target: React.RefObject<HTMLElement | null>, opts: ScrollTrigger.Vars = {}, enabled = true) {
  const progress = useRef({ value: 0 });
  useEffect(() => {
    if (!enabled || !target.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({ trigger: target.current, start: "top top", end: "bottom bottom", ...opts, onUpdate: (s) => { progress.current.value = s.progress; } });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
  return progress;
}

/** True once the element is within `margin` of the viewport (mount heavy 3D lazily). */
export function useNearViewport(target: React.RefObject<HTMLElement | null>, margin = "400px", key: unknown = 0) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!target.current || near) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: margin });
    io.observe(target.current);
    return () => io.disconnect();
  }, [target, margin, near, key]);
  return near;
}
