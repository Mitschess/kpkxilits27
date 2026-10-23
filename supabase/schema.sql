-- =====================================================================
-- KPK × Ini Lho ITS! 2026 — database schema for Supabase
--
-- How to use: Supabase dashboard → SQL Editor → New query → paste this
-- whole file → Run. Safe to run again (it only creates what's missing
-- and replaces the policies/functions).
--
-- The website talks to the database with the public "anon" key, which
-- anyone can read from the browser. The rules below (Row Level Security
-- + grants) are what keep the data safe:
--   * guestbook    — anyone may read and post; nobody may edit/delete
--                    from the site. Lengths and colours are checked here,
--                    and each device may post at most 2 messages a day
--                    (a day = a calendar day in WIB, reset at midnight).
--   * participants — read-only for the site; fill it in from the
--                    dashboard (Table Editor or CSV import).
-- =====================================================================


-- ---------------------------------------------------------------------
-- Buku Tamu (/guestbook)
-- ---------------------------------------------------------------------
create table if not exists public.guestbook (
  id          bigint generated always as identity primary key,
  name        text        not null check (char_length(btrim(name)) between 1 and 20),
  message     text        not null check (char_length(btrim(message)) between 1 and 200),
  -- random id kept in the visitor's browser; used only for the daily limit
  device_id   text        not null check (char_length(device_id) between 1 and 40),
  color       text        not null check (color in ('yellow', 'pink', 'blue', 'green', 'orange', 'purple')),
  created_at  timestamptz not null default now()
);

create index if not exists guestbook_created_at_idx on public.guestbook (created_at desc);
drop index if exists public.guestbook_device_id_idx; -- replaced by the per-day one below
create index if not exists guestbook_device_day_idx on public.guestbook (device_id, created_at);

alter table public.guestbook enable row level security;

drop policy if exists "guestbook: anyone can read" on public.guestbook;
create policy "guestbook: anyone can read"
  on public.guestbook for select
  to anon, authenticated
  using (true);

drop policy if exists "guestbook: anyone can post" on public.guestbook;
create policy "guestbook: anyone can post"
  on public.guestbook for insert
  to anon, authenticated
  with check (true);

-- The site may read every column except device_id, and may only fill in
-- these four columns when posting (id and created_at are set here).
revoke all on public.guestbook from anon, authenticated;
grant select (id, name, message, color, created_at) on public.guestbook to anon, authenticated;
grant insert (name, message, device_id, color) on public.guestbook to anon, authenticated;

-- Server-side limits, so they hold even if someone skips the website:
-- at most 2 messages per device per day (WIB), and at most 30 messages a
-- minute overall. The hint tells the site which limit was hit.
create or replace function public.guestbook_limits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- midnight today in Jakarta, as a point in time
  if (
    select count(*) from public.guestbook
    where device_id = new.device_id
      and created_at >= (date_trunc('day', now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta')
  ) >= 2 then
    raise exception 'Kuota pesan hari ini sudah habis. Balik lagi besok ya!'
      using errcode = 'P0001', hint = 'daily_quota';
  end if;
  if (select count(*) from public.guestbook where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Lagi ramai banget, coba sebentar lagi ya.'
      using errcode = 'P0001', hint = 'rate_limit';
  end if;
  new.name := btrim(new.name);
  new.message := btrim(new.message);
  return new;
end;
$$;

drop trigger if exists guestbook_limits on public.guestbook;
create trigger guestbook_limits
  before insert on public.guestbook
  for each row execute function public.guestbook_limits();


-- ---------------------------------------------------------------------
-- Ranking TOSN (/ranking) — shown once SHOW_RANKING is true in RankingPage.tsx
-- ---------------------------------------------------------------------
create table if not exists public.participants (
  id            bigint generated always as identity primary key,
  nama          text    not null,
  asal_sekolah  text    not null,
  ranking       integer not null unique check (ranking > 0),
  skor          numeric not null
);

alter table public.participants enable row level security;

drop policy if exists "participants: anyone can read" on public.participants;
create policy "participants: anyone can read"
  on public.participants for select
  to anon, authenticated
  using (true);

revoke all on public.participants from anon, authenticated;
grant select on public.participants to anon, authenticated;

-- Example rows (remove the leading "--" to try it out):
-- insert into public.participants (nama, asal_sekolah, ranking, skor) values
--   ('Contoh Peserta Satu', 'SMAN 1 Gresik', 1, 98.5),
--   ('Contoh Peserta Dua',  'SMAN 1 Manyar', 2, 95),
--   ('Contoh Peserta Tiga', 'SMKN 1 Cerme',  3, 92.25);
