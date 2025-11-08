-- Create quiz table
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

-- Create GIN index for JSONB questions (for efficient JSON queries)
CREATE INDEX IF NOT EXISTS idx_quiz_questions ON quiz USING GIN (questions);

-- Enable RLS
ALTER TABLE quiz ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz table
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
