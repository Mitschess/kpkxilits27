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
