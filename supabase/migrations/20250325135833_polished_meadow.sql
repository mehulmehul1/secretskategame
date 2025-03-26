/*
  # Create games table

  1. New Tables
    - `public.games`
      - `id` (uuid, primary key)
      - `type` (text, SKATE or Best Trick)
      - `challenger_id` (uuid, references profiles)
      - `opponent_id` (uuid, references profiles)
      - `status` (text)
      - `wager` (integer)
      - `time_limit` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `winner_id` (uuid, references profiles)

  2. Security
    - Enable RLS on games table
    - Add policies for authenticated users
*/

create type game_type as enum ('SKATE', 'Best Trick');
create type game_status as enum ('pending', 'active', 'completed');

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  type game_type not null,
  challenger_id uuid references public.profiles(id) not null,
  opponent_id uuid references public.profiles(id) not null,
  status game_status default 'pending',
  wager integer default 0,
  time_limit integer default 60,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  winner_id uuid references public.profiles(id),
  constraint different_players check (challenger_id != opponent_id)
);

alter table public.games enable row level security;

-- Create policies
create policy "Games are viewable by participants"
  on games for select
  using (
    auth.uid() = challenger_id or
    auth.uid() = opponent_id
  );

create policy "Users can create games"
  on games for insert
  with check (auth.uid() = challenger_id);

create policy "Participants can update games"
  on games for update
  using (
    auth.uid() = challenger_id or
    auth.uid() = opponent_id
  );