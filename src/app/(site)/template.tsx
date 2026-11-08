"use client";
import { motion } from "framer-motion";

/**
 * Page-enter transition: red + gold curtains sweep up off the screen on every navigation.
 * Same markup on server and client; reduced motion is handled by CSS (curtains hidden)
 * and MotionConfig (transforms skipped), so hydration always matches.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ease = [0.76, 0, 0.24, 1] as const;
  return (
    <>
      <motion.div aria-hidden className="page-curtain pointer-events-none fixed inset-0 z-[85] origin-top bg-gold" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 0.7, ease, delay: 0.05 }} />
      <motion.div aria-hidden className="page-curtain pointer-events-none fixed inset-0 z-[86] flex origin-top items-center justify-center bg-red-deep" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 0.7, ease, delay: 0.18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-600.webp" alt="" className="h-28 w-auto opacity-90" />
      </motion.div>
      <motion.div initial={{ y: 40 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}>
        {children}
      </motion.div>
    </>
  );
}
