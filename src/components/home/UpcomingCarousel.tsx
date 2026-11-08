"use client";
import { useRef } from "react";
import type { ClubEvent } from "@/lib/types";
import EventCard from "../events/EventCard";
import { Icon } from "../ui/Icon";

/** Scroll-snap carousel: swipe on touch, arrow buttons on desktop, keyboard scrollable. */
export default function UpcomingCarousel({ events }: { events: ClubEvent[] }) {
  const track = useRef<HTMLUListElement>(null);
  const go = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  if (!events.length) return <p className="text-muted">No upcoming events yet</p>;
  return (
    <div className="relative">
      <ul ref={track} tabIndex={0} aria-label="Upcoming events" className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:-mx-0 md:px-0">
        {events.map((e, i) => (
          <li key={e._id} className="w-[85%] shrink-0 snap-start sm:w-[45%] lg:w-[calc(33.333%-0.7rem)]">
            <EventCard e={e} seed={i} />
          </li>
        ))}
      </ul>
      {events.length > 1 && (
        <div className="mt-4 hidden justify-end gap-2 md:flex">
          <button onClick={() => go(-1)} aria-label="Previous events" className="glass grid h-11 w-11 place-items-center rounded-full hover:text-gold"><Icon name="chevL" /></button>
          <button onClick={() => go(1)} aria-label="Next events" className="glass grid h-11 w-11 place-items-center rounded-full hover:text-gold"><Icon name="chevR" /></button>
        </div>
      )}
    </div>
  );
}
