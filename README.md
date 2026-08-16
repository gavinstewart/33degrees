# Thirty Three Degrees

Band website for Thirty Three Degrees — a three-piece rock band from the Central Coast, NSW. A Next.js site backed by Supabase, with a full admin panel for managing shows, gallery, merch, news, band bios, site settings, and enquiries — no external CMS.

**Live site:** https://33degrees.vercel.app
**Admin:** https://33degrees.vercel.app/admin/login

## Tech stack

- **[Next.js 16](https://nextjs.org/)** (App Router, TypeScript) — React framework, Server Components + Server Actions
- **[React 19](https://react.dev/)**
- **Hand-written CSS** — no Tailwind, no CSS-in-JS (see `app/globals.css`)
- **[next/font](https://nextjs.org/docs/app/api-reference/components/font)** — Anton, Caveat, Inter (Google Fonts, self-hosted at build time)
- **[next/og](https://nextjs.org/docs/app/api-reference/functions/image-response)** — dynamically generated Open Graph / social share image (`app/opengraph-image.tsx`)

## Services used

| Service | Purpose | Link |
|---|---|---|
| **[Supabase](https://supabase.com)** | Postgres database, Auth (admin login), Storage (uploaded photos/video) | [Project dashboard](https://supabase.com/dashboard/project/okgvtulnrwbjjoehskrb) |
| **[Vercel](https://vercel.com)** | Hosting, deployments, environment variables | [Project dashboard](https://vercel.com/stewrat/33degrees) |
| **[Resend](https://resend.com)** | Transactional email — enquiry form notifications | [Dashboard](https://resend.com/emails) |
| **[GitHub](https://github.com)** | Source control, triggers auto-deploy to Vercel on push to `master` | [gavinstewart/33degrees](https://github.com/gavinstewart/33degrees) |

## Local development

```
npm install
npm run dev       # http://localhost:3000
npm run build     # production build — also the fastest way to type-check everything
npm run lint
```

Requires a `.env.local` — copy `.env.local.example` and fill in real values (see below). There's no local database fallback; Supabase is required even for local dev.

### Environment variables

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Everything | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Everything | Public anon key (safe to expose client-side) |
| `NEXT_PUBLIC_SITE_URL` | OG image / metadata | The site's real deployed URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Enquiry form | Server-only, bypasses RLS — never expose to the client |
| `RESEND_API_KEY` | Enquiry form | From resend.com → API Keys |
| `ENQUIRY_FROM_EMAIL` | Enquiry form (optional) | Defaults to Resend's shared test address; needs a [verified domain](https://resend.com/domains) to send to recipients other than the Resend account owner |

### Database setup (fresh Supabase project)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/migration.sql` in the SQL Editor — creates all tables, RLS policies, the `media` storage bucket, and seed content.
3. Create an admin user under **Authentication → Users** (email/password) — there's no public sign-up; any authenticated user is a full admin.

If the schema changes, `supabase/migration.sql` and `lib/types.ts` must be kept in sync by hand.

## Architecture

See [`CLAUDE.md`](./CLAUDE.md) for a detailed breakdown of the data model, the admin CRUD pattern, and styling conventions.
