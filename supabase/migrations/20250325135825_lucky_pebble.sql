/*
  # Create profiles table and auth schema

  1. New Tables
    - `public.profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `avatar_url` (text)
      - `skill_level` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `location` (geography(Point,4326))
      - `is_active` (boolean)
      - `last_active` (timestamptz)

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users
*/

create table if not exists public.profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  avatar_url text,
  skill_level text check (skill_level in ('Beginner', 'Intermediate', 'Advanced', 'Pro', 'Legend')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  location geography(Point,4326),
  is_active boolean default false,
  last_active timestamptz default now()
);

alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100'
  );
  return new;
end;
$$;

-- Set up trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();