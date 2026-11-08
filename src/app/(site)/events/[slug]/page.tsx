import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import Media from "@/components/ui/Media";
import Countdown from "@/components/ui/Countdown";
import MagneticButton from "@/components/ui/MagneticButton";
import ShareButtons from "@/components/events/ShareButtons";
import MasonryLightbox from "@/components/gallery/MasonryLightbox";
import { Icon } from "@/components/ui/Icon";
import { getEvent, getEvents, getAlbums } from "@/lib/data";
import { EVENT_TYPE_LABEL, LEAGUE_LABEL, site } from "@/lib/config";
import { googleCalUrl } from "@/lib/ics";
import { fmtDate, fmtTime } from "@/lib/utils";
import type { GalleryItem } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = await getEvent((await params).slug);
  if (!e) return {};
  return {
    title: e.title,
    description: e.summary ?? `${EVENT_TYPE_LABEL[e.type]} on ${fmtDate(e.date)}`,
    alternates: { canonical: `/events/${e.slug}` },
    openGraph: { title: e.title, description: e.summary, images: e.cover?.src ? [{ url: e.cover.src }] : undefined },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) notFound();
  const isPast = new Date(e.endDate ?? e.date).getTime() + 6 * 3600_000 < Date.now();
  const albums = await getAlbums();
  const gallery: GalleryItem[] = albums.filter((a) => a.eventSlug === e.slug).flatMap((a) => a.items);
  const url = `${site.url}/events/${e.slug}`;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.date,
    endDate: e.endDate ?? new Date(new Date(e.date).getTime() + 3 * 3600_000).toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: e.venue ?? "TBA", address: e.venue ?? e.chapter?.city ?? "Karnataka, India" },
    image: e.cover?.src ? [e.cover.src] : undefined,
    description: e.summary,
    organizer: { "@type": "Organization", name: site.name, url: site.url },
    offers: e.rsvpUrl ? { "@type": "Offer", url: e.rsvpUrl, price: "0", priceCurrency: "INR", availability: "https://schema.org/InStock" } : undefined,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="relative flex min-h-[70svh] items-end overflow-hidden pb-12 pt-32">
        <div className="absolute inset-0 -z-10">
          <Media img={e.cover} label={e.title} priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>
        <div className="container-x">
          <Link href="/events" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-gold"><Icon name="chevL" className="h-4 w-4" />All events</Link>
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-red px-3 py-1 text-xs font-bold">{EVENT_TYPE_LABEL[e.type]}</span>
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-gold">{LEAGUE_LABEL[e.league]}</span>
            {isPast && <span className="rounded-full border border-line px-3 py-1 text-xs font-bold text-muted">Past event</span>}
          </div>
          <h1 className="display max-w-4xl text-[clamp(3rem,9vw,7rem)]">{e.title}</h1>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-text/90">
            <li className="flex items-center gap-2"><Icon name="calendar" className="h-5 w-5 text-gold" /><time dateTime={e.date}>{fmtDate(e.date)} · {fmtTime(e.date)} IST</time></li>
            {e.venue && <li className="flex items-center gap-2"><Icon name="pin" className="h-5 w-5 text-gold" />{e.venue}</li>}
            <li className="flex items-center gap-2"><Icon name="users" className="h-5 w-5 text-gold" />{e.chapter ? <Link className="hover:text-gold" href={`/chapters/${e.chapter.slug}`}>{e.chapter.name} chapter</Link> : "HQ — all chapters"}</li>
          </ul>
          {!isPast && <div className="mt-6"><Countdown to={e.date} /></div>}
        </div>
      </header>

      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-12">
          {e.summary && <p className="text-xl text-text/90">{e.summary}</p>}
          {e.description && (
            <div className="prose-invert max-w-none space-y-4 text-lg leading-relaxed text-muted [&_a]:text-gold [&_h2]:display [&_h2]:text-3xl [&_h2]:text-text">
              <PortableText value={e.description} />
            </div>
          )}
          {isPast && (e.recap || e.impactStats?.length) && (
            <section aria-labelledby="recap" className="glass rounded-[var(--radius)] p-6 md:p-8">
              <h2 id="recap" className="display text-4xl">Recap</h2>
              {e.recap && <p className="mt-3 text-lg text-muted">{e.recap}</p>}
              {e.impactStats?.length ? (
                <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {e.impactStats.map((s) => <div key={s.label} className="rounded-xl bg-white/5 p-4"><dd className="display text-4xl text-gradient-gold">{s.value}</dd><dt className="text-xs text-muted">{s.label}</dt></div>)}
                </dl>
              ) : null}
            </section>
          )}
          {e.schedule?.length ? (
            <section aria-labelledby="schedule">
              <h2 id="schedule" className="display mb-4 text-4xl">Schedule</h2>
              <ol className="relative space-y-4 border-l border-red/50 pl-6">
                {e.schedule.map((s, i) => (
                  <li key={i} className="relative"><span className="absolute -left-[1.95rem] top-1.5 h-3 w-3 rounded-full bg-red" /><span className="display text-xl text-gold">{s.time}</span><p className="text-muted">{s.item}</p></li>
                ))}
              </ol>
            </section>
          ) : null}
          {gallery.length > 0 && (
            <section aria-labelledby="eg"><h2 id="eg" className="display mb-6 text-4xl">Gallery</h2><MasonryLightbox items={gallery} /></section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {!isPast && (
            <div className="glass space-y-3 rounded-[var(--radius)] p-6">
              <h2 className="display text-2xl">Be there</h2>
              {e.rsvpUrl ? <MagneticButton href={e.rsvpUrl} external className="w-full">RSVP now</MagneticButton> : <p className="text-sm text-muted">RSVP link coming soon.</p>}
              <div className="flex flex-wrap gap-2 text-sm">
                <a href={`/events/${e.slug}/calendar.ics`} className="rounded-full border border-line px-4 py-2 hover:border-gold hover:text-gold">Apple / Outlook (.ics)</a>
                <a href={googleCalUrl(e)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-4 py-2 hover:border-gold hover:text-gold">Google Calendar</a>
              </div>
            </div>
          )}
          {(e.mapUrl || e.venue) && (
            <div className="glass overflow-hidden rounded-[var(--radius)]">
              <iframe
                title={`Map of ${e.venue ?? "venue"}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(e.venue ?? "")}&output=embed`}
                loading="lazy"
                className="aspect-[4/3] w-full grayscale invert-[.9] hue-rotate-180"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {e.mapUrl && <a href={e.mapUrl} target="_blank" rel="noopener noreferrer" className="block p-4 text-sm text-gold hover:underline">Open in Google Maps ↗</a>}
            </div>
          )}
          <div className="glass rounded-[var(--radius)] p-6"><h2 className="display mb-3 text-2xl">Spread the word</h2><ShareButtons url={url} title={e.title} /></div>
        </aside>
      </div>
    </article>
  );
}
