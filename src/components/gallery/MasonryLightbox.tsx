"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type PanInfo } from "framer-motion";
import type { GalleryItem } from "@/lib/types";
import Media from "../ui/Media";
import { Icon } from "../ui/Icon";

function Tile({ item, i }: { item: GalleryItem; i: number }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: String(item.ratio || 1) }}>
      {item.image?.src ? (
        <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width:768px) 50vw, 25vw" placeholder={item.image.blur ? "blur" : "empty"} blurDataURL={item.image.blur} className="object-cover" />
      ) : (
        <Media img={null} seed={i} label={item.caption ?? item.eventTitle} />
      )}
    </div>
  );
}

/** Masonry grid (CSS columns) + lightbox with shared-element transition, swipe and keyboard nav. */
export default function MasonryLightbox({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => { setOpen(null); lastFocus.current?.focus(); }, []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab") { e.preventDefault(); closeBtn.current?.focus(); } // simple focus trap
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [open, close, step]);

  const onDrag = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) step(1);
    else if (info.offset.x > 60) step(-1);
    else if (info.offset.y > 120) close();
  };

  const cur = open !== null ? items[open] : null;
  if (!items.length) return <p className="text-muted">No photos match these filters yet.</p>;

  return (
    <LayoutGroup>
      <ul className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>li]:mb-3">
        {items.map((it, i) => (
          <li key={it.id} className="break-inside-avoid">
            <motion.button
              layoutId={reduce ? undefined : `g-${it.id}`}
              onClick={(e) => { lastFocus.current = e.currentTarget; setOpen(i); }}
              className="group relative block w-full overflow-hidden rounded-xl border border-line text-left"
              aria-label={`Open ${it.kind}: ${it.image?.alt || it.caption || it.eventTitle || "gallery item"}`}
            >
              <Tile item={it} i={i} />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 transition group-hover:opacity-100" />
              {it.kind === "video" && <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red/90"><Icon name="play" /></span>}
              {it.eventTitle && <span className="absolute bottom-2 left-3 text-xs font-semibold opacity-0 transition group-hover:opacity-100">{it.eventTitle}</span>}
            </motion.button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {cur && open !== null && (
          <motion.div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
            <motion.div
              layoutId={reduce ? undefined : `g-${cur.id}`}
              drag
              dragSnapToOrigin
              onDragEnd={onDrag}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl"
              style={{ aspectRatio: String(cur.ratio || 1), maxHeight: "80vh" }}
            >
              {cur.kind === "video" && cur.videoUrl ? (
                <video src={cur.videoUrl} controls autoPlay className="h-full w-full bg-black object-contain" poster={cur.image?.src} />
              ) : cur.image?.src ? (
                <Image src={cur.image.src} alt={cur.image.alt} fill sizes="100vw" className="object-contain" priority />
              ) : (
                <Media img={null} seed={open} label={cur.caption} />
              )}
            </motion.div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/80" aria-live="polite">
              {cur.image?.alt || cur.caption || cur.eventTitle} · {open + 1}/{items.length}
            </p>
            <button ref={closeBtn} onClick={close} aria-label="Close viewer" className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Icon name="close" /></button>
            <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous" className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:grid"><Icon name="chevL" /></button>
            <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next" className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:grid"><Icon name="chevR" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
