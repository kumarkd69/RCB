"use client";
import { useState } from "react";
import type { TeamMember } from "@/lib/types";
import Media from "../ui/Media";
import { Icon } from "../ui/Icon";
import { cn } from "@/lib/utils";

const initials = (n: string) => { const w = n.trim().split(/\s+/); return ((w[0]?.[0] ?? "") + (w[1]?.[0] ?? "")).toUpperCase(); };

/** Flip card: photo + name on front; role, chapter and socials on back. Hover, focus or tap to flip. */
export default function TeamCard({ m, i = 0 }: { m: Pick<TeamMember, "name" | "role" | "photo" | "socials"> & { chapter?: TeamMember["chapter"] }; i?: number }) {
  const [flip, setFlip] = useState(false);
  const s = m.socials ?? {};
  return (
    <div className="group aspect-[3/4] [perspective:1200px]" onMouseEnter={() => setFlip(true)} onMouseLeave={() => setFlip(false)}>
      <div className={cn("relative h-full w-full transition-transform duration-700 ease-[var(--ease-out)] [transform-style:preserve-3d]", flip && "[transform:rotateY(180deg)]")}>
        {/* front */}
        <div className="absolute inset-0 overflow-hidden rounded-[var(--radius)] border border-line [backface-visibility:hidden]">
          {m.photo?.src ? (
            <Media img={m.photo} label={m.name} seed={i} sizes="(max-width:768px) 50vw, 25vw" />
          ) : (
            /* no photo yet: initials on RCB red/black, like the plan deck */
            <div aria-hidden className={cn("absolute inset-0 grid place-items-center", i % 2 ? "bg-red" : "bg-raised")}>
              <span className={cn("display text-[5.5rem] leading-none", i % 2 ? "text-black/80" : "text-gold")}>{initials(m.name)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="display text-2xl leading-tight">{m.name}</h3>
            <p className="text-sm text-gold">{m.role}</p>
          </div>
          <button onClick={() => setFlip(true)} aria-label={`Show details for ${m.name}`} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-lg backdrop-blur">+</button>
        </div>
        {/* back */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-[var(--radius)] border border-gold/40 bg-gradient-to-br from-red-deep to-black p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]" aria-hidden={!flip}>
          <div>
            <p className="text-xs text-muted">{m.chapter?.name ?? "Core team"}</p>
            <h3 className="display mt-2 text-3xl">{m.name}</h3>
            <p className="mt-1 text-lg">{m.role}</p>
          </div>
          <div className="flex gap-2">
            {s.instagram && <a tabIndex={flip ? 0 : -1} href={`https://www.instagram.com/${s.instagram}/`} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on Instagram`} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-red"><Icon name="instagram" /></a>}
            {s.linkedin && <a tabIndex={flip ? 0 : -1} href={s.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-red"><Icon name="linkedin" /></a>}
            {s.x && <a tabIndex={flip ? 0 : -1} href={s.x} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on X`} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-red"><Icon name="x" /></a>}
            <button tabIndex={flip ? 0 : -1} onClick={() => setFlip(false)} aria-label="Flip back" className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white/10">↺</button>
          </div>
        </div>
      </div>
    </div>
  );
}
