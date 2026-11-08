"use client";
import { motion } from "framer-motion";

/**
 * Heading text slides up from behind a mask when scrolled into view.
 * Same markup for everyone (hydration-safe); MotionConfig skips the slide for reduced motion.
 */
export default function MaskLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span className="block" initial={{ y: "105%" }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.span>
    </span>
  );
}
