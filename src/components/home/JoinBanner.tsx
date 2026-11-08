import Link from "next/link";
import Reveal from "../ui/Reveal";
import { Icon } from "../ui/Icon";

export default function JoinBanner({ whatsapp }: { whatsapp?: string }) {
  return (
    <section aria-labelledby="join-banner" className="bg-red text-white">
      <div className="container-x grid gap-10 py-20 md:grid-cols-[1.4fr_1fr] md:items-end md:py-28">
        <Reveal>
          <h2 id="join-banner" className="font-[family-name:var(--font-hero)] text-[clamp(3rem,9vw,7.5rem)] font-black italic leading-[0.9] tracking-[-0.03em]">
            Your seat in<br />the stands is<br />waiting.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-lg text-white/85">Free to join. Screenings, fan meets, away trips and a WhatsApp family in your city.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/join" className="group inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 font-semibold hover:bg-ink">
              Join the Community <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-white/50 px-7 py-4 font-semibold hover:border-white">WhatsApp group</a>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
