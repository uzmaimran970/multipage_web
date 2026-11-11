-- Supabase Dashboard > SQL Editor me poora paste karke RUN karein
create table if not exists messages(
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, phone text,
  message text not null, status text not null default 'new',
  created_at timestamptz not null default now());
create table if not exists courses(
  id uuid primary key default gen_random_uuid(),
  title text not null, category text, description text,
  price numeric not null default 0, image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now());
alter table messages enable row level security;
alter table courses enable row level security;
-- Visitor sirf message BHEJ sakta hai, parh nahi sakta
create policy "visitor can send message" on messages for insert to anon, authenticated with check (true);
-- Sirf login admin messages parh/update/delete kar sakta hai
create policy "admin read messages" on messages for select to authenticated using (true);
create policy "admin update messages" on messages for update to authenticated using (true) with check (true);
create policy "admin delete messages" on messages for delete to authenticated using (true);
-- Courses: visitor sirf published dekhe, admin sab kuch manage kare
create policy "public sees published courses" on courses for select to anon using (published);
create policy "admin manages courses" on courses for all to authenticated using (true) with check (true);
