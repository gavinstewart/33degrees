@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Thirty Three Degrees" — a band website with a Supabase-backed content admin, built with Next.js 16 (App Router, TypeScript). The public site (shows, gallery, merch, news, band bios) reads from Postgres; a logged-in admin at `/admin` edits all of it through plain HTML forms and Server Actions. No ORM, no Tailwind — hand-written CSS and hand-written Supabase queries throughout.

## Commands

```
npm install       # install deps
npm run dev       # start dev server (http://localhost:3000)
npm run build     # production build — also the fastest way to type-check the whole project
npm run start     # run the production build
npm run lint      # next lint
```

There is no test suite configured.

### Database setup (required before the app will run)

The app requires a Supabase project — there's no local DB fallback.

1. Create a Supabase project.
2. Run `supabase/migration.sql` in the Supabase SQL Editor. It creates all tables, RLS policies, the `media` Storage bucket + policies, and seeds placeholder content (including the 3 real band members and 5 gallery photos pointing at bundled files under `public/seed/`).
3. Create at least one user under Supabase Auth → Users (email/password) — this is the admin login. There is no public sign-up; any authenticated user is treated as a full admin (see RLS policies in the migration).
4. Copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project settings.

If you change the schema, `supabase/migration.sql` and `lib/types.ts` must be updated together by hand — there's no codegen keeping them in sync.

## Architecture

### Data model

Six Supabase Postgres tables, all defined in `supabase/migration.sql`: `shows`, `gallery_items`, `merch_items`, `news_posts`, `band_members`, and a singleton `site_settings` row (id is always `1`) for band-wide identity (name, tagline, kicker, logo, social/booking links). RLS: the `anon` role can only `select`; any `authenticated` user can do everything. TypeScript row types live in `lib/types.ts` and must match the SQL by hand.

`lib/data.ts` is the single place that queries these tables for reading — both the public site and the admin list pages call into it (e.g. `getUpcomingShows()` vs `getAllShows()` for the two different show-list needs).

### Two Supabase clients

- `lib/supabase/server.ts` — cookie-based client for Server Components and Server Actions (via `@supabase/ssr` + `next/headers`). This is what nearly everything uses.
- `lib/supabase/client.ts` — browser client, used only by the login form and the sign-out button, which need to call `supabase.auth.*` directly from client components.

`proxy.ts` (Next.js 16's renamed `middleware.ts` file convention — see `AGENTS.md`) refreshes the session cookie on every `/admin/*` request and redirects to `/admin/login` when there's no user (matcher is `/admin/:path*`).

### Public site (`app/page.tsx`)

A single Server Component with `revalidate = 0` (always dynamic — this is a CMS, not a static build). It fetches all six data sources in parallel and renders presentational components from `app/components/site/*` (Nav, Hero, Marquee, ShowsList, Gallery, News, Band, Merch, Footer). The shopping cart (`CartProvider.tsx` + `MerchCart.tsx`) is client-side only, in-memory, no persistence — "Checkout" intentionally just reveals a note that a real payment processor isn't wired up; don't build one without being asked.

Gallery videos can be either an uploaded file or a pasted YouTube/Vimeo URL — `lib/format.ts` (`isYoutubeOrVimeo` / `toEmbedUrl`) decides whether `Gallery.tsx` renders an `<iframe>` embed or a plain `<video>` tag.

`lib/format.ts`'s date helpers parse `'YYYY-MM-DD'` as a local calendar date deliberately (not `new Date(string)`) to avoid off-by-one-day bugs from timezone shifting — follow that pattern for any new date handling.

### Admin (`app/admin/`)

`app/admin/login/` is a plain route (no sidebar). Everything else lives under the `app/admin/(protected)/` route group, whose `layout.tsx` renders the sidebar shell — the route group segment doesn't appear in the URL, it just lets `/admin/login` opt out of the sidebar while `proxy.ts`'s matcher still covers both.

Every content section (`shows/`, `gallery/`, `merch/`, `news/`, `band/`) follows the same pattern — `shows/` is the simplest representative example:
- `page.tsx` is a Server Component: fetches all rows, renders an "add new" `<form action={createX}>`, then one `<form action={updateX}>` per existing row (pre-filled, with a hidden `id` field) plus a small separate `<form action={deleteX}>`. No client-side state — every row is always in "edit mode".
- `actions.ts` has the three `'use server'` functions (`createX`/`updateX`/`deleteX`), each reading fields off `FormData` (helpers in `lib/form.ts`: `str`, `strOrNull`, `numOrNull`, `listOrNull` for comma-separated arrays like merch sizes), then calling `revalidatePath('/')` + the admin section path so both the public site and the admin list refresh immediately.

`gallery/`, `merch/`, `band/`, and `settings/` (for the logo) additionally accept a file upload (`encType="multipart/form-data"`) alongside a plain URL text field — `lib/storage.ts`'s `uploadMedia(file, folder)` uploads to the public `media` Storage bucket (under `gallery/`, `merch/`, `band/`, or `settings/` prefixes) and returns the public URL; if no new file is uploaded on an edit, a hidden `existing_*_url` field preserves the current value. `settings/` is the odd one out: a single form updating the one `site_settings` row (no create/delete).

### Styling

`app/globals.css` holds the entire design system as plain CSS custom properties, derived from the band's logo (a hand-drawn black brush-stroke "33°" mark on a warm gold/amber sunburst): warm amber/gold/black as the dominant palette, cream/paper neutrals instead of cold grey, one restrained cool teal accent used sparingly. Fonts (loaded via `next/font/google` in `app/layout.tsx`): Anton for bold section headers, Caveat for the hero kicker/tagline (brush-script accent matching the logo), Inter for body/UI/admin forms. There's no Tailwind and no CSS-in-JS; new UI should reuse the existing class names/tokens rather than introducing another styling approach.

### Seed images

`public/seed/` holds 6 real band photos downloaded from the band's previous site (`thirtythreedegreesband.com`) and bundled directly into the repo — the migration's seed data references them as local `/seed/*.jpg` paths so the site has no runtime dependency on that old site staying up. Once real content is added through the admin (which uploads to Supabase Storage instead), these can be replaced/removed at your discretion.
