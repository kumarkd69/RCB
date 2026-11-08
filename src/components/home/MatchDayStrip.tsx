import Link from "next/link";
import type { Chapter, ClubEvent } from "@/lib/types";
import { LEAGUE_LABEL } from "@/lib/config";
import { fmtDate, fmtTime } from "@/lib/utils";
import { Icon } from "../ui/Icon";

/** Next RCB fixture we're screening + where each chapter watches. */
export default function MatchDayStrip({ screening, chapters }: { screening: ClubEvent | null; chapters: Chapter[] }) {
  return (
    <section aria-labelledby="matchday" className="relative z-10 -mt-6 border-y border-red/40 bg-gradient-to-r from-red-deep via-red to-red-deep">
      <div className="container-x flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="display rounded-md bg-black/30 px-3 py-1 text-sm tracking-widest">Match Day</span>
          {screening ? (
            <div>
              <h2 id="matchday" className="display text-2xl md:text-3xl">
                RCB <span className="text-gold-soft">vs</span> {screening.opponent || "TBD"}
                <span className="ml-3 align-middle text-xs font-sans font-semibold tracking-widest text-white/80">{LEAGUE_LABEL[screening.league]}</span>
              </h2>
              <p className="text-sm text-white/85">{fmtDate(screening.date)} · {fmtTime(screening.date)} IST</p>
            </div>
          ) : (
            <h2 id="matchday" className="display text-2xl">Fixtures announced soon. Stay loud.</h2>
          )}
        </div>
        <ul className="flex flex-wrap gap-2 text-sm" aria-label="Screening venues by chapter">
          {chapters.map((c) => (
            <li key={c._id}>
              <Link href={`/chapters/${c.slug}`} className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 hover:bg-black/50">
                <Icon name="pin" className="h-4 w-4 text-gold-soft" />
                <span className="font-semibold">{c.name}</span>
                <span className="text-white/70">{c.screeningVenue?.replace("[PLACEHOLDER] ", "") || "Venue TBA"}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
