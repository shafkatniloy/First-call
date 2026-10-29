-- ==============================================================================
-- VESPER RITUAL / FIRST-CALL: SUPABASE DATABASE INITIALIZATION SCRIPT
-- ==============================================================================
-- Paste this script into your Supabase project's SQL Editor (supabase.com) and click RUN.
-- This creates the persistent users and burns tables, sets up indexes for fast leaderboard
-- queries, enables Row Level Security (RLS) with public access, and populates initial seed users.

-- 1. Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  normalized_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  total_burnt INTEGER NOT NULL DEFAULT 0,
  brand_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_active TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for instant leaderboard ranking and name lookups
CREATE INDEX IF NOT EXISTS idx_users_total_burnt ON public.users (total_burnt DESC);
CREATE INDEX IF NOT EXISTS idx_users_normalized_name ON public.users (normalized_name);

-- 2. Create burns audit table
CREATE TABLE IF NOT EXISTS public.burns (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  brand_id TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  draws INTEGER NOT NULL DEFAULT 6,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_burns_user_name ON public.burns (user_name);
CREATE INDEX IF NOT EXISTS idx_burns_timestamp ON public.burns (timestamp DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.burns ENABLE ROW LEVEL SECURITY;

-- 4. Policies: Allow public read, insert, and update
DROP POLICY IF EXISTS "Allow public read access on users" ON public.users;
CREATE POLICY "Allow public read access on users" ON public.users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on users" ON public.users;
CREATE POLICY "Allow public insert on users" ON public.users
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on users" ON public.users;
CREATE POLICY "Allow public update on users" ON public.users
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read access on burns" ON public.burns;
CREATE POLICY "Allow public read access on burns" ON public.burns
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on burns" ON public.burns;
CREATE POLICY "Allow public insert on burns" ON public.burns
  FOR INSERT WITH CHECK (true);

-- 5. No seed users: the database starts completely clean for real persons.

