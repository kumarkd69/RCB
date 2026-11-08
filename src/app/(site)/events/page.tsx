import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import EventsExplorer from "@/components/events/EventsExplorer";
import { getChapters, getEvents, splitEvents } from "@/lib/data";

export const revalidate = 3600; // also flips events from Upcoming → Past
export const metadata: Metadata = { title: "Events", description: "Match-day screenings, fan meets, away trips and social initiatives by Namma RCB HQ.", alternates: { canonical: "/events" } };

export default async function EventsPage() {
  const [events, chapters] = await Promise.all([getEvents(), getChapters()]);
  const { upcoming, past } = splitEvents(events);
  return (
    <>
      <PageHero eyebrow="Events" title={<>Where the <span className="text-red">noise</span> happens</>} kicker="Screenings, fan meets, away trips and social drives across every chapter." />
      <div className="container-x"><EventsExplorer upcoming={upcoming} past={past} chapters={chapters} /></div>
    </>
  );
}
