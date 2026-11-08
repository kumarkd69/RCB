import type { SiteSettings } from "@/lib/types";
import Media from "../ui/Media";
import { Icon } from "../ui/Icon";

/** Swipeable row of club highlights (static, no looping marquee). */
export default function Highlights({ items }: { items: SiteSettings["highlights"] }) {
  return (
    <ul tabIndex={0} aria-label="Highlights" className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
      {items.map((h, i) => (
        <li key={i} className={`relative shrink-0 snap-start overflow-hidden rounded-[var(--radius)] border border-line ${i % 2 ? "h-80 w-60" : "h-80 w-[26rem] max-w-[85vw]"} md:h-96`}>
          <Media img={h.image} label={h.caption} sizes="420px" />
          {h.image?.src && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />}
          {h.videoUrl && (
            <a href={h.videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Play video: ${h.caption ?? "highlight"}`} className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red transition-colors hover:bg-[#b5141a]">
              <Icon name="play" className="h-6 w-6" />
            </a>
          )}
          {h.caption && <p className="absolute left-4 top-4 text-sm font-medium">{h.caption}</p>}
        </li>
      ))}
    </ul>
  );
}
