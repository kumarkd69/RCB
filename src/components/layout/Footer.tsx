import Link from "next/link";
import Image from "next/image";
import { instagramAccounts, nav, site } from "@/lib/config";
import type { Chapter, SiteSettings } from "@/lib/types";
import Logo from "./Logo";
import { Icon } from "../ui/Icon";

export default function Footer({ settings, chapters }: { settings: SiteSettings; chapters: Chapter[] }) {
  const badge = settings.recognition.badge;
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-black">
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-4">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <Logo logo={settings.logo} size={80} />
            <span className="display text-2xl">Namma <span className="text-red">RCB</span> HQ</span>
          </div>
          <p className="text-sm text-muted">{settings.tagline}</p>
          {/* Recognised-by-RCB badge slot */}
          <div className="glass inline-flex items-center gap-3 rounded-2xl px-4 py-3">
            {badge?.src ? (
              <Image src={badge.src} alt={badge.alt} width={40} height={40} className="h-10 w-10 object-contain" />
            ) : (
              <span title="[PLACEHOLDER] Recognition badge" className="grid h-10 w-10 place-items-center rounded-full border border-dashed border-gold text-gold"><Icon name="star" className="h-5 w-5" /></span>
            )}
            <span className="text-xs leading-tight"><span className="block font-medium text-text">Recognised by RCB</span>Official fan club</span>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-medium text-text">Explore</h2>
          <ul className="space-y-2 text-sm">
            {[...nav, { href: "/join", label: "Join Us" }].map((n) => (
              <li key={n.href}><Link className="text-muted hover:text-text" href={n.href}>{n.label}</Link></li>
            ))}
            <li><Link className="text-muted hover:text-text" href="/studio">Member login (Studio)</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-medium text-text">Chapters</h2>
          <ul className="space-y-2 text-sm">
            {instagramAccounts.map((a) => (
              <li key={a.key} className="flex items-center gap-2">
                <Icon name="instagram" className="h-4 w-4 text-faint" />
                {a.handle ? (
                  <a className="text-muted hover:text-text" href={`https://www.instagram.com/${a.handle}/`} target="_blank" rel="noopener noreferrer">
                    {a.label} · @{a.handle}
                  </a>
                ) : (
                  <span className="text-muted/60">{a.label} · coming soon</span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">{chapters.length} chapters and growing.</p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-medium text-text">Contact</h2>
          <ul className="space-y-2 text-sm text-muted">
            {settings.contactEmail && <li><a className="hover:text-text" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></li>}
            {settings.contactPhone && <li><a className="hover:text-text" href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a></li>}
            {settings.whatsappLink && <li><a className="hover:text-text" href={settings.whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp community</a></li>}
            <li><Link className="hover:text-text" href="/join#contact">Send us a message</Link></li>
          </ul>
          <h2 className="mb-3 mt-8 text-sm font-medium text-text">Official RCB</h2>
          <ul className="space-y-2 text-sm">
            <li><a className="text-muted hover:text-text" href={site.rcbLinks.website} target="_blank" rel="noopener noreferrer">royalchallengers.com ↗</a></li>
            <li><a className="text-muted hover:text-text" href={site.rcbLinks.app} target="_blank" rel="noopener noreferrer">RCB app ↗</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted md:flex-row md:justify-between">
          <p>{site.disclaimer}</p>
          <p>© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
