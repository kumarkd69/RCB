import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, kicker, className, align = "left", as: H = "h2" }: { eyebrow?: string; title: React.ReactNode; kicker?: React.ReactNode; className?: string; align?: "left" | "center"; as?: "h1" | "h2" }) {
  return (
    <Reveal className={cn("mb-10 max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold", align === "center" && "justify-center")}>
          <span className="h-px w-8 bg-gold" />{eyebrow}
        </p>
      )}
      <H className="display text-5xl md:text-7xl">{title}</H>
      {kicker && <p className="mt-4 text-lg text-muted">{kicker}</p>}
    </Reveal>
  );
}
