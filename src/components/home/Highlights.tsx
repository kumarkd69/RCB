import type { SiteSettings } from "@/lib/types";
import Media from "../ui/Media";
import { Icon } from "../ui/Icon";

/** Infinite photo/video wall. Duplicated track for a seamless marquee (paused on hover & reduced motion). */
export default function Highlights({ items }: { items: SiteSettings["highlights"] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <ul className="marquee flex w-max gap-4 hover:[animation-play-state:paused]">
        {row.map((h, i) => (
          <li key={i} aria-hidden={i >= items.length} className={`relative shrink-0 overflow-hidden rounded-[var(--radius)] border border-line ${i % 2 ? "h-72 w-56" : "h-72 w-[26rem]"} md:h-96`}>
            <Media img={h.image} label={h.caption} seed={i} sizes="420px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
            {h.videoUrl && (
              <a href={h.videoUrl} target="_blank" rel="noopener noreferrer" tabIndex={i >= items.length ? -1 : 0} aria-label={`Play video: ${h.caption ?? "highlight"}`} className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red/90 shadow-[var(--glow-red)]">
                <Icon name="play" className="h-7 w-7" />
              </a>
            )}
            {h.caption && <p className="display absolute bottom-4 left-4 text-2xl">{h.caption}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
