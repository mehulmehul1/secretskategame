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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  location geometry(Point, 4326) NOT NULL,
  last_updated timestamptz DEFAULT now(),
  is_visible boolean DEFAULT true
);

-- Create index for user_id in user_locations
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);

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

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

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

CREATE POLICY "Users can insert own location"
  ON user_locations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update user_profiles updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();