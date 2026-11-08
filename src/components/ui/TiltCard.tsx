"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** 3D tilt + moving glare on pointer. Disabled for touch & reduced motion. */
export default function TiltCard({ children, className, max = 10 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || document.documentElement.classList.contains("reduce-motion")) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateZ(0)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn("group/tilt relative transition-transform duration-300 ease-[var(--ease-out)] [transform-style:preserve-3d]", className)}
    >
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100" style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.14), transparent 50%)" }} />
    </div>
  );
}
