import Media from "../ui/Media";
import { Icon } from "../ui/Icon";
import type { TeamMember } from "@/lib/types";

/** Team member card in the same style as the chapter cards: photo, name, role, Instagram. */
export default function TeamRow({ m }: { m: TeamMember }) {
  const ig = m.socials?.instagram;
  return (
    <article className="flex items-center gap-4 rounded-[var(--radius)] border border-line bg-ink p-3 pr-5 transition-colors hover:border-gold">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg md:h-24 md:w-24">
        <Media img={m.photo} label={m.name} sizes="96px" />
      </div>
      <div className="mr-auto">
        <h3 className="display text-2xl leading-tight md:text-3xl">{m.name}</h3>
        <p className="text-sm text-muted">{m.role}</p>
      </div>
      {ig && (
        <a href={`https://www.instagram.com/${ig}/`} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on Instagram`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-gold hover:border-gold">
          <Icon name="instagram" className="h-4 w-4" />
        </a>
      )}
    </article>
  );
}
