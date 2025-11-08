-- Function to update homework progress after a quiz attempt
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
