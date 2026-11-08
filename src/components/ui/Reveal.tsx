"use client";
import { motion, useReducedMotion } from "framer-motion";

/** Fade/slide content in when it enters the viewport. */
export default function Reveal({ children, delay = 0, y = 40, className, as = "div" }: { children: React.ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "section" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}
