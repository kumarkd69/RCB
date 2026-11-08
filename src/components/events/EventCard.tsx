import Link from "next/link";
import type { ClubEvent } from "@/lib/types";
import { EVENT_TYPE_LABEL, LEAGUE_LABEL } from "@/lib/config";
import { fmtDate, fmtTime } from "@/lib/utils";
import Media from "../ui/Media";
import TiltCard from "../ui/TiltCard";
import { Icon } from "../ui/Icon";

export default function EventCard({ e, past, seed = 0 }: { e: ClubEvent; past?: boolean; seed?: number }) {
  const d = new Date(e.date);
  return (
    <TiltCard className="h-full rounded-[var(--radius)]">
      <article className="glass group relative flex h-full flex-col overflow-hidden rounded-[var(--radius)]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Media img={e.cover} label={e.title} seed={seed} className="transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute left-4 top-4 rounded-xl bg-black/60 px-3 py-2 text-center backdrop-blur" aria-hidden>
            <div className="display text-3xl leading-none">{fmtDate(e.date, { day: "2-digit" })}</div>
            <div className="text-[10px] uppercase tracking-widest text-gold">{fmtDate(e.date, { month: "short" })} {d.getFullYear()}</div>
          </div>
          <div className="absolute right-4 top-4 flex gap-1.5">
            <span className="rounded-full bg-red px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">{EVENT_TYPE_LABEL[e.type]}</span>
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">{LEAGUE_LABEL[e.league]}</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="display text-2xl leading-tight">
            <Link href={`/events/${e.slug}`} className="after:absolute after:inset-0 hover:text-gold">{e.title}</Link>
          </h3>
          <p className="text-sm text-muted">{e.summary}</p>
          <ul className="mt-auto space-y-1 text-sm text-text/80">
            <li className="flex items-center gap-2"><Icon name="calendar" className="h-4 w-4 text-gold" /><time dateTime={e.date}>{fmtDate(e.date)} · {fmtTime(e.date)}</time></li>
            {e.venue && <li className="flex items-center gap-2"><Icon name="pin" className="h-4 w-4 text-gold" />{e.venue}</li>}
            <li className="flex items-center gap-2"><Icon name="users" className="h-4 w-4 text-gold" />{e.chapter?.name ?? "HQ — all chapters"}</li>
          </ul>
          {!past && (
            <div className="relative z-10 flex flex-wrap gap-2 pt-2">
              {e.rsvpUrl && <a href={e.rsvpUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-red px-4 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-red-deep">RSVP</a>}
              <a href={`/events/${e.slug}/calendar.ics`} className="rounded-full border border-line px-4 py-1.5 text-xs font-bold uppercase tracking-wider hover:border-gold hover:text-gold">Add to calendar</a>
            </div>
          )}
          {past && e.impactStats?.length ? (
            <dl className="flex gap-4 border-t border-line pt-3">
              {e.impactStats.slice(0, 3).map((s) => (
                <div key={s.label}><dd className="display text-xl text-gold">{s.value}</dd><dt className="text-[10px] uppercase tracking-widest text-muted">{s.label}</dt></div>
              ))}
            </dl>
          ) : null}
        </div>
      </article>
    </TiltCard>
  );
}
