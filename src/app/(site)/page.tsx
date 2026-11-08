import Hero from "@/components/home/Hero";
import MatchDayStrip from "@/components/home/MatchDayStrip";
import Stats from "@/components/home/Stats";
import Recognition from "@/components/home/Recognition";
import Pillars from "@/components/home/Pillars";
import UpcomingCarousel from "@/components/home/UpcomingCarousel";
import ChapterMap from "@/components/home/ChapterMap";
import Highlights from "@/components/home/Highlights";
import InstagramGrid from "@/components/gallery/InstagramGrid";
import JoinBanner from "@/components/home/JoinBanner";
import TrophyCabinet from "@/components/glory/TrophyCabinet";
import GloryReel from "@/components/glory/GloryReel";
import JerseySection from "@/components/glory/JerseySection";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { getChapters, getEvents, getSettings, splitEvents } from "@/lib/data";
import { getInstagramFeed } from "@/lib/instagram";
import { isPlaceholder } from "@/lib/utils";
import { site } from "@/lib/config";

export const revalidate = 3600;

export default async function HomePage() {
  const [settings, events, chapters, insta] = await Promise.all([getSettings(), getEvents(), getChapters(), getInstagramFeed(6)]);
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
      <Hero nextEvent={upcoming[0] ?? null} />
      <MatchDayStrip screening={nextScreening} chapters={chapters} />

      {/* Who we are */}
      <section aria-labelledby="who" className="container-x py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <SectionHeading eyebrow="Who we are" title={<span id="who">One city<br />One heartbeat</span>} className="mb-0" />
          <Reveal delay={0.1}>
            <p className="text-lg text-muted">{settings.intro}</p>
            <div className="mt-6"><MagneticButton href="/about" variant="ghost">Our story</MagneticButton></div>
          </Reveal>
        </div>
        <div className="mt-12"><Stats stats={settings.stats} /></div>
      </section>

      <TrophyCabinet trophies={settings.trophies} />

      <GloryReel items={settings.glory} />

      <JerseySection />

      <Recognition r={settings.recognition} />

      <section aria-labelledby="pillars" className="container-x py-16">
        <SectionHeading eyebrow="What we do" title={<span id="pillars">Six things we do every season</span>} />
        <Pillars pillars={settings.pillars} />
      </section>

      <section aria-labelledby="upcoming" className="container-x py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Upcoming" title={<span id="upcoming">Coming up</span>} />
          <div className="mb-10"><MagneticButton href="/events" variant="ghost" size="sm">All events</MagneticButton></div>
        </div>
        <UpcomingCarousel events={upcoming.slice(0, 3)} />
      </section>

      <section aria-labelledby="chapters" className="relative overflow-hidden py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Chapters" title={<span id="chapters">Chapters across Karnataka</span>} kicker="Tap a pin to see a chapter" />
          <ChapterMap chapters={chapters} />
        </div>
      </section>

      <section aria-labelledby="highlights" className="py-24">
        <div className="container-x"><SectionHeading eyebrow="Highlights" title={<span id="highlights">From our screenings and drives</span>} /></div>
        <Highlights items={settings.highlights} />
      </section>

      <section aria-labelledby="insta" className="container-x py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Live from Instagram" title={<span id="insta">Fresh from the stands</span>} />
          <div className="mb-10"><MagneticButton href="/gallery#instagram" variant="ghost" size="sm">Full gallery</MagneticButton></div>
        </div>
        <InstagramGrid posts={insta.posts} connected={insta.connected} limit={8} />
      </section>

      <section aria-labelledby="vision" className="relative py-32">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,.12),transparent_60%)]" />
        <div className="container-x relative text-center">
          <p className="eyebrow mb-4">Our vision</p>
          <Reveal><h2 id="vision" className="display mx-auto max-w-5xl text-[clamp(2.2rem,6vw,5rem)] leading-[1.02]">&ldquo;{settings.vision}&rdquo;</h2></Reveal>
          <Reveal delay={0.15}><p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{settings.mission}</p></Reveal>
        </div>
      </section>

      <JoinBanner whatsapp={settings.whatsappLink} />
    </>
  );
}
