# Namma RCB HQ Official — Website

Fan club website for **Namma RCB HQ Official**, an independent, RCB-recognised fan club with chapters across Karnataka.

> Independent fan club, not operated by Royal Challengers Sports Pvt. Ltd. Do not add RCB's official logo, crest, kit artwork or player photos without written permission.

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Framer Motion · React Three Fiber · Sanity Studio (`/studio`) · Instagram Graph API / Behold.so · Resend · Vercel.

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
4. Load the sample content (3 chapters, 6 team members, 8 events, FAQ, milestones):
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

## 5. Deploy to Vercel

1. Push this repo to GitHub and import it at https://vercel.com/new.
2. Add every variable from `.env.example` in **Project → Settings → Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to your real domain.
3. Deploy. Vercel Analytics and the Cron job (`vercel.json`) turn on automatically.
4. **Sanity webhook** (instant updates on publish): sanity.io/manage → API → Webhooks → Create
   - URL: `https://YOUR-DOMAIN/api/revalidate`
   - Trigger on: Create, Update, Delete · Filter: leave empty
   - Projection: `{_type, "slug": slug.current}`
   - HTTP method: POST · Secret: same value as `SANITY_REVALIDATE_SECRET`
5. Add your domain to Sanity CORS origins.

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
    home/                Hero (3D), match-day strip, scroll story, Karnataka map…
    events/ gallery/ team/ about/ forms/ ui/
  content/seed.ts        Sample data (fallback + seed source)
  lib/                   Data layer, Sanity client/queries, Instagram, .ics, config
  sanity/schemas/        CMS schemas
scripts/build-seed.ts    seed.ts → NDJSON for Sanity import
```

## Signature motion (home page)

- **Intro loader** — the crest rises in with a gold flare, a 0→100 counter runs, then red curtains split open. Once per browser session.
- **Page transitions** — red and gold curtains sweep away on every navigation (`src/app/(site)/template.tsx`).
- **Hero** — full-screen fan video (`public/media/fans-hero*.mp4`, poster `fans-hero.jpg`), separate square crop for phones.
- **Trophy cabinet** — pinned section; the rotating trophy video (`public/media/trophy.mp4`) is blended with `mix-blend-mode: lighten` so its studio-black background disappears into the page. Steps through each title with a giant outlined year, ending on an IPL/WPL summary table. Titles are edited in Studio → Site settings → RCB trophy cabinet.
- To replace a video, overwrite the file in `public/media/` with the same name (H.264 MP4, no audio, `-movflags +faststart`).
- **Glory moments** — horizontal pinned reel of winning photos/videos with clip-path reveals and parallax. Upload in Studio → Site settings → Glory moments.
- **3D jersey** — the club's own fan jersey turns from front (crest) to back (#12, "the 12th man") as you scroll.
- Headings slide up from behind a mask as they enter the screen.

All of these switch to static versions for reduced-motion users.

> Only upload RCB match photos/videos the club owns or has permission to use. The jersey is the club's own design, not RCB's official kit.

## Design system

Design pass guided by [unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0.

- **Character:** loud, loyal, local. **World:** a night match at Chinnaswamy.
- Warm dark neutral ramp (`--c-black`, `--c-ink`, `--c-raised`), three text roles (`text`, `muted`, `faint`), RCB red as the one accent. Gold appears only in the trophy cabinet.
- Rich colour lives in two moments only: the fan video hero and the trophy video.
- Signature: the slanted red stroke from the hero, used before every section label (`.eyebrow`).
- No glows, gradient text, glass, grain, pulsing or hover tilt. Sentence-case labels, no trailing periods in headings.

## Performance & accessibility notes

- The hero shows a poster image first (fast LCP); the video fades in over it. Reduced-motion users get the still poster. The 3D jersey is code-split and skipped on low-end devices.
- The Karnataka map is 2.5D (SVG + CSS 3D), so it is light and keyboard/screen-reader friendly.
- `prefers-reduced-motion` disables Lenis smooth scroll, parallax, pinned scroll, 3D, marquee and tilt.
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
