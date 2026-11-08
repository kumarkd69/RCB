"use client";
import { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";

/** Glowing custom cursor, desktop (fine pointer) only. The native cursor stays visible for accessibility. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const el = dot.current!;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0, big = false;
    const move = (e: PointerEvent) => {
      if (el.style.display !== "block") { cx = x = e.clientX; cy = y = e.clientY; el.style.display = "block"; }
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement;
      big = !!t.closest("a,button,[data-cursor]");
    };
    const loop = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${big ? 2.2 : 1})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <div
      ref={dot}
      aria-hidden
      style={{ display: "none" }}
      className="pointer-events-none fixed left-0 top-0 z-[70] h-5 w-5 rounded-full border border-gold/80 bg-red/30 mix-blend-screen shadow-[0_0_20px_rgba(215,25,32,.7)] transition-[scale] duration-200"
    />
  );
}
