-- =====================================================================
-- KPK × Ini Lho ITS! 2026 — database schema for Supabase
-- Includes the /fund inventory schema as well as the existing web tables.
--
-- How to use: Supabase dashboard → SQL Editor → New query → paste this
-- whole file → Run. Safe to run again (it only creates what's missing
-- and replaces the policies/functions).
-- If this web schema is already installed, run only
-- supabase/migrations/20261026_add_fund_inventory.sql to add Fund, then
-- supabase/migrations/20261030_add_merch_stock.sql for /merch stock.
-- Those migrations do not drop tables or delete existing rows.
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


-- ---------------------------------------------------------------------
-- Dana Usaha /fund — inventory products and stock movements
-- ---------------------------------------------------------------------
-- Additive migration for an existing Supabase project.
-- Run this file by itself in the Supabase Dashboard SQL Editor; it adds the
-- Fund inventory tables, functions, RLS policies, grants, and Realtime sync.
-- It does not drop tables or delete existing rows.
-- Run once in the Supabase Dashboard SQL Editor.
-- Inventory rows are scoped to the signed-in user; no service-role key is used by the app.

create table if not exists public.inventory_products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 140),
  sku text not null check (length(trim(sku)) between 1 and 100),
  category text not null default 'Umum',
  price numeric(12, 2) not null default 0 check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  min_stock integer not null default 0 check (min_stock >= 0),
  color text not null default 'new',
  emoji text not null default '📦',
  is_sample boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists inventory_products_owner_sku_unique
  on public.inventory_products (owner_id, lower(sku));
create index if not exists inventory_products_owner_sort_idx
  on public.inventory_products (owner_id, sort_order);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid references public.inventory_products (id) on delete set null,
  product_name text not null,
  product_sku text not null,
  type text not null check (type in ('sale', 'restock')),
  qty integer not null check (qty > 0),
  unit_price numeric(12, 2),
  note text not null default '',
  date timestamptz not null default now()
);

create index if not exists inventory_movements_owner_date_idx
  on public.inventory_movements (owner_id, date desc);

alter table public.inventory_products enable row level security;
alter table public.inventory_movements enable row level security;

do $policies$
begin
  if not exists (select 1 from pg_catalog.pg_policies where schemaname = 'public' and tablename = 'inventory_products' and policyname = 'inventory_products_select_own') then
    execute 'create policy inventory_products_select_own on public.inventory_products for select to authenticated using ((select auth.uid()) = owner_id)';
  end if;
  if not exists (select 1 from pg_catalog.pg_policies where schemaname = 'public' and tablename = 'inventory_products' and policyname = 'inventory_products_update_own') then
    execute 'create policy inventory_products_update_own on public.inventory_products for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id)';
  end if;
  if not exists (select 1 from pg_catalog.pg_policies where schemaname = 'public' and tablename = 'inventory_products' and policyname = 'inventory_products_delete_own') then
    execute 'create policy inventory_products_delete_own on public.inventory_products for delete to authenticated using ((select auth.uid()) = owner_id)';
  end if;
  if not exists (select 1 from pg_catalog.pg_policies where schemaname = 'public' and tablename = 'inventory_movements' and policyname = 'inventory_movements_select_own') then
    execute 'create policy inventory_movements_select_own on public.inventory_movements for select to authenticated using ((select auth.uid()) = owner_id)';
  end if;
end;
$policies$;

revoke all on table public.inventory_products from anon, authenticated;
revoke all on table public.inventory_movements from anon, authenticated;
grant select, delete on table public.inventory_products to authenticated;
grant update (name, sku, category, price, min_stock) on table public.inventory_products to authenticated;
grant select on table public.inventory_movements to authenticated;

create or replace function public.create_inventory_product(
  p_name text,
  p_sku text,
  p_category text,
  p_price numeric,
  p_stock integer,
  p_min_stock integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_owner_id uuid := auth.uid();
  v_product_id uuid := gen_random_uuid();
begin
  if v_owner_id is null then
    raise exception 'Login diperlukan.' using errcode = '42501';
  end if;
  if p_name is null or length(trim(p_name)) not between 1 and 140 then
    raise exception 'Nama barang tidak valid.' using errcode = '22023';
  end if;
  if p_sku is null or length(trim(p_sku)) not between 1 and 100 then
    raise exception 'SKU / barcode tidak valid.' using errcode = '22023';
  end if;
  if p_price is null or p_price < 0 or p_stock is null or p_stock < 0 or p_min_stock is null or p_min_stock < 0 then
    raise exception 'Harga atau jumlah stok tidak valid.' using errcode = '22023';
  end if;

  insert into public.inventory_products (id, owner_id, name, sku, category, price, stock, min_stock)
  values (v_product_id, v_owner_id, trim(p_name), trim(p_sku), coalesce(nullif(trim(p_category), ''), 'Umum'), p_price, p_stock, p_min_stock);

  if p_stock > 0 then
    insert into public.inventory_movements (owner_id, product_id, product_name, product_sku, type, qty, note)
    values (v_owner_id, v_product_id, trim(p_name), trim(p_sku), 'restock', p_stock, 'Stok awal');
  end if;
  return v_product_id;
end;
$function$;

create or replace function public.record_inventory_movement(
  p_product_id uuid,
  p_type text,
  p_qty integer,
  p_note text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_owner_id uuid := auth.uid();
  v_product public.inventory_products%rowtype;
  v_movement_id uuid := gen_random_uuid();
begin
  if v_owner_id is null then
    raise exception 'Login diperlukan.' using errcode = '42501';
  end if;
  if p_type is null or p_type not in ('sale', 'restock') or p_qty is null or p_qty < 1 then
    raise exception 'Jenis pergerakan atau jumlah stok tidak valid.' using errcode = '22023';
  end if;

  select * into v_product
  from public.inventory_products
  where id = p_product_id and owner_id = v_owner_id
  for update;
  if not found then
    raise exception 'Barang tidak ditemukan pada akun ini.' using errcode = 'P0002';
  end if;
  if p_type = 'sale' and p_qty > v_product.stock then
    raise exception 'Stok % tinggal % unit.', v_product.name, v_product.stock using errcode = 'P0001';
  end if;

  update public.inventory_products
  set stock = case when p_type = 'sale' then stock - p_qty else stock + p_qty end
  where id = v_product.id;

  insert into public.inventory_movements (id, owner_id, product_id, product_name, product_sku, type, qty, unit_price, note)
  values (
    v_movement_id, v_owner_id, v_product.id, v_product.name, v_product.sku, p_type, p_qty,
    case when p_type = 'sale' then v_product.price else null end,
    left(trim(coalesce(p_note, '')), 200)
  );
  return v_movement_id;
end;
$function$;

revoke all on function public.create_inventory_product(text, text, text, numeric, integer, integer) from public, anon;
revoke all on function public.record_inventory_movement(uuid, text, integer, text) from public, anon;
grant execute on function public.create_inventory_product(text, text, text, numeric, integer, integer) to authenticated;
grant execute on function public.record_inventory_movement(uuid, text, integer, text) to authenticated;

-- Enable live sync when Supabase Realtime is available in this project.
do $block$
begin
  if exists (select 1 from pg_catalog.pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_catalog.pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'inventory_products') then
      execute 'alter publication supabase_realtime add table public.inventory_products';
    end if;
    if not exists (select 1 from pg_catalog.pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'inventory_movements') then
      execute 'alter publication supabase_realtime add table public.inventory_movements';
    end if;
  end if;
end;
$block$;


-- ---------------------------------------------------------------------
-- Stok merch (/merch) — read from the /fund inventory
-- ---------------------------------------------------------------------
-- Additive migration: run this file by itself in the Supabase SQL Editor.
-- It does not drop tables or delete existing rows.
--
-- Fund inventory is private per account, so the website cannot read it
-- directly. get_merch_stock() hands the site only SKU + stock, and only
-- for the one Fund account chosen as the merch store. Merch items match
-- Fund products by SKU: MERCH-001, MERCH-002, … (the "No." on each ticket).
-- A merch item with no matching product shows as out of stock.
--
-- After running it, choose the merch store account (replace the email):
--   insert into public.merch_store (owner_id)
--   select id from auth.users where email = 'akun-fund@contoh.com'
--   on conflict (singleton) do update set owner_id = excluded.owner_id;

create table if not exists public.merch_store (
  singleton boolean primary key default true check (singleton),
  owner_id  uuid not null references auth.users (id) on delete cascade
);

-- No policies: only the SQL Editor can read or change the chosen account.
alter table public.merch_store enable row level security;
revoke all on table public.merch_store from anon, authenticated;

create or replace function public.get_merch_stock()
returns table (sku text, stock integer)
language sql
stable
security definer
set search_path = ''
as $function$
  select upper(trim(p.sku)), p.stock
  from public.inventory_products p
  join public.merch_store s on s.owner_id = p.owner_id
  where upper(trim(p.sku)) like 'MERCH-%';
$function$;

revoke all on function public.get_merch_stock() from public;
grant execute on function public.get_merch_stock() to anon, authenticated;
