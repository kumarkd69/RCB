"use client";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  children: React.ReactNode;
  variant?: "red" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
};

const styles = {
  red: "bg-red text-white hover:bg-[#b5141a]",
  gold: "bg-gold text-black hover:bg-gold-soft",
  ghost: "border border-white/25 text-text hover:border-white hover:bg-white/5",
};
const sizes = { sm: "px-5 py-2 text-sm", md: "px-7 py-3 text-base", lg: "px-9 py-4 text-lg" };

/** Button that leans toward the pointer. Static on touch / reduced motion. */
export default function MagneticButton({ href, children, variant = "red", size = "md", className, external, ...rest }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || document.documentElement.classList.contains("reduce-motion")) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  const cls = cn("inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-300 ease-[var(--ease-out)] disabled:opacity-50", styles[variant], sizes[size], className);

  const inner = href ? (
    external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
    ) : (
      <Link href={href} className={cls}>{children}</Link>
    )
  ) : (
    <button className={cls} type={rest.type ?? "button"} onClick={rest.onClick} disabled={rest.disabled}>{children}</button>
  );

  return (
    <span ref={ref} onPointerMove={move} onPointerLeave={leave} className="inline-block transition-transform duration-300 ease-[var(--ease-out)]">
      {inner}
    </span>
  );
}
