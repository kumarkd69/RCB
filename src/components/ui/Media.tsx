import Image from "next/image";
import type { Img } from "@/lib/types";
import { cn } from "@/lib/utils";

const hues = ["from-red/70 to-black", "from-gold/50 to-red-deep", "from-red-deep to-black", "from-[#3a0a0c] to-red/60", "from-black to-gold/40"];

/**
 * Renders a Sanity/remote image with blur placeholder, or a clearly marked
 * placeholder tile when no image has been uploaded yet.
 */
export default function Media({ img, label, className, sizes = "(max-width: 768px) 100vw, 33vw", priority, seed = 0, fill = true }: { img: Img | undefined; label?: string; className?: string; sizes?: string; priority?: boolean; seed?: number; fill?: boolean }) {
  if (img?.src) {
    return fill ? (
      <Image src={img.src} alt={img.alt ?? ""} fill sizes={sizes} priority={priority} placeholder={img.blur ? "blur" : "empty"} blurDataURL={img.blur} className={cn("object-cover", className)} />
    ) : (
      <Image src={img.src} alt={img.alt ?? ""} width={img.width ?? 1200} height={img.height ?? 800} sizes={sizes} priority={priority} placeholder={img.blur ? "blur" : "empty"} blurDataURL={img.blur} className={cn("h-auto w-full", className)} />
    );
  }
  return (
    <div role="img" aria-label={`Placeholder image${label ? `: ${label}` : ""}`} className={cn("absolute inset-0 overflow-hidden bg-gradient-to-br", hues[seed % hues.length], className)}>
      <div aria-hidden className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(135deg,transparent_0_14px,rgba(255,255,255,.05)_14px_15px)]" />
      <div aria-hidden className="absolute -top-1/3 left-1/4 h-full w-1/3 rotate-12 bg-gradient-to-b from-white/20 to-transparent blur-2xl" />
      <span aria-hidden className="absolute bottom-3 left-3 rounded-full border border-dashed border-white/30 bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/60">Photo placeholder</span>
    </div>
  );
}
