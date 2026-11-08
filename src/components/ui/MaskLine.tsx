"use client";
import { motion } from "framer-motion";

/**
 * Heading text slides up from behind a mask when scrolled into view.
 * The visible outer span is what's observed (the inner text starts clipped, so it
 * would never register as on screen). Same markup for everyone (hydration-safe);
 * MotionConfig skips the slide for reduced motion.
 */
export default function MaskLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.span className="block overflow-hidden pb-[0.08em]" initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -40px 0px" }}>
      <motion.span
        className="block"
        variants={{ hidden: { y: "105%" }, show: { y: 0 } }}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
