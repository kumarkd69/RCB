import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Media from "@/components/ui/Media";
import SectionHeading from "@/components/ui/SectionHeading";
import EventCard from "@/components/events/EventCard";
import TeamCard from "@/components/team/TeamCard";
import MasonryLightbox from "@/components/gallery/MasonryLightbox";
import InstagramGrid from "@/components/gallery/InstagramGrid";
import MagneticButton from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/Icon";
import { getAlbums, getChapter, getChapters, getEvents, splitEvents } from "@/lib/data";
import { getInstagramFeed } from "@/lib/instagram";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getChapters()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getChapter((await params).slug);
  if (!c) return {};
  return { title: `${c.name} Chapter`, description: `Namma RCB HQ ${c.name} chapter — events, team and gallery from ${c.city}.`, alternates: { canonical: `/chapters/${c.slug}` } };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getChapter(slug);
  if (!c) notFound();
  const [events, albums, insta] = await Promise.all([getEvents(), getAlbums(), getInstagramFeed(8)]);
  const { upcoming, past } = splitEvents(events.filter((e) => e.chapter?.slug === slug));
  const gallery = albums.filter((a) => a.chapter?.slug === slug).flatMap((a) => a.items);
  const posts = insta.posts.filter((p) => p.chapterSlug === slug);

  return (
    <>
      <header className="relative flex min-h-[70svh] items-end overflow-hidden pb-12 pt-32">
        <div className="absolute inset-0 -z-10"><Media img={c.cover} label={c.name} priority sizes="100vw" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" /></div>
        <div className="container-x">
          <Link href="/chapters" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-gold"><Icon name="chevL" className="h-4 w-4" />All chapters</Link>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{c.city}</p>
          <h1 className="display text-[clamp(4rem,14vw,11rem)]">{c.name}</h1>
          <p className="max-w-2xl text-lg text-muted">{c.about}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <MagneticButton href="/join">Join {c.name}</MagneticButton>
            {c.instagram && <MagneticButton href={`https://www.instagram.com/${c.instagram}/`} external variant="ghost"><Icon name="instagram" className="h-4 w-4" />@{c.instagram}</MagneticButton>}
            {c.linkedin && <MagneticButton href={c.linkedin} external variant="ghost"><Icon name="linkedin" className="h-4 w-4" />LinkedIn</MagneticButton>}
          </div>
        </div>
      </header>

      <div className="container-x">
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[["Members", c.memberCount ? c.memberCount.toLocaleString("en-IN") : "Growing"], ["Upcoming", String(upcoming.length)], ["Past events", String(past.length)], ["Screens at", c.screeningVenue?.replace("[PLACEHOLDER] ", "") || "TBA"]].map(([k, v]) => (
            <div key={k} className="glass rounded-[var(--radius)] p-5"><dd className="display text-3xl text-gradient-gold">{v}</dd><dt className="text-xs uppercase tracking-widest text-muted">{k}</dt></div>
          ))}
        </dl>

        {c.lead && (
          <section aria-labelledby="lead" className="pt-20">
            <SectionHeading eyebrow="Chapter lead" title={<span id="lead">Meet the <span className="text-red">captain</span></span>} />
            <div className="max-w-xs"><TeamCard m={c.lead} /></div>
          </section>
        )}

        <section aria-labelledby="ce" className="pt-20">
          <SectionHeading eyebrow="Events" title={<span id="ce">In {c.name}</span>} />
          {[...upcoming, ...past].length ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e, i) => <li key={e._id}><EventCard e={e} seed={i} /></li>)}
              {past.slice(0, 6).map((e, i) => <li key={e._id}><EventCard e={e} past seed={i + 3} /></li>)}
            </ul>
          ) : <p className="text-muted">No events yet. Watch this space!</p>}
        </section>

        {gallery.length > 0 && (
          <section aria-labelledby="cg" className="pt-20">
            <SectionHeading eyebrow="Gallery" title={<span id="cg">Local <span className="text-gradient-gold">moments</span></span>} />
            <MasonryLightbox items={gallery} />
          </section>
        )}

        {posts.length > 0 && (
          <section aria-labelledby="ci" className="pt-20">
            <SectionHeading eyebrow="Instagram" title={<span id="ci">@{c.instagram}</span>} />
            <InstagramGrid posts={posts} connected={insta.connected} limit={8} filters={false} />
          </section>
        )}
      </div>
    </>
  );
}
