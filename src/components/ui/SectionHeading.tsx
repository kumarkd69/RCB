import { cn } from "@/lib/utils";
import Reveal from "./Reveal";
import MaskLine from "./MaskLine";

export default function SectionHeading({ eyebrow, title, kicker, className, align = "left", as: H = "h2" }: { eyebrow?: string; title: React.ReactNode; kicker?: React.ReactNode; className?: string; align?: "left" | "center"; as?: "h1" | "h2" }) {
  return (
    <Reveal className={cn("mb-10 max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("eyebrow mb-4", align === "center" && "justify-center")}>{eyebrow}</p>
      )}
      <H className="display text-5xl md:text-7xl"><MaskLine>{title}</MaskLine></H>
      {kicker && <p className="mt-4 text-lg text-muted">{kicker}</p>}
    </Reveal>
  );
}
