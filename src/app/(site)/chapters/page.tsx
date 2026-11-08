import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ChapterMap from "@/components/home/ChapterMap";
import TiltCard from "@/components/ui/TiltCard";
import Media from "@/components/ui/Media";
import Reveal from "@/components/ui/Reveal";
import { ChapterForm } from "@/components/forms/Forms";
import { Icon } from "@/components/ui/Icon";
import { getChapters } from "@/lib/data";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Chapters", description: "Namma RCB HQ city chapters across Karnataka. Find yours or start one.", alternates: { canonical: "/chapters" } };

export default async function ChaptersPage() {
  const chapters = await getChapters();
  return (
    <>
      <PageHero eyebrow="Chapters" title={<>Every city, one roar</>} kicker="Find your local chapter, meet the lead and join the next screening." />
      <div className="container-x">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((c, i) => (
            <Reveal as="li" key={c._id} delay={i * 0.06}>
              <TiltCard className="rounded-[var(--radius)]">
                <article className="glass group relative overflow-hidden rounded-[var(--radius)]">
                  <div className="relative aspect-[4/3]">
                    <Media img={c.cover} label={c.name} seed={i} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    <h2 className="display absolute bottom-4 left-5 text-5xl"><Link href={`/chapters/${c.slug}`} className="after:absolute after:inset-0">{c.name}</Link></h2>
                  </div>
                  <div className="flex items-center justify-between p-5 text-sm">
                    <span className="text-muted">{c.city}</span>
                    <span className="inline-flex items-center gap-1 text-gold">Explore <Icon name="arrow" className="h-4 w-4" /></span>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </ul>

        <section aria-labelledby="map" className="py-24">
          <SectionHeading eyebrow="Map" title={<span id="map">Find your chapter</span>} />
          <ChapterMap chapters={chapters} />
        </section>

        <section id="start" aria-labelledby="start-h" className="scroll-mt-28">
          <SectionHeading eyebrow="Grow the family" title={<span id="start-h">Start a chapter in your city</span>} kicker="Got a group of RCB fans? We'll help with branding, screenings and your first event." />
          <div className="glass rounded-[2rem] p-6 md:p-10"><ChapterForm /></div>
        </section>
      </div>
    </>
  );
}
