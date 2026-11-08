import Link from "next/link";
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
  const cls = cn("inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.98] ease-[var(--ease-out)] disabled:opacity-50", styles[variant], sizes[size], className);

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
    <span className="inline-block">{inner}</span>
  );
}
