-- Create homework table
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

-- Create indexes for homework table
CREATE INDEX IF NOT EXISTS idx_homework_user_id ON homework(user_id);
CREATE INDEX IF NOT EXISTS idx_homework_created_at ON homework(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_homework_subject ON homework(subject);

-- Enable RLS (Row Level Security)
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

-- Create policies for homework table
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
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON homework
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
