"use client";
import { motion, useReducedMotion } from "framer-motion";

/** Heading text slides up from behind a mask when scrolled into view. */
export default function MaskLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span className="block" initial={{ y: "105%", rotate: 2 }} whileInView={{ y: 0, rotate: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.span>
    </span>
  );
}
