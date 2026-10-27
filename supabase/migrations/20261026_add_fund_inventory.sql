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
