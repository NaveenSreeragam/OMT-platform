-- =================================================================
-- IEEE ONE MINUTE TALK PORTAL - COMPLETE DATABASE SCHEMA
-- =================================================================

-- 1. DROP EXISTING CONSTRAINTS AND TABLES IF RE-RUNNING
DROP VIEW IF EXISTS session_leaderboards CASCADE;
DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS session_status CASCADE;
DROP TYPE IF EXISTS registration_status CASCADE;

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE session_status AS ENUM ('upcoming', 'active', 'completed', 'archived');
CREATE TYPE registration_status AS ENUM ('registered', 'completed', 'absent', 'withdrawn', 'cancelled');

-- 3. PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL DEFAULT '',
  college TEXT NOT NULL DEFAULT 'IEEE Student Branch',
  department TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  role user_role NOT NULL DEFAULT 'student',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SESSIONS TABLE
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  session_date TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  max_participants INT NOT NULL DEFAULT 100,
  status session_status NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enforce ONLY ONE active session at any given time using Partial Unique Index
CREATE UNIQUE INDEX idx_single_active_session ON sessions (status) WHERE status = 'active';

-- 5. REGISTRATIONS TABLE
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  status registration_status NOT NULL DEFAULT 'registered',
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, session_id)
);

-- 6. SCORES TABLE
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID UNIQUE NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  communication NUMERIC(4,2) NOT NULL CHECK (communication >= 0 AND communication <= 10),
  confidence NUMERIC(4,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 10),
  content NUMERIC(4,2) NOT NULL CHECK (content >= 0 AND content <= 10),
  time_management NUMERIC(4,2) NOT NULL CHECK (time_management >= 0 AND time_management <= 10),
  total_score NUMERIC(5,2) GENERATED ALWAYS AS (communication + confidence + content + time_management) STORED,
  advisor_remarks TEXT NOT NULL DEFAULT '',
  evaluated_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. LEADERBOARD DYNAMIC VIEW
CREATE OR REPLACE VIEW session_leaderboards AS
SELECT 
  s.id AS score_id,
  r.id AS registration_id,
  r.session_id,
  r.student_id,
  p.full_name AS student_name,
  p.email AS student_email,
  p.department,
  p.college,
  r.registration_number,
  s.communication,
  s.confidence,
  s.content,
  s.time_management,
  s.total_score,
  s.advisor_remarks,
  s.created_at AS evaluated_at,
  DENSE_RANK() OVER (PARTITION BY r.session_id ORDER BY s.total_score DESC) AS rank
FROM scores s
JOIN registrations r ON s.registration_id = r.id
JOIN profiles p ON r.student_id = p.id
WHERE r.status != 'cancelled' AND r.status != 'withdrawn';

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX idx_registrations_student ON registrations(student_id);
CREATE INDEX idx_registrations_session ON registrations(session_id);
CREATE INDEX idx_scores_registration ON scores(registration_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- 9. TRIGGER FOR AUTO CREATING PROFILE ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, college, department, year, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'IEEE Student'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'college', 'IEEE Student Branch'),
    COALESCE(NEW.raw_user_meta_data->>'department', ''),
    COALESCE(NEW.raw_user_meta_data->>'year', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. FUNCTION & TRIGGER TO AUTO GENERATE REGISTRATION NUMBER (e.g. OMT-2026-001)
CREATE OR REPLACE FUNCTION public.generate_registration_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_num INT;
  year_str TEXT;
BEGIN
  SELECT TO_CHAR(NOW(), 'YYYY') INTO year_str;
  SELECT COUNT(*) + 1 INTO seq_num FROM registrations WHERE session_id = NEW.session_id;
  NEW.registration_number := 'OMT-' || year_str || '-' || LPAD(seq_num::text, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_registration_number
  BEFORE INSERT ON registrations
  FOR EACH ROW
  WHEN (NEW.registration_number IS NULL OR NEW.registration_number = '')
  EXECUTE FUNCTION public.generate_registration_number();

-- 11. TRIGGER TO AUTO UPDATE UPDATED_AT TIMESTAMP
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_sessions_modtime BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_registrations_modtime BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_scores_modtime BEFORE UPDATE ON scores FOR EACH ROW EXECUTE FUNCTION update_timestamp();
