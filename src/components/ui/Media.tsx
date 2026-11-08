import Image from "next/image";
import type { Img } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Sanity/remote image with blur placeholder, or a quiet empty slot
 * (flat surface + caption) until a real photo is uploaded.
 */
export default function Media({ img, label, className, sizes = "(max-width: 768px) 100vw, 33vw", priority, fill = true }: { img: Img | undefined; label?: string; className?: string; sizes?: string; priority?: boolean; seed?: number; fill?: boolean }) {
  if (img?.src) {
    return fill ? (
      <Image src={img.src} alt={img.alt ?? ""} fill sizes={sizes} priority={priority} placeholder={img.blur ? "blur" : "empty"} blurDataURL={img.blur} className={cn("object-cover", className)} />
    ) : (
      <Image src={img.src} alt={img.alt ?? ""} width={img.width ?? 1200} height={img.height ?? 800} sizes={sizes} priority={priority} placeholder={img.blur ? "blur" : "empty"} blurDataURL={img.blur} className={cn("h-auto w-full", className)} />
    );
  }
  return (
    <div role="img" aria-label={`Photo to come${label ? `: ${label}` : ""}`} className={cn("absolute inset-0 bg-raised", className)}>
      <span aria-hidden className="absolute bottom-3 left-3 text-xs text-faint">Photo to come</span>
    </div>
  );
}
