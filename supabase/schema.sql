-- Run in Supabase SQL Editor. Review policies before production.
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_categories text[] not null default '{}',
  preferred_locations text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.job_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_url text not null unique,
  source_type text not null check (source_type in ('official_portal','career_page','rss','api','manual')),
  enabled boolean not null default true,
  terms_reviewed boolean not null default false,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.job_sources(id) on delete set null,
  source_job_id text,
  title text not null,
  employer text,
  category text,
  location text,
  description text,
  requirements text,
  application_method text check (application_method in ('email','external_site','portal','unknown')),
  hr_email text,
  application_url text,
  published_at timestamptz,
  deadline date,
  content_hash text not null unique,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.cv_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  extracted_profile jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.job_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  cv_file_id uuid references public.cv_files(id) on delete set null,
  match_score integer not null check (match_score between 0 and 100),
  match_reasons jsonb not null default '[]',
  status text not null default 'new' check (status in ('new','saved','dismissed','drafted','applied')),
  created_at timestamptz not null default now(),
  unique(user_id, job_id)
);

create table public.email_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  cv_file_id uuid references public.cv_files(id) on delete set null,
  recipient_email text not null,
  subject text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft','approved','sending','sent','failed','cancelled')),
  approved_at timestamptz,
  sent_at timestamptz,
  provider_message_id text,
  error_message text,
  created_at timestamptz not null default now(),
  unique(user_id, job_id)
);

create table public.application_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  email_draft_id uuid references public.email_drafts(id) on delete set null,
  status text not null check (status in ('pending_approval','sent','failed','external_apply')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.cv_files enable row level security;
alter table public.job_matches enable row level security;
alter table public.email_drafts enable row level security;
alter table public.application_logs enable row level security;
alter table public.jobs enable row level security;
alter table public.job_sources enable row level security;

create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "users manage own cv metadata" on public.cv_files for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own matches" on public.job_matches for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own email drafts" on public.email_drafts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users read own application logs" on public.application_logs for select using (auth.uid() = user_id);
create policy "users insert own application logs" on public.application_logs for insert with check (auth.uid() = user_id);

-- Jobs are public to authenticated users; writes should be server/admin-only.
create policy "authenticated users read jobs" on public.jobs for select to authenticated using (true);
create policy "authenticated users read sources" on public.job_sources for select to authenticated using (true);

-- Production TODO: create a private Storage bucket named `private-cvs`.
-- Storage policies must restrict every object path to the authenticated user's UUID.
-- Do not make CV objects public.
