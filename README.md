# Portfolio CMS

A premium, fully editable personal portfolio with a full CMS-style admin
panel — built with Next.js, TypeScript, Tailwind CSS, and Supabase.

Every section of the public site (hero, about, projects, experience, skills,
certifications, resume, blog, contact) is managed from `/admin` — no code
edits needed to update content.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** — dark, moody, glassmorphism design system
- **Supabase** — Postgres database, Auth, and file storage
- **Framer Motion** — animations and micro-interactions
- Hand-built shadcn/ui-style components (Radix primitives + Tailwind)

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project (the
   free tier is enough to start).
2. In the Supabase dashboard, open **SQL Editor** → **New query**, paste the
   entire contents of [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql),
   and run it. This creates every table, Row Level Security policy, and the
   `media` storage bucket used for uploads.
3. Create your admin account: go to **Authentication → Users → Add user**
   and create yourself a user with an email + password. This is the *only*
   account that will ever be able to log into `/admin` — there is no public
   sign-up anywhere in this app, by design.
4. Grab your API keys: **Project Settings → API** → copy the **Project URL**
   and the **anon public** key.

## 2. Run it locally

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with the values from step 1.4:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then:

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin) —
  log in with the account you created in step 1.3.

The database starts empty aside from some sensible defaults (a blank
profile row and the section list). Go to `/admin` and fill in **About &
contact** first — that's what powers the hero section.

## 3. Deploy

Any Next.js host works; the easiest path is Vercel:

1. Push this project to a GitHub repo.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the same three environment variables from `.env.local` in the
   Vercel project settings — set `NEXT_PUBLIC_SITE_URL` to your real domain.
4. Deploy.

## How content management works

- **Sections** (`/admin/sections`): show/hide and reorder every homepage
  section. The hero always renders first (it's your page header) but can be
  hidden; every other section can be freely reordered.
- **Projects** (`/admin/projects`): title, slug, summary, full markdown
  description, category, tech stack, cover image, a screenshot gallery,
  demo video link, docs/GitHub/live links, featured flag, draft/published
  status.
- **Experience** (`/admin/experience`): company, role, dates, responsibilities
  and achievements (one per line), rendered as a timeline.
- **Skills** (`/admin/skills`): grouped automatically by whatever category
  text you type, with a proficiency slider and optional icon upload.
- **Certifications** (`/admin/certifications`): upload the certificate as an
  image or PDF, plus issuing org, dates, and a verification link.
- **Resume** (`/admin/resume`): upload a PDF; it instantly becomes the file
  the "Download résumé" buttons link to.
- **Blog** (`/admin/blog`): optional — the homepage's "Writing" section and
  `/blog` only appear once you publish at least one post.
- **Messages** (`/admin/messages`): submissions from the public contact form.

## Important notes

- **Demo videos**: don't upload raw video files — there's nowhere to put
  them. Host them on YouTube, Vimeo, or Loom and paste the link into a
  project's "Demo video URL" field; the project page embeds it automatically.
- **Free-tier storage**: Supabase's free plan currently includes roughly
  1&nbsp;GB of file storage and a few GB of monthly bandwidth. That's plenty
  for screenshots, certificates, and a resume PDF, but keep an eye on it in
  the Supabase dashboard as your project grows.
- **Single admin, by design**: there's no public registration page. If you
  ever want a second editor, create another user in Supabase Auth — every
  authenticated user can manage content, since Row Level Security only
  distinguishes "logged in" vs "public".
- **Rendering**: public pages are dynamically rendered (not statically
  generated at build time), so content edits in `/admin` show up on refresh
  immediately — no rebuild or redeploy needed.

## Project structure

```
src/
  app/                  Routes (public site + /admin + /projects/[slug] + /blog)
  components/
    ui/                 Hand-built shadcn-style primitives
    site/               Public-facing sections (hero, projects, etc.)
    admin/              Admin forms, managers, file upload
  lib/
    actions/            Server Actions — all create/update/delete logic
    supabase/           Browser/server Supabase clients + auth middleware
    queries.ts          Server-side data fetching
    types.ts            TypeScript types mirroring the database schema
    validations.ts      Zod schemas for every form
supabase/
  migrations/0001_init.sql   Full schema, RLS policies, storage bucket
```
