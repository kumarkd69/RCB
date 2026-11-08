import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { ContactForm, MembershipForm } from "@/components/forms/Forms";
import Faq from "@/components/forms/Faq";
import MagneticButton from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/Icon";
import { getChapters, getFaqs, getSettings } from "@/lib/data";
import { instagramAccounts } from "@/lib/config";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Join Us", description: "Become a member of Namma RCB HQ. Free to join. Contact us for sponsorship, media and collaborations.", alternates: { canonical: "/join" } };

export default async function JoinPage() {
  const [chapters, faqs, settings] = await Promise.all([getChapters(), getFaqs(), getSettings()]);
  return (
    <>
      <PageHero eyebrow="Join us" title={<>Join the community</>} kicker="Free membership. Screenings, fan meets, away trips and a WhatsApp group in your city" />

      <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="member" className="glass rounded-[2rem] p-6 md:p-10">
          <h2 id="member" className="display mb-6 text-4xl">Membership</h2>
          <MembershipForm chapters={chapters.map((c) => [c.slug, c.name])} />
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#0f3d1f] to-black p-8">
            <Icon name="whatsapp" className="h-10 w-10 text-[#25D366]" />
            <h2 className="display mt-3 text-3xl">WhatsApp community</h2>
            <p className="mt-2 text-muted">Match-day plans, ticket alerts and screening venues, straight to your phone.</p>
            <div className="mt-5">
              {settings.whatsappLink ? <MagneticButton href={settings.whatsappLink} external variant="ghost">Join on WhatsApp</MagneticButton> : <p className="text-sm text-muted">[PLACEHOLDER] WhatsApp link coming soon.</p>}
            </div>
          </div>
          <div className="glass rounded-[2rem] p-8">
            <h2 className="display mb-4 text-3xl">Chapter contacts</h2>
            <ul className="space-y-4">
              {chapters.map((c) => {
                const acc = instagramAccounts.find((a) => a.chapterSlug === c.slug);
                const handle = c.instagram || acc?.handle;
                return (
                  <li key={c._id} className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0">
                    <div><p className="font-semibold">{c.name}</p><p className="text-sm text-muted">{c.lead?.name ?? "Lead TBA"}</p></div>
                    {handle ? <a href={`https://www.instagram.com/${handle}/`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gold hover:underline"><Icon name="instagram" className="h-4 w-4" />DM</a> : <span className="text-xs text-muted">Soon</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>

      <section id="contact" aria-labelledby="contact-h" className="container-x scroll-mt-28 pt-24">
        <SectionHeading eyebrow="Contact" title={<span id="contact-h">Contact us</span>} kicker="Sponsorships, media, collaborations or just a hello." />
        <div className="glass rounded-[2rem] p-6 md:p-10"><ContactForm /></div>
      </section>

      <section aria-labelledby="faq" className="container-x pt-24">
        <SectionHeading eyebrow="FAQ" title={<span id="faq">Questions</span>} />
        <Faq items={faqs} />
      </section>
    </>
  );
}
