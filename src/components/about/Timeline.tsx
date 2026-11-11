"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Milestone } from "@/lib/types";
import Reveal from "../ui/Reveal";

/** Vertical timeline whose glowing spine fills as you scroll. */
export default function Timeline({ items }: { items: Milestone[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-white/10 md:left-1/2" />
      <motion.div aria-hidden style={{ scaleY }} className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-red via-gold to-red shadow-[0_0_12px_#EC1C24] md:left-1/2" />
      {items.map((m, i) => (
        <li key={m._id} className={`relative mb-12 pl-12 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"}`}>
          <span aria-hidden className={`absolute left-4 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-gold bg-black ${i % 2 ? "md:left-0" : "md:left-full"}`} />
          <Reveal y={30}>
            <p className="display text-5xl text-gradient-gold">{m.year}</p>
            <h3 className="display mt-1 text-2xl">{m.title}</h3>
            {m.description && <p className="mt-2 text-muted">{m.description}</p>}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
