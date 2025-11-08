-- Create quiz_attempts table for tracking quiz history
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

-- Create policies for quiz_attempts table
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
