import Image from "next/image";
import { instagramAccounts } from "@/lib/config";
import type { InstaPost } from "@/lib/types";
import { Icon } from "../ui/Icon";

/**
 * Social media wall: a profile header for the club's Instagram, follow buttons for
 * every chapter page, and a bento grid of the latest posts (first one large).
 */
export default function SocialWall({ posts }: { posts: InstaPost[] }) {
  const accounts = instagramAccounts.filter((a) => a.handle);
  const main = accounts[0];
  const shown = posts.slice(0, 7);
  return (
    <section aria-labelledby="insta" className="relative overflow-hidden py-20 md:py-28">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="container-x">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow mb-3">Social media</p>
            <h2 id="insta" className="display text-5xl md:text-7xl">Follow the fan family</h2>
            <p className="mt-3 max-w-xl text-lg text-muted">Every screening, meet and drive lands on our Instagram first. Tag us to get featured here.</p>
          </div>
          <a href={`https://www.instagram.com/${main.handle}/`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-[var(--radius)] border border-line bg-ink p-4 pr-5 transition-colors hover:border-gold">
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-black p-1 ring-2 ring-red">
              <Image src="/brand/logo-600.png" alt="" width={40} height={59} className="h-12 w-auto" />
            </span>
            <span>
              <span className="block font-semibold">@{main.handle}</span>
              <span className="block text-sm text-muted">Namma RCB HQ Official</span>
            </span>
            <span className="ml-2 rounded-full bg-red px-4 py-2 text-sm font-semibold">Follow</span>
          </a>
        </div>

        <ul className="grid auto-rows-[1fr] grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {shown.map((p, i) => {
            const src = p.mediaType === "VIDEO" ? p.thumbnailUrl : p.mediaUrl;
            return (
              <li key={p.id} className={i === 0 ? "col-span-2 row-span-2" : ""}>
                <a href={p.permalink} target="_blank" rel="noopener noreferrer" aria-label={`Instagram post by @${p.handle}: ${p.caption.slice(0, 80)}`} className="group relative block aspect-square h-full overflow-hidden rounded-[var(--radius)] bg-raised">
                  {src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={p.caption.slice(0, 120) || `Post by @${p.handle}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="flex items-center gap-1.5 text-sm font-semibold"><Icon name="instagram" className="h-4 w-4" />@{p.handle}</span>
                    <span className="mt-1 line-clamp-2 text-sm text-white/80">{p.caption}</span>
                  </div>
                  <Icon name={p.mediaType === "VIDEO" ? "play" : "instagram"} className="absolute right-3 top-3 h-5 w-5 drop-shadow" />
                </a>
              </li>
            );
          })}
          <li className="col-span-2 md:col-span-1">
            <div className="flex h-full min-h-40 flex-col justify-between rounded-[var(--radius)] border border-line bg-ink p-5">
              <p className="display text-2xl">Our pages</p>
              <ul className="mt-3 space-y-2">
                {accounts.map((a) => (
                  <li key={a.key}>
                    <a href={`https://www.instagram.com/${a.handle}/`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 text-sm hover:text-gold">
                      <span className="flex items-center gap-2"><Icon name="instagram" className="h-4 w-4 text-red" />{a.label}</span>
                      <span className="text-muted">@{a.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
