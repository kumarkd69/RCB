import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryExplorer from "@/components/gallery/GalleryExplorer";
import InstagramGrid from "@/components/gallery/InstagramGrid";
import { getAlbums, getChapters } from "@/lib/data";
import { getInstagramFeed } from "@/lib/instagram";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Gallery", description: "Photos and videos from Namma RCB HQ screenings, fan meets, away trips and social drives.", alternates: { canonical: "/gallery" } };

export default async function GalleryPage() {
  const [albums, chapters, insta] = await Promise.all([getAlbums(), getChapters(), getInstagramFeed(12)]);
  return (
    <>
      <PageHero eyebrow="Gallery" title={<>Frames from the <span className="text-red">stands</span></>} kicker="Every chant, every flag, every drive. Filter by chapter, event, year or type." />
      <div className="container-x">
        <GalleryExplorer albums={albums} chapters={chapters} />
        <section id="instagram" aria-labelledby="ig" className="scroll-mt-28 pt-24">
          <SectionHeading eyebrow="Instagram" title={<span id="ig">Live from <span className="text-gradient-gold">our handles</span></span>} kicker="Auto-updated every hour from all club accounts." />
          <InstagramGrid posts={insta.posts} connected={insta.connected} limit={24} />
        </section>
      </div>
    </>
  );
}
