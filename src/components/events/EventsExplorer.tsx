"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Chapter, ClubEvent } from "@/lib/types";
import { EVENT_TYPE_LABEL, LEAGUE_LABEL } from "@/lib/config";
import { cn } from "@/lib/utils";
import EventCard from "./EventCard";
import { Icon } from "../ui/Icon";

type F = { chapter: string; type: string; league: string };
const IST = "Asia/Kolkata";
const ymd = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: IST, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="flex flex-col gap-1 text-xs uppercase tracking-widest text-muted">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="glass rounded-full px-4 py-2 text-sm normal-case tracking-normal text-text">
        <option value="all">All</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

function Calendar({ events }: { events: ClubEvent[] }) {
  const first = events[0] ? new Date(events[0].date) : new Date();
  const [cursor, setCursor] = useState(new Date(first.getFullYear(), first.getMonth(), 1));
  const days = useMemo(() => {
    const start = new Date(cursor); start.setDate(1 - ((start.getDay() + 6) % 7)); // Monday start
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  }, [cursor]);
  const byDay = useMemo(() => {
    const m = new Map<string, ClubEvent[]>();
    events.forEach((e) => { const k = ymd(new Date(e.date)); m.set(k, [...(m.get(k) ?? []), e]); });
    return m;
  }, [events]);
  const today = ymd(new Date());
  const shift = (n: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));

  return (
    <div className="glass rounded-[var(--radius)] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => shift(-1)} aria-label="Previous month" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"><Icon name="chevL" /></button>
        <h3 className="display text-3xl" aria-live="polite">{cursor.toLocaleString("en-IN", { month: "long", year: "numeric" })}</h3>
        <button onClick={() => shift(1)} aria-label="Next month" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"><Icon name="chevR" /></button>
      </div>
      <div role="grid" aria-label="Event calendar" className="grid grid-cols-7 gap-1 text-sm">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} role="columnheader" className="pb-2 text-center text-[10px] uppercase tracking-widest text-muted">{d}</div>)}
        {days.map((d) => {
          const k = ymd(d), list = byDay.get(k) ?? [], inMonth = d.getMonth() === cursor.getMonth();
          return (
            <div key={k} role="gridcell" className={cn("min-h-16 rounded-lg border border-line p-1 md:min-h-24 md:p-2", !inMonth && "opacity-30", k === today && "border-gold")}>
              <div className="text-xs text-muted">{d.getDate()}</div>
              <ul className="mt-1 space-y-1">
                {list.map((e) => (
                  <li key={e._id}>
                    <Link href={`/events/${e.slug}`} title={e.title} className="block truncate rounded bg-red/80 px-1 py-0.5 text-[10px] font-semibold hover:bg-red md:text-xs">
                      {e.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EventsExplorer({ upcoming, past, chapters }: { upcoming: ClubEvent[]; past: ClubEvent[]; chapters: Chapter[] }) {
  const [f, setF] = useState<F>({ chapter: "all", type: "all", league: "all" });
  const [view, setView] = useState<"cards" | "calendar">("cards");
  const match = (e: ClubEvent) =>
    (f.chapter === "all" || (f.chapter === "hq" ? !e.chapter : e.chapter?.slug === f.chapter)) &&
    (f.type === "all" || e.type === f.type) &&
    (f.league === "all" || e.league === f.league);
  const up = upcoming.filter(match), pa = past.filter(match);

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end gap-4">
        <Select label="Chapter" value={f.chapter} onChange={(chapter) => setF({ ...f, chapter })} options={[["hq", "HQ"], ...chapters.map((c) => [c.slug, c.name] as [string, string])]} />
        <Select label="Type" value={f.type} onChange={(type) => setF({ ...f, type })} options={Object.entries(EVENT_TYPE_LABEL)} />
        <Select label="League" value={f.league} onChange={(league) => setF({ ...f, league })} options={Object.entries(LEAGUE_LABEL)} />
        <div role="group" aria-label="View" className="glass ml-auto flex rounded-full p-1">
          {(["cards", "calendar"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className={cn("flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm capitalize", view === v ? "bg-red" : "text-muted")}>
              <Icon name={v === "cards" ? "grid" : "calendar"} className="h-4 w-4" />{v}
            </button>
          ))}
        </div>
      </div>

      {view === "calendar" ? (
        <Calendar events={[...up, ...pa].sort((a, b) => +new Date(a.date) - +new Date(b.date))} />
      ) : (
        <>
          <section aria-labelledby="up-h">
            <h2 id="up-h" className="display mb-6 text-4xl">Upcoming <span className="text-muted">({up.length})</span></h2>
            {up.length ? (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{up.map((e, i) => <li key={e._id}><EventCard e={e} seed={i} /></li>)}</ul>
            ) : <p className="text-muted">No upcoming events match these filters.</p>}
          </section>
          <section aria-labelledby="past-h" className="mt-20">
            <h2 id="past-h" className="display mb-6 text-4xl">Past events <span className="text-muted">({pa.length})</span></h2>
            {pa.length ? (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{pa.map((e, i) => <li key={e._id}><EventCard e={e} past seed={i + 2} /></li>)}</ul>
            ) : <p className="text-muted">No past events match these filters.</p>}
          </section>
        </>
      )}
    </div>
  );
}
