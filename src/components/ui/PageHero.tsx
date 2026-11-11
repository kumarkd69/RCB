import Reveal from "./Reveal";

export default function PageHero({ eyebrow, title, kicker }: { eyebrow: string; title: React.ReactNode; kicker?: string }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-36 md:pt-44">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,rgba(236,28,36,.18),transparent_55%)]" />
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="display text-[clamp(3.5rem,11vw,9rem)]">{title}</h1>
          {kicker && <p className="mt-4 max-w-2xl text-lg text-muted">{kicker}</p>}
        </Reveal>
      </div>
    </section>
  );
}
