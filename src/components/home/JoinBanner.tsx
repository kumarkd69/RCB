import MagneticButton from "../ui/MagneticButton";
import Reveal from "../ui/Reveal";

export default function JoinBanner({ whatsapp }: { whatsapp?: string }) {
  return (
    <section aria-labelledby="join-banner" className="container-x py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-red via-red-deep to-black p-10 text-center md:p-20">
          <div aria-hidden className="beam left-[10%]" style={{ ["--r" as string]: "-15deg" }} />
          <div aria-hidden className="beam right-[10%]" style={{ ["--r" as string]: "15deg" }} />
          <div aria-hidden className="absolute inset-0 [background:radial-gradient(circle,rgba(255,255,255,.12)_1px,transparent_1.5px)_0_0/18px_18px]" />
          <h2 id="join-banner" className="display relative text-[clamp(3rem,10vw,8rem)]">Join the <span className="text-gradient-gold">Army</span></h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">Free to join. Screenings, fan meets, away trips and a family that never stops believing.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <MagneticButton href="/join" variant="gold" size="lg">Become a member</MagneticButton>
            {whatsapp && <MagneticButton href={whatsapp} external variant="ghost" size="lg">WhatsApp community</MagneticButton>}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
