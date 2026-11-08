"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotion } from "../layout/MotionProvider";
import { Icon } from "../ui/Icon";
import Countdown from "../ui/Countdown";
import { fmtDate } from "@/lib/utils";
import type { ClubEvent } from "@/lib/types";

const ease = [0.16, 1, 0.3, 1] as const;

/** Full-bleed fan video hero. Poster image on reduced motion / data saver. */
export default function Hero({ nextEvent }: { nextEvent: ClubEvent | null }) {
  const { reduced } = useMotion();
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mobile, setMobile] = useState<boolean | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => setMobile(window.matchMedia("(max-width: 767px), (orientation: portrait)").matches), []);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const slow = () => { v.playbackRate = 0.6; }; // slower, more cinematic
    slow();
    v.addEventListener("loadedmetadata", slow);
    v.addEventListener("play", slow);
    if (reduced) v.pause(); else v.play().catch(() => {});
    return () => { v.removeEventListener("loadedmetadata", slow); v.removeEventListener("play", slow); };
  }, [reduced, mobile]);

  const playVideo = mobile !== null && !reduced;

  return (
    <section ref={ref} className="relative isolate h-[100svh] min-h-[560px] overflow-hidden" aria-labelledby="hero-title">
      <motion.div style={{ scale }} className="absolute inset-0 -z-10">
        {/* poster first for fast LCP, video fades in over it */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/fans-hero.jpg" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        {playVideo && (
          <video
            ref={video}
            key={mobile ? "m" : "d"}
            className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
            src={mobile ? "/media/fans-hero-mobile.mp4" : "/media/fans-hero.mp4"}
            poster="/media/fans-hero.jpg"
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,.92)_0%,rgba(10,10,10,.65)_38%,rgba(10,10,10,.1)_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
      </motion.div>

      <motion.div style={{ y: textY, opacity: fade }} className="container-x flex h-full flex-col justify-end pb-24 md:justify-center md:pb-0">
        <h1 id="hero-title" className="font-[family-name:var(--font-hero)] text-[clamp(3.6rem,11vw,9.5rem)] font-black italic leading-[0.88] tracking-[-0.03em]">
          <span className="block overflow-hidden pb-[0.06em] pr-[0.1em]">
            <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.2 }}>Namma</motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em] pr-[0.1em]">
            <motion.span className="block text-red" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.32 }}>RCB HQ</motion.span>
          </span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="mt-6 max-w-md text-xl font-medium leading-snug text-white/90 md:text-2xl">
          For the fans. By the fans.<br />From Bengaluru. For RCB.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.85 }} className="mt-8">
          <Link href="/join" className="group inline-flex items-center gap-3 rounded-full bg-red px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-[#b5141a]">
            Join the Community
            <Icon name="arrow" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
        <motion.span aria-hidden initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 1, ease }} className="mt-10 block h-[3px] w-40 origin-left -skew-x-12 bg-red" />
      </motion.div>

      {nextEvent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-6 right-4 hidden items-center gap-5 border-l-2 border-red bg-black/55 py-3 pl-4 pr-5 backdrop-blur-md md:right-8 md:flex">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Next up · {fmtDate(nextEvent.date, { day: "numeric", month: "short" })}</p>
            <Link href={`/events/${nextEvent.slug}`} className="font-semibold hover:text-gold">{nextEvent.title}</Link>
          </div>
          <Countdown to={nextEvent.date} compact />
        </motion.div>
      )}
    </section>
  );
}
