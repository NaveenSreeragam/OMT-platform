-- =================================================================
-- IEEE ONE MINUTE TALK PORTAL - ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

-- ENABLE RLS ON ALL TABLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- HELPER FUNCTIONS FOR ROLE CHECKING
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- -----------------------------------------------------------------
-- PROFILES POLICIES
-- -----------------------------------------------------------------
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

-- Users can update their own profile fields
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_admin())
  WITH CHECK (
    auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()) OR is_admin()
  );

-- Admin full access to profiles
CREATE POLICY "Admins full management of profiles"
  ON profiles FOR ALL
  USING (is_admin());

-- -----------------------------------------------------------------
-- SESSIONS POLICIES
-- -----------------------------------------------------------------
-- Anyone logged in can view sessions
CREATE POLICY "Authenticated users view sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

-- Admins full access to sessions
CREATE POLICY "Admins full management of sessions"
  ON sessions FOR ALL
  USING (is_admin());

-- -----------------------------------------------------------------
-- REGISTRATIONS POLICIES
-- -----------------------------------------------------------------
-- Students can view their own registrations
CREATE POLICY "Students view own registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR is_admin());

-- Students can insert registration for themselves
CREATE POLICY "Students register for sessions"
  ON registrations FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid() OR is_admin());

-- Students can cancel/withdraw their own registration
CREATE POLICY "Students update own registration status"
  ON registrations FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid() OR is_admin());

-- Admins full access to registrations
CREATE POLICY "Admins full management of registrations"
  ON registrations FOR ALL
  USING (is_admin());

-- -----------------------------------------------------------------
-- SCORES POLICIES
-- -----------------------------------------------------------------
-- Students can view only their own score
CREATE POLICY "Students view own score"
  ON scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = scores.registration_id AND r.student_id = auth.uid()
    ) OR is_admin()
  );

-- Admins full management of scores
CREATE POLICY "Admins insert scores"
  ON scores FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins update scores"
  ON scores FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins delete scores"
  ON scores FOR DELETE
  TO authenticated
  USING (is_admin());
