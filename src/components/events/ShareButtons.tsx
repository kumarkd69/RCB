"use client";
import { useState } from "react";
import { Icon } from "../ui/Icon";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title, url }); } catch {} return; }
    await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const cls = "glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:text-gold";
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={share} className={cls}><Icon name="share" className="h-4 w-4" />{copied ? "Link copied" : "Share"}</button>
      <a className={cls} href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" className="h-4 w-4" />WhatsApp</a>
      <a className={cls} href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer"><Icon name="x" className="h-4 w-4" />Post</a>
    </div>
  );
}
