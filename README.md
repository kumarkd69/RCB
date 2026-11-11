# Namma RCB HQ Official — Website

Fan club website for **Namma RCB HQ Official**, an independent, RCB-recognised fan club with chapters across Karnataka.

> Independent fan club, not operated by Royal Challengers Sports Pvt. Ltd. Do not add RCB's official logo, crest, kit artwork or player photos without written permission.

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Framer Motion · Sanity Studio (`/studio`) · Instagram Graph API / Behold.so · Resend · Vercel.

The site **runs without any keys**. With no Sanity project set, it shows built-in sample data from `src/content/seed.ts`, so you can preview and design before connecting anything.

---

## 1. Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## 2. Connect Sanity (the CMS)

1. Create a project at https://sanity.io/manage. Copy the **Project ID** into `NEXT_PUBLIC_SANITY_PROJECT_ID`.
2. In the project → **API → CORS origins**, add `http://localhost:3000` and your live domain (tick "Allow credentials").
3. In **API → Tokens**, create:
   - a **Viewer** token → `SANITY_API_READ_TOKEN`
   - an **Editor** token → `SANITY_API_WRITE_TOKEN` (used only by the Instagram cron)
4. Load the sample content into the CMS, photos included (3 chapters, 12 team members, 16 events, albums, FAQ, milestones), so members start from a filled site and just edit it:
   ```bash
   npx sanity login
   npm run seed
   ```
5. Open http://localhost:3000/studio and log in. Invite club members under **sanity.io/manage → Members** (role: Editor).

## 3. Instagram feed

Accounts must be **Business** or **Creator** accounts. Handles live in `src/lib/config.ts` (`instagramAccounts`). Belagavi's handle is `null` until confirmed.

**Option A — Instagram Graph API (recommended)**
1. Create a Meta app at https://developers.facebook.com → add **Instagram API with Instagram Login**.
2. Generate a long-lived token for each account and set `INSTAGRAM_TOKEN_MAIN`, `INSTAGRAM_TOKEN_HUBBALLI`, `INSTAGRAM_TOKEN_KOLAR` (and `..._BELAGAVI` later).
3. The feed refreshes every **1 hour** (ISR). Tokens last 60 days; the Vercel Cron at `/api/cron/refresh-instagram` runs weekly, refreshes them and stores the new tokens in a private Sanity document (`secrets.instagram`). Set `CRON_SECRET` and `SANITY_API_WRITE_TOKEN` for this to work.

**Option B — Behold.so (no Meta app)**
Create a free feed per account at https://behold.so and paste each JSON feed URL into `BEHOLD_FEED_*`. Used automatically when no token is set.

Until either is set, the site shows clearly-labelled placeholder tiles that link to each profile.

## 4. Forms (Resend)

Membership, contact and "start a chapter" forms use server actions and send email through Resend.
1. Create an API key at https://resend.com → `RESEND_API_KEY`.
2. Verify your domain in Resend, then set `FORMS_FROM_EMAIL` (e.g. `Namma RCB HQ <noreply@yourdomain.com>`).
3. `FORMS_TO_EMAIL` = inbox(es) that receive submissions (comma-separated).

In development, without keys, submissions are logged to the terminal instead.

## 5. Go live (hosting + your own domain)

**Hosting: Vercel (free).**
1. Sign up at https://vercel.com with the GitHub account that owns this repo.
2. **Add New → Project → Import** `kumarkd69/RCB` → **Deploy**. You get a free address like `rcb-xyz.vercel.app`.
3. **Settings → Environment Variables**: add the values from `.env.example` (Sanity, Instagram, Resend). Redeploy after adding them.
4. Every push to `main` redeploys automatically. The Instagram cron (`vercel.json`) and Vercel Analytics turn on by themselves.

**Custom domain (e.g. `nammarcbhq.in`).**
1. Buy the domain at any registrar (GoDaddy, Hostinger, Namecheap, Cloudflare). A `.in` domain costs roughly ₹600–900 a year.
2. Vercel → your project → **Settings → Domains** → type the domain → **Add**. Add `www.` too.
3. At the registrar, open **DNS settings** and add the two records Vercel shows, usually:
   - `A` record, name `@`, value `76.76.21.21`
   - `CNAME` record, name `www`, value `cname.vercel-dns.com`
4. Wait 10 minutes to a few hours. Vercel issues the HTTPS certificate on its own.
5. Set `NEXT_PUBLIC_SITE_URL` to `https://your-domain` in Vercel and redeploy. Add the domain to Sanity → API → **CORS origins** so `/studio` works on it.

**Email on your domain (optional).** Zoho Mail has a free plan for `hello@your-domain`. Add the MX records it gives you at the registrar. Use that address in Resend (`FORMS_FROM_EMAIL`) after verifying the domain there.

## 6. Sanity webhook (instant updates on publish)

sanity.io/manage → API → Webhooks → Create
- URL: `https://YOUR-DOMAIN/api/revalidate`
- Trigger on: Create, Update, Delete · Filter: leave empty
- Projection: `{_type, "slug": slug.current}`
- HTTP method: POST · Secret: same value as `SANITY_REVALIDATE_SECRET`

Without the webhook, changes still appear within an hour.

## Project structure

```
src/
  app/
    (site)/              Public pages: home, about, chapters, events, gallery, join
    studio/              Sanity Studio at /studio
    api/revalidate       Sanity webhook → revalidate pages
    api/cron/…           Weekly Instagram token refresh
    sitemap.ts robots.ts opengraph-image.tsx
  actions/forms.ts       Server actions (Resend)
  components/
    layout/              Nav, footer, smooth scroll + reduced-motion provider, cursor
    home/                Hero video, match-day strip, what we do, Karnataka map…
    events/ gallery/ team/ about/ forms/ ui/
  content/seed.ts        Sample data (fallback + seed source)
  lib/                   Data layer, Sanity client/queries, Instagram, .ics, config
  sanity/schemas/        CMS schemas
scripts/build-seed.ts    seed.ts → NDJSON for Sanity import
```

## Signature motion (home page)

- **Intro loader** — the crest rises in with a gold flare, a 0→100 counter runs, then red curtains split open. Once per browser session.
- **Page transitions** — red and gold curtains sweep away on every navigation (`src/app/(site)/template.tsx`).
- **Scroll-driven video hero** — the fan footage is 95 frames (`public/media/hero-frames/d` desktop, `m` phones) drawn to a canvas, so it plays forward and backward with the scroll. Three beats fade over it: Namma RCB HQ → RCB fandom is family → Connect · Give back · Play together. To replace the footage, export new frames with `ffmpeg -i video.mp4 -vf "fps=12,scale=1200:-2" -c:v libwebp -quality 45 public/media/hero-frames/d/%03d.webp` (same for `m` with a portrait crop).
- **The Namma Banner** — the club's symbol; fans' handwritten messages appear on it as you scroll (Studio → Site settings → Namma Banner messages).
- **Three pillars, six initiatives** — the 90-day plan from Studio → Initiatives (pillar, window, key points, photo), with a roll-out line that fills on scroll and the fan contests (Site settings → Fan contests).
- **Trophy cabinet** — one screen; the rotating trophy video (`public/media/trophy.mp4`) is blended with `mix-blend-mode: lighten` so its studio-black background disappears into the page. The highlighted title changes every few seconds; visitors can tap a year. Titles are edited in Studio → Site settings → RCB trophy cabinet.
- To replace a video, overwrite the file in `public/media/` with the same name (H.264 MP4, no audio, `-movflags +faststart`).
- **Glory moments** (About page) — horizontal pinned reel of winning photos/videos with clip-path reveals and parallax. Upload in Studio → Site settings → Glory moments.
- Headings slide up from behind a mask as they enter the screen.

All of these switch to static versions for reduced-motion users.

> Only upload RCB match photos/videos the club owns or has permission to use. The jersey is the club's own design, not RCB's official kit.

## Design system

Design pass guided by [unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0.

- **Character:** loud, loyal, local. **World:** a night match at Chinnaswamy.
- RCB colours only: red `#EC1C24`, gold `#CBA135`, black and white (greys are steps of black). All set in `src/app/globals.css`.
- Rich colour lives in two moments only: the fan video hero and the trophy video.
- Signature: the slanted red stroke from the hero, used before every section label (`.eyebrow`).
- No glows, gradient text, glass, grain, pulsing or hover tilt. Sentence-case labels, no trailing periods in headings.

## Performance & accessibility notes

- The hero shows a poster image first (fast LCP); the video fades in over it. Reduced-motion users get the still poster.
- The Karnataka map is 2.5D (SVG + CSS 3D), so it is light and keyboard/screen-reader friendly.
- `prefers-reduced-motion` disables Lenis smooth scroll, parallax, pinned scroll, the intro and page curtains.
- Lightbox: arrow keys, Escape, swipe; focus returns to the opened photo.
- Alt text is required on every image field in the CMS.
- Event pages include `Event` JSON-LD, Open Graph metadata and `.ics` + Google Calendar links. Events move from Upcoming to Past automatically (pages revalidate hourly).

## Sample content (replace before launch)

The site ships fully filled with **dummy content** in `src/content/seed.ts` so every page looks finished: 16 events (6 upcoming, 10 past with recaps, impact numbers and photo albums), 8 team members, 3 chapters, initiatives, milestones, FAQ, highlights and glory moments. Photos in `public/media/dummy/` are stills cut from the club's own videos. The recognition certificate is a clearly marked sample.

Everything there is invented and must be replaced with real club information, either by editing `seed.ts` or, once Sanity is connected, in Studio (which then overrides the sample data). Things to replace:
- Team names and photos, stats, founding story and milestones
- Event names, dates, venues, recaps and photos
- Recognition letter, WhatsApp link, contact email and phone
- Belagavi Instagram handle
