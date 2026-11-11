import Image from "next/image";
import Link from "next/link";
import Reveal from "../ui/Reveal";
import { Icon } from "../ui/Icon";

/** Join section: dark, with a fan photo; red only on the main button. */
export default function JoinBanner({ whatsapp }: { whatsapp?: string }) {
  const perks = ["Match-day screenings in your chapter", "Monthly fan meets and quizzes", "Your chapter's WhatsApp group", "Free, always"];
  return (
    <section aria-labelledby="join-banner" className="container-x py-20 md:py-28">
      <div className="relative grid overflow-hidden rounded-[24px] border border-line bg-ink md:grid-cols-[1.1fr_1fr]">
        <Reveal className="relative z-10 p-8 md:p-14">
          <p className="eyebrow mb-4">Membership</p>
          <h2 id="join-banner" className="display text-[clamp(3rem,7vw,5.5rem)] leading-[0.92]">Join<br />Namma RCB HQ</h2>
          <ul className="mt-6 space-y-2">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-white/85"><span aria-hidden className="h-[3px] w-4 -skew-x-12 bg-gold" />{p}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/join" className="group inline-flex items-center gap-3 rounded-full bg-red px-7 py-4 font-semibold transition-colors hover:bg-red-deep">
              Become a member <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-white/25 px-7 py-4 font-semibold transition-colors hover:border-white">WhatsApp group</a>}
          </div>
        </Reveal>
        <div className="relative min-h-72 md:min-h-full">
          <Image src="/media/dummy/fans-celebrate.jpg" alt="Two members celebrating at a screening" fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent md:bg-gradient-to-r" />
          <Image src="/brand/logo-600.png" alt="" width={600} height={883} className="absolute bottom-6 right-6 h-24 w-auto md:h-28" />
        </div>
      </div>
    </section>
  );
}
