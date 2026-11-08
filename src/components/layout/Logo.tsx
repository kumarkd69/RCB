import Image from "next/image";
import type { Img } from "@/lib/types";

/** Club crest. CMS logo (Studio → Site settings) overrides the bundled one. */
export default function Logo({ logo, size = 40, priority }: { logo: Img; size?: number; priority?: boolean }) {
  const src = logo?.src || "/brand/logo-600.png";
  const w = Math.round(size * 0.68);
  return <Image src={src} alt={logo?.alt || "Namma RCB HQ crest"} width={w} height={size} priority={priority} className="h-auto drop-shadow-[0_0_12px_rgba(201,162,39,.35)]" style={{ width: w, height: size }} />;
}
