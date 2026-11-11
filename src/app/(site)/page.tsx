import Link from "next/link";
import Hero from "@/components/home/Hero";
import MatchDayStrip from "@/components/home/MatchDayStrip";
import WhatWeDo from "@/components/home/WhatWeDo";
import TrophyCabinet from "@/components/glory/TrophyCabinet";
import EventCard from "@/components/events/EventCard";
import InstagramGrid from "@/components/gallery/InstagramGrid";
import JoinBanner from "@/components/home/JoinBanner";
import Media from "@/components/ui/Media";
import { Icon } from "@/components/ui/Icon";
import { getChapters, getEvents, getSettings, splitEvents } from "@/lib/data";
import { getInstagramFeed } from "@/lib/instagram";
import { site } from "@/lib/config";

export const revalidate = 3600;

function Head({ eyebrow, title, id, href, link }: { eyebrow: string; title: string; id: string; href?: string; link?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 id={id} className="display text-4xl md:text-5xl">{title}</h2>
      </div>
      {href && <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">{link}<Icon name="arrow" className="h-4 w-4" /></Link>}
    </div>
  );
}

/** Compact home: hero → what we do → upcoming → trophies → chapters → Instagram → join. */
export default async function HomePage() {
  const [settings, events, chapters, insta] = await Promise.all([getSettings(), getEvents(), getChapters(), getInstagramFeed(4)]);
  const { upcoming } = splitEvents(events);
  const nextScreening = upcoming.find((e) => e.type === "screening") ?? null;

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: site.name,
    url: site.url,
    description: site.description,
    sport: "Cricket",
    sameAs: ["https://www.instagram.com/nammarcbhqofficial/"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <Hero nextEvent={upcoming[0] ?? null} videoUrl={settings.heroVideoUrl} />
      <MatchDayStrip screening={nextScreening} chapters={chapters} />

      <WhatWeDo pillars={settings.pillars} stats={settings.stats} intro={settings.intro} />

      <section aria-labelledby="upcoming" className="container-x pb-16 md:pb-20">
        <Head eyebrow="Upcoming" title="Next events" id="upcoming" href="/events" link="All events" />
        {upcoming.length ? (
          <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0 lg:grid-cols-3">
            {upcoming.slice(0, 3).map((e, i) => <li key={e._id} className={`w-[82%] shrink-0 snap-start sm:w-auto ${i === 2 ? "sm:hidden lg:block" : ""}`}><EventCard e={e} seed={i} /></li>)}
          </ul>
        ) : <p className="text-muted">No upcoming events yet</p>}
      </section>

      <TrophyCabinet trophies={settings.trophies} videoUrl={settings.trophyVideoUrl} />

      <section aria-labelledby="chapters" className="container-x py-16 md:py-20">
        <Head eyebrow="Chapters" title="Find your chapter" id="chapters" href="/chapters" link="Chapter map" />
        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4 [&>li]:w-[70%] [&>li]:shrink-0 [&>li]:snap-start sm:[&>li]:w-auto">
          {chapters.map((c) => (
            <li key={c._id}>
              <Link href={`/chapters/${c.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius)] border border-line">
                <Media img={c.cover} label={c.name} sizes="(max-width:768px) 100vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="display text-3xl transition-colors group-hover:text-gold">{c.name}</p>
                  <p className="text-sm text-white/75">{c.memberCount ? `${c.memberCount.toLocaleString("en-IN")} members` : c.city} · {c.screeningVenue}</p>
                </div>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/chapters#start" className="flex aspect-[4/3] flex-col justify-end rounded-[var(--radius)] border border-dashed border-white/25 p-4 transition-colors hover:border-gold">
              <p className="display text-3xl">Your city?</p>
              <p className="text-sm text-muted">Start a chapter with us</p>
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="insta" className="container-x pb-16 md:pb-20">
        <Head eyebrow="Instagram" title="Fresh from the stands" id="insta" href="/gallery#instagram" link="Full gallery" />
        <InstagramGrid posts={insta.posts} connected={insta.connected} limit={6} filters={false} cols={6} />
      </section>

      <JoinBanner whatsapp={settings.whatsappLink} />
    </>
  );
}
