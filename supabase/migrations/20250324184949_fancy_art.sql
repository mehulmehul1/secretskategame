/*
  # Initial Schema Setup

  1. New Tables
    - `user_profiles`
      - Basic user information
      - Rank and XP tracking
    - `user_locations`
      - Real-time location tracking
      - Last active status
    
  2. Security
    - Enable RLS on all tables
    - Add policies for location sharing
*/

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  rank text DEFAULT 'rookie',
  xp integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Locations Table
CREATE TABLE IF NOT EXISTS user_locations (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  location geometry(Point, 4326) NOT NULL,
  last_updated timestamptz DEFAULT now(),
  is_visible boolean DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for user_locations
CREATE POLICY "Users can see active skaters"
  ON user_locations
  FOR SELECT
  TO authenticated
  USING (is_visible = true);

CREATE POLICY "Users can update own location"
  ON user_locations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);