-- Run once in a new Supabase project's SQL editor. No service-role key is used in the app.
begin;
create table public.profiles(id uuid primary key references auth.users(id) on delete cascade, full_name text not null default '', company text not null default '', status text not null default 'pending' check(status in ('pending','approved','rejected')), created_at timestamptz not null default now());
create function public.create_profile() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id) values(new.id);return new;end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.create_profile();
insert into public.profiles(id) select id from auth.users on conflict do nothing;
create function public.is_approved() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=auth.uid() and status='approved'); $$;
create table public.applications(id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade,details jsonb not null,created_at timestamptz not null default now());
create table public.product_prices(product_id text not null,min_qty integer not null check(min_qty>0),unit_price numeric(12,2) not null check(unit_price>=0),currency text not null check(currency ~ '^[A-Z]{3}$'),primary key(product_id,min_qty));
create table public.quote_requests(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,company text not null,destination text not null,notes text not null default '',lines jsonb not null check(jsonb_typeof(lines)='array' and jsonb_array_length(lines) between 1 and 100),status text not null default 'quote_requested' check(status in ('quote_requested','under_review','quoted','closed')),created_at timestamptz not null default now());
create table public.enquiries(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,details jsonb not null,created_at timestamptz not null default now());
create index quote_user_date on public.quote_requests(user_id,created_at desc);
create index enquiry_user_date on public.enquiries(user_id,created_at desc);
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.product_prices enable row level security;
alter table public.quote_requests enable row level security;
alter table public.enquiries enable row level security;
revoke all on public.profiles,public.applications,public.product_prices,public.quote_requests,public.enquiries from anon,authenticated;
grant select on public.profiles,public.applications,public.product_prices,public.quote_requests,public.enquiries to authenticated;
create policy own_profile on public.profiles for select to authenticated using(id=auth.uid());
create policy own_application on public.applications for select to authenticated using(user_id=auth.uid());
create policy private_prices on public.product_prices for select to authenticated using(public.is_approved());
create policy own_quotes on public.quote_requests for select to authenticated using(user_id=auth.uid());
create policy own_enquiries on public.enquiries for select to authenticated using(user_id=auth.uid());
-- Mutations go through narrowly-scoped functions; buyers have no direct write access.
create function public.submit_application(details jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare result uuid;begin
 if auth.uid() is null or not exists(select 1 from auth.users where id=auth.uid() and email_confirmed_at is not null) then raise exception 'Sign in with a verified email first.';end if;
 perform pg_advisory_xact_lock(hashtext(auth.uid()::text));
 if coalesce(jsonb_typeof(details),'')<>'object' or pg_column_size(details)>32000 then raise exception 'Invalid request size or format.';end if;
 if public.is_approved() then raise exception 'Your wholesale account is already approved.';end if;
 if length(coalesce(details->>'company','')) not between 2 and 160 or length(coalesce(details->>'name','')) not between 2 and 120 or length(coalesce(details->>'requirements','')) not between 10 and 3000 or coalesce(details->>'businessType','') not in ('Retailer','Reseller','Distributor','Other') then raise exception 'Invalid business details.';end if;
 if exists(select 1 from public.applications a where a.user_id=auth.uid() and a.created_at>now()-interval '10 minutes') then raise exception 'Please wait before resubmitting your application.';end if;
 insert into public.applications(user_id,details) values(auth.uid(),details) on conflict(user_id) do update set details=excluded.details,created_at=now() returning id into result;
 update public.profiles set full_name=details->>'name',company=details->>'company',status='pending' where id=auth.uid();return result;end;$$;
create function public.submit_enquiry(details jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare result uuid;begin
 if auth.uid() is null or not exists(select 1 from auth.users where id=auth.uid() and email_confirmed_at is not null) then raise exception 'Sign in with a verified email first.';end if;
 perform pg_advisory_xact_lock(hashtext(auth.uid()::text));
 if coalesce(jsonb_typeof(details),'')<>'object' or pg_column_size(details)>32000 then raise exception 'Invalid request size or format.';end if;
 if length(coalesce(details->>'name','')) not between 2 and 120 or length(coalesce(details->>'company','')) not between 2 and 160 or length(coalesce(details->>'message','')) not between 10 and 4000 then raise exception 'Invalid enquiry details.';end if;
 if (select count(*) from public.enquiries where user_id=auth.uid() and created_at>now()-interval '1 hour')>=10 then raise exception 'Enquiry limit reached. Please try again later.';end if;
 insert into public.enquiries(user_id,details) values(auth.uid(),details) returning id into result;return result;end;$$;
create function public.submit_quote(details jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare result uuid; line jsonb;begin
 if auth.uid() is null or not public.is_approved() or not exists(select 1 from auth.users where id=auth.uid() and email_confirmed_at is not null) then raise exception 'Wholesale approval is required.';end if;
 perform pg_advisory_xact_lock(hashtext(auth.uid()::text));
 if coalesce(jsonb_typeof(details),'')<>'object' or pg_column_size(details)>32000 then raise exception 'Invalid request size or format.';end if;
 if coalesce(jsonb_typeof(details->'lines'),'')<>'array' or jsonb_array_length(details->'lines') not between 1 and 100 or length(coalesce(details->>'company','')) not between 2 and 160 or length(coalesce(details->>'destination','')) not between 3 and 500 or length(coalesce(details->>'notes',''))>4000 then raise exception 'Invalid quotation details.';end if;
 for line in select * from jsonb_array_elements(details->'lines') loop
  if coalesce(line->>'productId','') not in ('EL-001','EL-002','EL-003','CA-001','CA-002','CA-003') or coalesce(line->>'quantity','') !~ '^[0-9]+$' or (line->>'quantity')::numeric not between 1 and 10000 or coalesce(jsonb_typeof(line->'sample'),'')<>'boolean' or (line->>'productId'='CA-003' and (line->>'sample')::boolean) then raise exception 'Invalid product reference or quantity.';end if;
 end loop;
 if exists(select 1 from jsonb_array_elements(details->'lines') l group by l->>'productId',l->>'sample' having count(*)>1) then raise exception 'Combine duplicate product lines.';end if;
 if (select count(*) from public.quote_requests where user_id=auth.uid() and created_at>now()-interval '1 hour')>=10 then raise exception 'Quotation request limit reached. Please try again later.';end if;
 insert into public.quote_requests(user_id,company,destination,notes,lines) values(auth.uid(),details->>'company',details->>'destination',coalesce(details->>'notes',''),details->'lines') returning id into result;return result;end;$$;
revoke all on function public.create_profile(),public.is_approved(),public.submit_application(jsonb),public.submit_enquiry(jsonb),public.submit_quote(jsonb) from public;
grant execute on function public.is_approved(),public.submit_application(jsonb),public.submit_enquiry(jsonb),public.submit_quote(jsonb) to authenticated;
commit;
-- Approval is a trusted administrative operation, never a browser capability:
-- update public.profiles set status='approved' where id='<verified buyer UUID>';
-- Add ONLY confirmed price tiers through the SQL editor / trusted administration.
-- No sample prices, claimed stock, shipping promises or fake approved buyers are seeded.
