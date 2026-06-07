-- Run this once in your Supabase SQL editor: Dashboard → SQL Editor → New Query

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id         uuid        references auth.users(id) on delete cascade primary key,
  username   text        unique not null,
  name       text        not null,
  bio        text        not null default '',
  created_at timestamptz not null default now()
);

-- Check-ins table
create table public.checkins (
  id           uuid        default gen_random_uuid() primary key,
  user_id      uuid        references public.profiles(id) on delete cascade not null,
  created_at   timestamptz not null default now(),
  coffee_name  text        not null,
  roastery     text        not null,
  origin       text        not null default 'Unknown',
  processing   text        not null default 'washed',
  roast_level  text        not null default 'medium',
  brew_method  text        not null,
  rating       numeric(2,1) not null check (rating >= 1 and rating <= 5),
  aroma_profile text[]    not null default '{}',
  notes        text        not null default ''
);

-- Likes table
create table public.likes (
  checkin_id uuid references public.checkins(id) on delete cascade not null,
  user_id    uuid references public.profiles(id)  on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (checkin_id, user_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.checkins enable row level security;
alter table public.likes    enable row level security;

-- Profiles: everyone reads, only owner writes
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Check-ins: everyone reads, authenticated users write their own
create policy "checkins_select" on public.checkins for select using (true);
create policy "checkins_insert" on public.checkins for insert with check (auth.uid() = user_id);
create policy "checkins_update" on public.checkins for update using (auth.uid() = user_id);
create policy "checkins_delete" on public.checkins for delete using (auth.uid() = user_id);

-- Likes: everyone reads, authenticated users like/unlike
create policy "likes_select" on public.likes for select using (true);
create policy "likes_insert" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete" on public.likes for delete using (auth.uid() = user_id);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name',     split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username',  split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
