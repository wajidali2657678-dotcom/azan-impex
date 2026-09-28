-- AZAN IMPEX — run once in Supabase > SQL Editor
create extension if not exists pgcrypto;
create table if not exists products(
 id uuid primary key default gen_random_uuid(), sku text unique not null, name text not null,
 category text[] not null default '{}', product_type text, fabric text, gsm text, description text,
 sizes jsonb not null default '[]', stock_by_size jsonb not null default '{}', main_image text,
 images jsonb not null default '[]', videos jsonb not null default '[]', customization jsonb not null default '{}',
 active boolean not null default true, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists orders(
 id uuid primary key default gen_random_uuid(), order_no text unique not null, customer_name text not null,
 company text, email text not null, phone text not null, address text, notes text, items jsonb not null,
 status text not null default 'Received', notified boolean not null default false,
 created_at timestamptz default now(), updated_at timestamptz default now());
alter table orders add column if not exists notified boolean not null default false;

create or replace function is_admin() returns boolean language sql stable as
$$ select coalesce(auth.jwt()->>'email','')='wajidali2657678@gmail.com' $$;

alter table products enable row level security;
alter table orders enable row level security;
drop policy if exists "public active products" on products;
drop policy if exists "admin products" on products;
drop policy if exists "admin orders" on orders;
create policy "public active products" on products for select using (active=true);
create policy "admin products" on products for all using (is_admin()) with check (is_admin());
create policy "admin orders" on orders for all using (is_admin()) with check (is_admin());

-- Customers place orders ONLY through this function: validates size-wise stock and deducts it atomically.
create or replace function place_order(cust jsonb, items jsonb) returns text
language plpgsql security definer set search_path=public as $$
declare it jsonb; sz text; q int; p products;
 n text := 'AZ-'||to_char(now(),'YYMMDD')||'-'||upper(substr(gen_random_uuid()::text,1,5));
begin
 if coalesce(cust->>'name','')='' or coalesce(cust->>'phone','')='' or coalesce(cust->>'email','')='' then raise exception 'Missing customer details'; end if;
 if jsonb_array_length(items)=0 then raise exception 'Empty order'; end if;
 for it in select * from jsonb_array_elements(items) loop
  select * into p from products where sku=it->>'sku' and active for update;
  if not found then raise exception 'Product % is unavailable', it->>'sku'; end if;
  for sz,q in select key, value::int from jsonb_each_text(it->'qty') loop
   if q<=0 then continue; end if;
   if coalesce((p.stock_by_size->>sz)::int,0)<q then raise exception 'Not enough stock: % size %', p.sku, sz; end if;
   update products set stock_by_size=jsonb_set(stock_by_size,array[sz],to_jsonb(coalesce((stock_by_size->>sz)::int,0)-q)),updated_at=now() where id=p.id;
   select * into p from products where id=p.id;
  end loop;
 end loop;
 insert into orders(order_no,customer_name,company,email,phone,address,notes,items)
 values(n,cust->>'name',cust->>'company',cust->>'email',cust->>'phone',cust->>'address',cust->>'notes',items);
 return n;
end $$;
grant execute on function place_order(jsonb,jsonb) to anon, authenticated;

-- Public bucket for product images/videos; only admin can upload/delete.
insert into storage.buckets(id,name,public) values('media','media',true) on conflict do nothing;
drop policy if exists "media read" on storage.objects; drop policy if exists "media admin" on storage.objects;
create policy "media read" on storage.objects for select using (bucket_id='media');
create policy "media admin" on storage.objects for all using (bucket_id='media' and is_admin()) with check (bucket_id='media' and is_admin());
