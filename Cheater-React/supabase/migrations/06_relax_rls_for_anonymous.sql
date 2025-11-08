-- Relax RLS policies for anonymous users (development/MVP only)
-- This allows anonymous users to access all homework data
-- In production, you'll want stricter policies with real user auth

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own homework" ON homework;
DROP POLICY IF EXISTS "Users can insert their own homework" ON homework;
DROP POLICY IF EXISTS "Users can update their own homework" ON homework;
DROP POLICY IF EXISTS "Users can delete their own homework" ON homework;

-- Create more permissive policies for anonymous auth
CREATE POLICY "Anonymous users can view all homework"
  ON homework FOR SELECT
  USING (true);  -- Allow all users to see all homework

CREATE POLICY "Anonymous users can insert homework"
  ON homework FOR INSERT
  WITH CHECK (true);  -- Allow any authenticated user to insert

CREATE POLICY "Anonymous users can update all homework"
  ON homework FOR UPDATE
  USING (true);  -- Allow any user to update any homework

CREATE POLICY "Anonymous users can delete all homework"
  ON homework FOR DELETE
  USING (true);  -- Allow any user to delete any homework

-- Do the same for quiz table
DROP POLICY IF EXISTS "Users can view their own quizzes" ON quiz;
DROP POLICY IF EXISTS "Users can insert their own quizzes" ON quiz;
DROP POLICY IF EXISTS "Users can update their own quizzes" ON quiz;
DROP POLICY IF EXISTS "Users can delete their own quizzes" ON quiz;

CREATE POLICY "Anonymous users can view all quizzes"
  ON quiz FOR SELECT
  USING (true);

CREATE POLICY "Anonymous users can insert quizzes"
  ON quiz FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update all quizzes"
  ON quiz FOR UPDATE
  USING (true);

CREATE POLICY "Anonymous users can delete all quizzes"
  ON quiz FOR DELETE
  USING (true);

-- Same for progress table
DROP POLICY IF EXISTS "Users can view progress for their homework" ON progress;
DROP POLICY IF EXISTS "Users can manage progress for their homework" ON progress;

CREATE POLICY "Anonymous users can view all progress"
  ON progress FOR SELECT
  USING (true);

CREATE POLICY "Anonymous users can manage all progress"
  ON progress FOR ALL
  USING (true);

-- Same for quiz_attempts table
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can create quiz attempts" ON quiz_attempts;

CREATE POLICY "Anonymous users can view all attempts"
  ON quiz_attempts FOR SELECT
  USING (true);

CREATE POLICY "Anonymous users can create attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (true);
