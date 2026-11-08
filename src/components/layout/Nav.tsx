"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { Img } from "@/lib/types";
import Logo from "./Logo";
import MagneticButton from "../ui/MagneticButton";

export default function Nav({ logo }: { logo: Img }) {
  const path = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", solid || open ? "glass !border-x-0 !border-t-0 py-2" : "bg-transparent py-4")}>
      <nav aria-label="Main" className="container-x flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
          <Logo logo={logo} size={48} priority />
          <span className="display text-xl leading-none tracking-wide">
            Namma <span className="text-red">RCB</span> HQ
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={cn("relative rounded-full px-4 py-2 text-sm font-medium text-text/80 transition hover:text-text", active(n.href) && "text-text")}
              >
                {active(n.href) && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white/10" transition={{ type: "spring", bounce: 0.2 }} />}
                {n.label}
              </Link>
            </li>
          ))}
          <li className="ml-4">
            <MagneticButton href="/join" variant="red" size="sm">Join Us</MagneticButton>
          </li>
        </ul>

        <button
          className="relative z-50 grid h-11 w-11 place-items-center rounded-full border border-line md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={cn("absolute h-0.5 w-5 bg-text transition", open ? "rotate-45" : "-translate-y-1.5")} />
          <span className={cn("absolute h-0.5 w-5 bg-text transition", open ? "-rotate-45" : "translate-y-1.5")} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-gradient-to-br from-red-deep via-black to-black px-6 pb-10 pt-28 md:hidden"
          >
            <ul className="space-y-2">
              {[...nav, { href: "/join", label: "Join Us" }].map((n, i) => (
                <motion.li key={n.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
                  <Link href={n.href} className={cn("display block text-6xl", active(n.href) ? "text-gold" : "text-text")}>
                    {n.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <p className="text-sm text-muted">{site.disclaimer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
