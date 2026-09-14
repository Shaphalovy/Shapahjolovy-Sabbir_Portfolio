-- =====================================================================
-- Portfolio CMS — initial schema
-- Run this once in your Supabase project's SQL Editor (or via the CLI:
-- `supabase db push`). Safe to re-run: guarded with IF NOT EXISTS /
-- ON CONFLICT where it matters.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profile — singleton "about me" + contact record
-- ---------------------------------------------------------------------
create table if not exists public.profile (
  id uuid primary key default '00000000-0000-0000-0000-000000000001',
  full_name text not null default '',
  headline text not null default '',
  bio text not null default '',
  avatar_url text,
  location text,
  years_experience integer,
  email text,
  phone text,
  resume_url text,
  resume_updated_at timestamptz,
  meta_title text,
  meta_description text,
  updated_at timestamptz not null default now()
);

insert into public.profile (id) values ('00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- socials
-- ---------------------------------------------------------------------
create table if not exists public.socials (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon text not null default 'globe',
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  category text not null default 'General',
  tech_stack text[] not null default '{}',
  cover_image_url text,
  images text[] not null default '{}',
  demo_video_url text,
  docs_url text,
  github_url text,
  live_url text,
  featured boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published')),
  project_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_sort_idx on public.projects (sort_order);

-- ---------------------------------------------------------------------
-- experience — work history
-- ---------------------------------------------------------------------
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  company_url text,
  logo_url text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  responsibilities text[] not null default '{}',
  achievements text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- skills
-- ---------------------------------------------------------------------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'General',
  proficiency integer not null default 80 check (proficiency between 0 and 100),
  icon_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- certifications
-- ---------------------------------------------------------------------
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuing_organization text not null,
  issue_date date,
  expiry_date date,
  credential_url text,
  file_url text,
  file_type text check (file_type in ('image', 'pdf')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- blog_posts (optional section)
-- ---------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on public.blog_posts (published);

-- ---------------------------------------------------------------------
-- sections — controls homepage section order + visibility
-- ---------------------------------------------------------------------
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  visible boolean not null default true,
  sort_order integer not null default 0
);

insert into public.sections (key, label, sort_order) values
  ('hero', 'Hero', 0),
  ('about', 'About', 1),
  ('projects', 'Projects', 2),
  ('experience', 'Experience', 3),
  ('skills', 'Skills', 4),
  ('certifications', 'Certifications', 5),
  ('blog', 'Blog', 6),
  ('contact', 'Contact', 7)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------
-- messages — contact form inbox
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Row Level Security
-- Public (anon) can read published content. Only an authenticated user
-- (you — create one admin account in Supabase Auth, no public sign-up
-- exists anywhere in this app) can write, and can also read drafts.
-- =====================================================================

alter table public.profile enable row level security;
alter table public.socials enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.certifications enable row level security;
alter table public.blog_posts enable row level security;
alter table public.sections enable row level security;
alter table public.messages enable row level security;

-- profile: public read, authenticated write
drop policy if exists "profile_public_read" on public.profile;
create policy "profile_public_read" on public.profile for select using (true);
drop policy if exists "profile_auth_write" on public.profile;
create policy "profile_auth_write" on public.profile for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- socials: public reads visible rows, authenticated reads/writes everything
drop policy if exists "socials_public_read" on public.socials;
create policy "socials_public_read" on public.socials for select
  using (visible = true or auth.uid() is not null);
drop policy if exists "socials_auth_write" on public.socials;
create policy "socials_auth_write" on public.socials for insert
  with check (auth.uid() is not null);
drop policy if exists "socials_auth_update" on public.socials;
create policy "socials_auth_update" on public.socials for update
  using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "socials_auth_delete" on public.socials;
create policy "socials_auth_delete" on public.socials for delete
  using (auth.uid() is not null);

-- projects: public reads published, authenticated reads/writes everything
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects for select
  using (status = 'published' or auth.uid() is not null);
drop policy if exists "projects_auth_write" on public.projects;
create policy "projects_auth_write" on public.projects for insert
  with check (auth.uid() is not null);
drop policy if exists "projects_auth_update" on public.projects;
create policy "projects_auth_update" on public.projects for update
  using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "projects_auth_delete" on public.projects;
create policy "projects_auth_delete" on public.projects for delete
  using (auth.uid() is not null);

-- experience, skills, certifications: public read all, authenticated write
drop policy if exists "experience_public_read" on public.experience;
create policy "experience_public_read" on public.experience for select using (true);
drop policy if exists "experience_auth_write" on public.experience;
create policy "experience_auth_write" on public.experience for insert with check (auth.uid() is not null);
drop policy if exists "experience_auth_update" on public.experience;
create policy "experience_auth_update" on public.experience for update using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "experience_auth_delete" on public.experience;
create policy "experience_auth_delete" on public.experience for delete using (auth.uid() is not null);

drop policy if exists "skills_public_read" on public.skills;
create policy "skills_public_read" on public.skills for select using (true);
drop policy if exists "skills_auth_write" on public.skills;
create policy "skills_auth_write" on public.skills for insert with check (auth.uid() is not null);
drop policy if exists "skills_auth_update" on public.skills;
create policy "skills_auth_update" on public.skills for update using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "skills_auth_delete" on public.skills;
create policy "skills_auth_delete" on public.skills for delete using (auth.uid() is not null);

drop policy if exists "certifications_public_read" on public.certifications;
create policy "certifications_public_read" on public.certifications for select using (true);
drop policy if exists "certifications_auth_write" on public.certifications;
create policy "certifications_auth_write" on public.certifications for insert with check (auth.uid() is not null);
drop policy if exists "certifications_auth_update" on public.certifications;
create policy "certifications_auth_update" on public.certifications for update using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "certifications_auth_delete" on public.certifications;
create policy "certifications_auth_delete" on public.certifications for delete using (auth.uid() is not null);

-- blog_posts: public reads published, authenticated reads/writes everything
drop policy if exists "blog_public_read" on public.blog_posts;
create policy "blog_public_read" on public.blog_posts for select
  using (published = true or auth.uid() is not null);
drop policy if exists "blog_auth_write" on public.blog_posts;
create policy "blog_auth_write" on public.blog_posts for insert with check (auth.uid() is not null);
drop policy if exists "blog_auth_update" on public.blog_posts;
create policy "blog_auth_update" on public.blog_posts for update using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "blog_auth_delete" on public.blog_posts;
create policy "blog_auth_delete" on public.blog_posts for delete using (auth.uid() is not null);

-- sections: public reads visible, authenticated reads/writes everything
drop policy if exists "sections_public_read" on public.sections;
create policy "sections_public_read" on public.sections for select
  using (visible = true or auth.uid() is not null);
drop policy if exists "sections_auth_update" on public.sections;
create policy "sections_auth_update" on public.sections for update
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- messages: anyone can submit (insert), only authenticated can read/manage
drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert" on public.messages for insert with check (true);
drop policy if exists "messages_auth_read" on public.messages;
create policy "messages_auth_read" on public.messages for select using (auth.uid() is not null);
drop policy if exists "messages_auth_update" on public.messages;
create policy "messages_auth_update" on public.messages for update using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "messages_auth_delete" on public.messages;
create policy "messages_auth_delete" on public.messages for delete using (auth.uid() is not null);

-- =====================================================================
-- Storage — one public bucket for every upload (screenshots, videos,
-- resume, certificates, icons). Public read, authenticated write.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media_auth_insert" on storage.objects;
create policy "media_auth_insert" on storage.objects for insert
  with check (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists "media_auth_update" on storage.objects;
create policy "media_auth_update" on storage.objects for update
  using (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists "media_auth_delete" on storage.objects;
create policy "media_auth_delete" on storage.objects for delete
  using (bucket_id = 'media' and auth.uid() is not null);
