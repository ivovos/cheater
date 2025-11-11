-- =====================================================
-- Cheater App - Complete Database Setup
-- Run this in Supabase Dashboard SQL Editor
-- =====================================================

-- =====================================================
-- 1. CREATE HOMEWORK TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(100),
  image_url TEXT NOT NULL,
  ocr_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for a table
CREATE INDEX IF NOT EXISTS idx_homework_user_id ON homework(user_id);
CREATE INDEX IF NOT EXISTS idx_homework_created_at ON homework(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_homework_subject ON homework(subject);

-- Enable RLS (Row Level Security)
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (CORRECT SYNTAX)
DROP POLICY IF EXISTS "Users can view their own homework" ON homework;
DROP POLICY IF EXISTS "Users can insert their own homework" ON homework;
DROP POLICY IF EXISTS "Users can update their own homework" ON homework;
DROP POLICY IF EXISTS "Users can delete their own homework" ON homework;

CREATE POLICY "Users can view their own homework"
  ON homework FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own homework"
  ON homework FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own homework"
  ON homework FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own homework"
  ON homework FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON homework;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON homework
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. CREATE QUIZ TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  topic VARCHAR(50),
  subtopic VARCHAR(100),
  classification_confidence DECIMAL(3,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_homework
    FOREIGN KEY (homework_id)
    REFERENCES homework(id)
    ON DELETE CASCADE
);

-- Create indexes for quiz table
CREATE INDEX IF NOT EXISTS idx_quiz_homework_id ON quiz(homework_id);
CREATE INDEX IF NOT EXISTS idx_quiz_topic ON quiz(topic);
CREATE INDEX IF NOT EXISTS idx_quiz_created_at ON quiz(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_questions ON quiz USING GIN (questions);

-- Enable RLS
ALTER TABLE quiz ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (CORRECT SYNTAX)
DROP POLICY IF EXISTS "Users can view quizzes for their homework" ON quiz;
DROP POLICY IF EXISTS "Users can insert quizzes for their homework" ON quiz;
DROP POLICY IF EXISTS "Users can update quizzes for their homework" ON quiz;
DROP POLICY IF EXISTS "Users can delete quizzes for their homework" ON quiz;

CREATE POLICY "Users can view quizzes for their homework"
  ON quiz FOR SELECT
  USING (
    homework_id IN (
      SELECT id FROM homework WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert quizzes for their homework"
  ON quiz FOR INSERT
  WITH CHECK (
    homework_id IN (
      SELECT id FROM homework WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update quizzes for their homework"
  ON quiz FOR UPDATE
  USING (
    homework_id IN (
      SELECT id FROM homework WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete quizzes for their homework"
  ON quiz FOR DELETE
  USING (
    homework_id IN (
      SELECT id FROM homework WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 3. CREATE PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID NOT NULL UNIQUE REFERENCES homework(id) ON DELETE CASCADE,
  completion_percentage SMALLINT NOT NULL DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  best_score SMALLINT CHECK (best_score BETWEEN 0 AND 10),
  total_attempts INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_homework
    FOREIGN KEY (homework_id)
    REFERENCES homework(id)
    ON DELETE CASCADE
);

-- Create indexes for progress table
CREATE UNIQUE INDEX IF NOT EXISTS idx_progress_homework_id ON progress(homework_id);
CREATE INDEX IF NOT EXISTS idx_progress_last_played ON progress(last_played_at DESC);

-- Enable RLS
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (CORRECT SYNTAX)
DROP POLICY IF EXISTS "Users can view progress for their homework" ON progress;
DROP POLICY IF EXISTS "Users can manage progress for their homework" ON progress;

CREATE POLICY "Users can view progress for their homework"
  ON progress FOR SELECT
  USING (
    homework_id IN (
      SELECT id FROM homework WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage progress for their homework"
  ON progress FOR ALL
  USING (
    homework_id IN (
      SELECT id FROM homework WHERE user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_progress ON progress;
CREATE TRIGGER set_updated_at_progress
  BEFORE UPDATE ON progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. CREATE QUIZ_ATTEMPTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
  score SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 10),
  total_questions SMALLINT NOT NULL DEFAULT 10,
  time_taken_seconds INTEGER,
  answers JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_quiz
    FOREIGN KEY (quiz_id)
    REFERENCES quiz(id)
    ON DELETE CASCADE
);

-- Create indexes for quiz_attempts table
CREATE INDEX IF NOT EXISTS idx_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_completed_at ON quiz_attempts(completed_at DESC);

-- Enable RLS
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (CORRECT SYNTAX)
DROP POLICY IF EXISTS "Users can view their quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can insert their quiz attempts" ON quiz_attempts;

CREATE POLICY "Users can view their quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (
    quiz_id IN (
      SELECT q.id
      FROM quiz q
      JOIN homework h ON q.homework_id = h.id
      WHERE h.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (
    quiz_id IN (
      SELECT q.id
      FROM quiz q
      JOIN homework h ON q.homework_id = h.id
      WHERE h.user_id = auth.uid()
    )
  );

-- =====================================================
-- 5. CREATE HELPER FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION update_homework_progress(
  p_homework_id UUID,
  p_score SMALLINT,
  p_total_questions SMALLINT
)
RETURNS void AS $$
DECLARE
  v_percentage SMALLINT;
BEGIN
  -- Calculate completion percentage
  v_percentage := (p_score::DECIMAL / p_total_questions * 100)::SMALLINT;

  -- Insert or update progress
  INSERT INTO progress (
    homework_id,
    completion_percentage,
    best_score,
    total_attempts,
    last_played_at
  )
  VALUES (
    p_homework_id,
    v_percentage,
    p_score,
    1,
    NOW()
  )
  ON CONFLICT (homework_id) DO UPDATE SET
    total_attempts = progress.total_attempts + 1,
    best_score = GREATEST(progress.best_score, p_score),
    completion_percentage = GREATEST(progress.completion_percentage, v_percentage),
    last_played_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. RELAX RLS FOR ANONYMOUS USERS (MVP ONLY)
-- =====================================================
-- This allows anonymous users to access all homework data
-- In production, you'll want stricter policies with real user auth

-- Drop ALL existing policies first (CORRECT SYNTAX)
DROP POLICY IF EXISTS "Users can view their own homework" ON homework;
DROP POLICY IF EXISTS "Users can insert their own homework" ON homework;
DROP POLICY IF EXISTS "Users can update their own homework" ON homework;
DROP POLICY IF EXISTS "Users can delete their own homework" ON homework;
DROP POLICY IF EXISTS "Anonymous users can view all homework" ON homework;
DROP POLICY IF EXISTS "Anonymous users can insert homework" ON homework;
DROP POLICY IF EXISTS "Anonymous users can update all homework" ON homework;
DROP POLICY IF EXISTS "Anonymous users can delete all homework" ON homework;

DROP POLICY IF EXISTS "Users can view quizzes for their homework" ON quiz;
DROP POLICY IF EXISTS "Users can insert quizzes for their homework" ON quiz;
DROP POLICY IF EXISTS "Users can update quizzes for their homework" ON quiz;
DROP POLICY IF EXISTS "Users can delete quizzes for their homework" ON quiz;
DROP POLICY IF EXISTS "Anonymous users can view all quizzes" ON quiz;
DROP POLICY IF EXISTS "Anonymous users can insert quizzes" ON quiz;
DROP POLICY IF EXISTS "Anonymous users can update all quizzes" ON quiz;
DROP POLICY IF EXISTS "Anonymous users can delete all quizzes" ON quiz;

DROP POLICY IF EXISTS "Users can view progress for their homework" ON progress;
DROP POLICY IF EXISTS "Users can manage progress for their homework" ON progress;
DROP POLICY IF EXISTS "Anonymous users can view all progress" ON progress;
DROP POLICY IF EXISTS "Anonymous users can manage all progress" ON progress;

DROP POLICY IF EXISTS "Users can view their quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can insert their quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Anonymous users can view all attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Anonymous users can create attempts" ON quiz_attempts;

-- Create permissive policies for anonymous auth
CREATE POLICY "Anonymous users can view all homework"
  ON homework FOR SELECT
  USING (true);

CREATE POLICY "Anonymous users can insert homework"
  ON homework FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update all homework"
  ON homework FOR UPDATE
  USING (true);

CREATE POLICY "Anonymous users can delete all homework"
  ON homework FOR DELETE
  USING (true);

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

CREATE POLICY "Anonymous users can view all progress"
  ON progress FOR SELECT
  USING (true);

CREATE POLICY "Anonymous users can manage all progress"
  ON progress FOR ALL
  USING (true);

CREATE POLICY "Anonymous users can view all attempts"
  ON quiz_attempts FOR SELECT
  USING (true);

CREATE POLICY "Anonymous users can create attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Enable Anonymous Authentication:
--    - Go to Authentication > Providers
--    - Toggle "Anonymous" to ON
--
-- 2. (Optional) Create storage bucket for images:
--    - Go to Storage
--    - Create bucket named "homework-images"
--    - Make it Public
-- =====================================================
