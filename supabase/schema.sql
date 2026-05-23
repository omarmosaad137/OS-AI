-- OS Legal CRM + AI production starter schema
-- Optional. The current demo runs locally in the browser.
-- For production, use Supabase Auth instead of storing passwords in localStorage.

create extension if not exists pgcrypto;

create table if not exists public.firm_snapshots (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null unique,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.firm_snapshots enable row level security;

drop policy if exists "Users can read own firm snapshot" on public.firm_snapshots;
create policy "Users can read own firm snapshot"
on public.firm_snapshots for select
using (auth.uid() = owner_id);

drop policy if exists "Users can insert own firm snapshot" on public.firm_snapshots;
create policy "Users can insert own firm snapshot"
on public.firm_snapshots for insert
with check (auth.uid() = owner_id);

drop policy if exists "Users can update own firm snapshot" on public.firm_snapshots;
create policy "Users can update own firm snapshot"
on public.firm_snapshots for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);
