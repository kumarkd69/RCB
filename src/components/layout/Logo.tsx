import Image from "next/image";
import type { Img } from "@/lib/types";

/** Club logo slot. Upload the real logo in Studio → Site settings. Never use RCB's official crest. */
export default function Logo({ logo, size = 40 }: { logo: Img; size?: number }) {
  if (logo?.src) return <Image src={logo.src} alt={logo.alt || "Namma RCB HQ logo"} width={size} height={size} className="rounded-full" />;
  return (
    <span
      aria-label="Logo placeholder"
      title="[PLACEHOLDER] Club logo"
      style={{ width: size, height: size }}
      className="grid place-items-center rounded-full border border-dashed border-gold/70 bg-gradient-to-br from-red to-red-deep display text-[0.7rem] text-gold-soft shadow-[var(--glow-red)]"
    >
      NRH
    </span>
  );
}
