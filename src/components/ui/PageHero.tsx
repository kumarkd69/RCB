import Reveal from "./Reveal";

export default function PageHero({ eyebrow, title, kicker }: { eyebrow: string; title: React.ReactNode; kicker?: string }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-36 md:pt-44">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(215,25,32,.35),transparent_60%)]" />
      <div aria-hidden className="beam left-[15%] -z-10" style={{ ["--r" as string]: "-18deg" }} />
      <div aria-hidden className="beam right-[15%] -z-10" style={{ ["--r" as string]: "18deg", animationDelay: "-4s" }} />
      <div className="container-x">
        <Reveal>
          <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold"><span className="h-px w-8 bg-gold" />{eyebrow}</p>
          <h1 className="display text-[clamp(3.5rem,11vw,9rem)]">{title}</h1>
          {kicker && <p className="mt-4 max-w-2xl text-lg text-muted">{kicker}</p>}
        </Reveal>
      </div>
    </section>
  );
}
