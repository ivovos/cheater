-- Create progress table
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

-- Create policies for progress table
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
CREATE TRIGGER set_updated_at_progress
  BEFORE UPDATE ON progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
