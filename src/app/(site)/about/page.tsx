import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Timeline from "@/components/about/Timeline";
import TeamCard from "@/components/team/TeamCard";
import Recognition from "@/components/home/Recognition";
import Pillars from "@/components/home/Pillars";
import GloryReel from "@/components/glory/GloryReel";
import { getChapters, getInitiatives, getMilestones, getSettings, getTeam } from "@/lib/data";
import { isPlaceholder } from "@/lib/utils";

export const revalidate = 3600;
export const metadata: Metadata = { title: "About", description: "Our story, mission, values, core team and chapter leads.", alternates: { canonical: "/about" } };

export default async function AboutPage() {
  const [settings, team, chapters, milestones, initiatives] = await Promise.all([getSettings(), getTeam(), getChapters(), getMilestones(), getInitiatives()]);
  const core = team.filter((t) => t.isCore);
  const leadsByCity = chapters.map((c) => ({ c, members: team.filter((t) => !t.isCore && t.chapter?.slug === c.slug) })).filter((g) => g.members.length);

  return (
    <>
      <PageHero eyebrow="About us" title={<>Fans first, always</>} kicker={settings.intro} />

      <section aria-labelledby="story" className="container-x py-16">
        <SectionHeading eyebrow="Our story" title={<span id="story">How we started</span>} kicker={<span>{settings.story}</span>} />
        <Timeline items={milestones} />
      </section>

      <section aria-labelledby="mvv" className="container-x py-16">
        <h2 id="mvv" className="sr-only">Mission, vision and values</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[{ t: "Mission", b: settings.mission }, { t: "Vision", b: settings.vision }].map((x, i) => (
            <Reveal key={x.t} delay={i * 0.1} className="glass rounded-[var(--radius)] p-8">
              <p className="display text-4xl">{x.t}</p>
              <p className="mt-3 text-lg text-muted">{x.b}</p>
            </Reveal>
          ))}
          <Reveal delay={0.2} className="glass rounded-[var(--radius)] p-8">
            <p className="display text-4xl">Values</p>
            <ul className="mt-3 space-y-2">{settings.values.map((v) => <li key={v} className="flex gap-2 text-lg text-muted"><span className="text-red">●</span>{v}</li>)}</ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="activities" className="container-x py-16">
        <SectionHeading eyebrow="What we do" title={<span id="activities">Six things we do every season</span>} />
        <Pillars pillars={settings.pillars} />
      </section>

      <Recognition r={settings.recognition} />

      <GloryReel items={settings.glory} />

      <section aria-labelledby="core" className="container-x py-16">
        <SectionHeading eyebrow="Core team" title={<span id="core">The people who run it</span>} />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {core.map((m, i) => <li key={m._id}><TeamCard m={m} i={i} /></li>)}
        </ul>
      </section>

      {leadsByCity.length > 0 && (
        <section aria-labelledby="leads" className="container-x py-16">
          <SectionHeading eyebrow="Chapter leads" title={<span id="leads">Chapter leads</span>} />
          <div className="space-y-12">
            {leadsByCity.map(({ c, members }) => (
              <div key={c._id}>
                <h3 className="display mb-4 text-3xl">{c.city}</h3>
                <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{members.map((m, i) => <li key={m._id}><TeamCard m={m} i={i + 2} /></li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {initiatives.length > 0 && (
        <section aria-labelledby="impact" className="container-x py-16">
          <SectionHeading eyebrow="Milestones & impact" title={<span id="impact">What we have done so far</span>} />
          <ul className="grid gap-4 md:grid-cols-2">
            {initiatives.map((x, i) => (
              <Reveal as="li" key={x._id} delay={i * 0.05} className="glass rounded-[var(--radius)] p-6">
                <p className="text-xs text-muted">{x.chapter?.name ?? "All chapters"}</p>
                <h3 className="display mt-1 text-3xl">{x.title}</h3>
                <p className="mt-2 text-muted">{x.summary}</p>
                {x.impact && <p className="mt-4 display text-2xl text-gradient-gold">{x.impact}</p>}
              </Reveal>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
