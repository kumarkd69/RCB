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
          <Media img={e.cover} label={e.title} seed={seed} />
          
          <div className="absolute left-4 top-4 rounded-lg bg-black/70 px-3 py-2 text-center" aria-hidden>
            <div className="display text-3xl leading-none">{fmtDate(e.date, { day: "2-digit" })}</div>
            <div className="text-xs text-muted">{fmtDate(e.date, { month: "short" })} {d.getFullYear()}</div>
          </div>

        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-xs text-faint">{EVENT_TYPE_LABEL[e.type]} · {LEAGUE_LABEL[e.league]}</p>
          <h3 className="display -mt-1 text-2xl leading-tight">
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
              {e.rsvpUrl && <a href={e.rsvpUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-red px-4 py-1.5 text-xs font-bold hover:bg-red-deep">RSVP</a>}
              <a href={`/events/${e.slug}/calendar.ics`} className="rounded-full border border-line px-4 py-1.5 text-xs font-bold hover:border-gold hover:text-gold">Add to calendar</a>
            </div>
          )}
          {past && e.impactStats?.length ? (
            <dl className="flex gap-4 border-t border-line pt-3">
              {e.impactStats.slice(0, 3).map((s) => (
                <div key={s.label}><dd className="display text-xl text-gold">{s.value}</dd><dt className="text-xs text-muted">{s.label}</dt></div>
              ))}
            </dl>
          ) : null}
        </div>
      </article>
    </TiltCard>
  );
}
