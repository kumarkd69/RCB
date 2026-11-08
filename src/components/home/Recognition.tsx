import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import Reveal from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { isPlaceholder } from "@/lib/utils";

export default function Recognition({ r }: { r: SiteSettings["recognition"] }) {
  return (
    <section aria-labelledby="recognition" className="container-x py-24">
      <div className="glass relative grid items-center gap-10 overflow-hidden rounded-[2rem] p-8 md:grid-cols-[1fr_1.2fr] md:p-14">
        <Reveal className="relative mx-auto aspect-[3/4] w-full max-w-xs [perspective:1000px]">
          <div className="relative h-full w-full rotate-[-4deg] overflow-hidden rounded-2xl border border-gold/40 bg-[#f6f0e0] shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] transition-transform duration-700 hover:rotate-0">
            {r.proof?.src ? (
              <Image src={r.proof.src} alt={r.proof.alt} fill className="object-cover" sizes="320px" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-black/70">
                <Icon name="star" className="h-10 w-10 text-gold" />
                <p className="font-semibold">[PLACEHOLDER]</p>
                <p className="text-sm">Recognition letter / certificate goes here. Upload in Studio → Site settings → Official recognition.</p>
              </div>
            )}
          </div>
          <div className="absolute -bottom-5 -right-3 grid h-24 w-24 rotate-12 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-center text-black">
            {r.badge?.src ? <Image src={r.badge.src} alt={r.badge.alt} width={80} height={80} /> : <span className="display text-sm leading-tight">Recognised<br />by RCB</span>}
          </div>
        </Reveal>
        <Reveal delay={0.15} className="relative">
          <p className="mb-4 text-sm font-semibold text-red">Official recognition</p>
          <h2 id="recognition" className="display text-5xl md:text-6xl">{r.title}</h2>
          <p className={isPlaceholder(r.note) ? "mt-5 text-lg text-muted italic" : "mt-5 text-lg text-muted"}>{r.note}</p>
          {r.proofFileUrl && (
            <a href={r.proofFileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-gold underline-offset-4 hover:underline">
              View the letter (PDF) <Icon name="arrow" className="h-4 w-4" />
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
