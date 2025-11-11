# Database Schema

Database architecture for both Core Data (iOS current) and Supabase (React Native future).

## Current: Core Data (iOS)

### Entity Relationship Diagram

```
HomeworkEntity (1) ──── (1) QuizEntity
       │
       └──── (1) ProgressEntity
```

### Entities

#### HomeworkEntity

```swift
@Entity HomeworkEntity {
  @Attribute id: UUID (Primary Key)
  @Attribute title: String?
  @Attribute subject: String?
  @Attribute imageURL: String (Required)
  @Attribute ocrText: String?
  @Attribute createdAt: Date (Required)
  
  @Relationship quiz: QuizEntity? (Optional, 1:1)
    Deletion Rule: Cascade
  
  @Relationship progress: ProgressEntity? (Optional, 1:1)
    Deletion Rule: Cascade
}
```

**Indexes:**
- Primary: id
- Secondary: createdAt (for sorting)

**Default Values:**
- createdAt: Current date/time

#### QuizEntity

```swift
@Entity QuizEntity {
  @Attribute id: UUID (Primary Key)
  @Attribute questionsJSON: Data (Required)
    // JSON-encoded array of Question objects
  @Attribute createdAt: Date (Required)
  
  @Relationship homework: HomeworkEntity? (Optional)
    Deletion Rule: Nullify
    Inverse: homework.quiz
}
```

**Indexes:**
- Primary: id
- Foreign Key: homework.id

**Storage:**
- `questionsJSON`: Binary data containing JSON array of 10 Question objects
- Size: ~5-10 KB per quiz

#### ProgressEntity

```swift
@Entity ProgressEntity {
  @Attribute id: UUID (Primary Key)
  @Attribute completionPercentage: Int16 (Default: 0)
  @Attribute bestScore: Int16? (Optional)
  @Attribute totalAttempts: Int16 (Default: 0)
  @Attribute lastPlayedAt: Date? (Optional)
  
  @Relationship homework: HomeworkEntity? (Optional)
    Deletion Rule: Nullify
    Inverse: homework.progress
}
```

**Indexes:**
- Primary: id
- Foreign Key: homework.id

**Constraints:**
- completionPercentage: 0-100
- bestScore: 0-10 (if present)
- totalAttempts: >= 0

### Deletion Cascade Rules

```
Delete HomeworkEntity
    → CASCADE delete QuizEntity
    → CASCADE delete ProgressEntity

Delete QuizEntity
    → NULLIFY homework.quiz reference

Delete ProgressEntity
    → NULLIFY homework.progress reference
```

### Core Data Queries

#### Fetch All Homework (Sorted)

```swift
let request = HomeworkEntity.fetchRequest()
request.sortDescriptors = [
  NSSortDescriptor(key: "createdAt", ascending: false)
]
let homework = try context.fetch(request)
```

#### Fetch Quiz for Homework

```swift
let request = QuizEntity.fetchRequest()
request.predicate = NSPredicate(
  format: "homework.id == %@", 
  homeworkId as CVarArg
)
let quizzes = try context.fetch(request)
let quiz = quizzes.first
```

#### Update Progress

```swift
// Fetch or create
let homework = fetchHomework(by: id)
let progress = homework.progress ?? ProgressEntity(context: context)
progress.homework = homework

// Update stats
progress.totalAttempts += 1
progress.lastPlayedAt = Date()
progress.bestScore = max(progress.bestScore ?? 0, newScore)
progress.completionPercentage = max(
  progress.completionPercentage,
  Int16((newScore / 10) * 100)
)

try context.save()
```

---

## Future: Supabase (React Native)

### Database: PostgreSQL

### Tables

#### homework

```sql
CREATE TABLE homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(100),
  image_url TEXT NOT NULL,
  ocr_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_homework_user_id ON homework(user_id);
CREATE INDEX idx_homework_created_at ON homework(created_at DESC);
CREATE INDEX idx_homework_subject ON homework(subject);

-- RLS (Row Level Security)
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

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

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON homework
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### quiz

```sql
CREATE TABLE quiz (
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

-- Indexes
CREATE INDEX idx_quiz_homework_id ON quiz(homework_id);
CREATE INDEX idx_quiz_topic ON quiz(topic);
CREATE INDEX idx_quiz_created_at ON quiz(created_at DESC);

-- GIN index for JSONB questions
CREATE INDEX idx_quiz_questions ON quiz USING GIN (questions);

-- RLS
ALTER TABLE quiz ENABLE ROW LEVEL SECURITY;

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
```

**JSONB Structure:**
```json
{
  "questions": [
    {
      "id": "uuid",
      "type": "mcq",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "..."
    }
  ]
}
```

#### progress

```sql
CREATE TABLE progress (
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

-- Indexes
CREATE UNIQUE INDEX idx_progress_homework_id ON progress(homework_id);
CREATE INDEX idx_progress_last_played ON progress(last_played_at DESC);

-- RLS
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

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
```

#### quiz_attempts (New - for history)

```sql
CREATE TABLE quiz_attempts (
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

-- Indexes
CREATE INDEX idx_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_attempts_completed_at ON quiz_attempts(completed_at DESC);

-- RLS
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

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
```

### Stored Functions

#### Update Progress Function

```sql
CREATE OR REPLACE FUNCTION update_homework_progress(
  p_homework_id UUID,
  p_score SMALLINT,
  p_total_questions SMALLINT
)
RETURNS void AS $$
DECLARE
  v_percentage SMALLINT;
BEGIN
  v_percentage := (p_score::DECIMAL / p_total_questions * 100)::SMALLINT;
  
  INSERT INTO progress (homework_id, completion_percentage, best_score, total_attempts, last_played_at)
  VALUES (p_homework_id, v_percentage, p_score, 1, NOW())
  ON CONFLICT (homework_id) DO UPDATE SET
    total_attempts = progress.total_attempts + 1,
    best_score = GREATEST(progress.best_score, p_score),
    completion_percentage = GREATEST(progress.completion_percentage, v_percentage),
    last_played_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Supabase Storage

#### Buckets

**homework-images**:
```
Policy: Authenticated users can upload/view their own images
Max size: 10 MB
Allowed types: image/jpeg, image/png
```

**Storage Structure:**
```
homework-images/
  └── {user_id}/
      ├── {homework_id_1}.jpg
      ├── {homework_id_2}.jpg
      └── ...
```

**Upload Function:**
```typescript
async function uploadHomeworkImage(
  file: Blob,
  homeworkId: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('homework-images')
    .upload(`${userId}/${homeworkId}.jpg`, file, {
      contentType: 'image/jpeg',
      upsert: false
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('homework-images')
    .getPublicUrl(data.path);
  
  return publicUrl;
}
```

### Migration Strategy

#### Step 1: Schema Setup

```sql
-- Run migrations in order
1_create_homework_table.sql
2_create_quiz_table.sql
3_create_progress_table.sql
4_create_quiz_attempts_table.sql
5_create_functions.sql
6_create_indexes.sql
7_create_rls_policies.sql
```

#### Step 2: Data Migration (iOS → Supabase)

```typescript
async function migrateHomework(homeworkEntity: HomeworkEntity) {
  // 1. Upload image to Supabase Storage
  const imageUrl = await uploadImage(homeworkEntity.imageURL);
  
  // 2. Create homework record
  const { data: homework } = await supabase
    .from('homework')
    .insert({
      id: homeworkEntity.id,
      title: homeworkEntity.title,
      subject: homeworkEntity.subject,
      image_url: imageUrl,
      ocr_text: homeworkEntity.ocrText,
      created_at: homeworkEntity.createdAt
    })
    .select()
    .single();
  
  // 3. Create quiz record
  if (homeworkEntity.quiz) {
    await supabase
      .from('quiz')
      .insert({
        id: homeworkEntity.quiz.id,
        homework_id: homework.id,
        questions: homeworkEntity.quiz.questions,
        created_at: homeworkEntity.quiz.createdAt
      });
  }
  
  // 4. Create progress record
  if (homeworkEntity.progress) {
    await supabase
      .from('progress')
      .insert({
        homework_id: homework.id,
        completion_percentage: homeworkEntity.progress.completionPercentage,
        best_score: homeworkEntity.progress.bestScore,
        total_attempts: homeworkEntity.progress.totalAttempts,
        last_played_at: homeworkEntity.progress.lastPlayedAt
      });
  }
}
```

### Supabase Queries

#### Fetch All Homework

```typescript
const { data, error } = await supabase
  .from('homework')
  .select(`
    *,
    quiz (*),
    progress (*)
  `)
  .order('created_at', { ascending: false });
```

#### Create Quiz Attempt

```typescript
const { data, error } = await supabase
  .from('quiz_attempts')
  .insert({
    quiz_id: quizId,
    score: score,
    total_questions: 10,
    time_taken_seconds: timeTaken,
    answers: answers
  })
  .select()
  .single();

// Update progress automatically via function
await supabase.rpc('update_homework_progress', {
  p_homework_id: homeworkId,
  p_score: score,
  p_total_questions: 10
});
```

#### Get Quiz History

```typescript
const { data, error } = await supabase
  .from('quiz_attempts')
  .select('*')
  .eq('quiz_id', quizId)
  .order('completed_at', { ascending: false });
```

### Realtime Subscriptions (Future)

```typescript
// Subscribe to homework changes
const channel = supabase
  .channel('homework-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'homework',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Homework changed:', payload);
      // Update local state
    }
  )
  .subscribe();
```

### Backup & Recovery

#### Automated Backups
- Daily full database backup
- Point-in-time recovery (7 days)
- Supabase handles automatically

#### Manual Export

```sql
-- Export all user data
COPY (
  SELECT * FROM homework WHERE user_id = 'user-uuid'
) TO '/backup/homework.csv' WITH CSV HEADER;
```

---

## Performance Considerations

### Indexing Strategy

**High Priority:**
- `homework.created_at` (sorting)
- `homework.user_id` (filtering)
- `quiz.homework_id` (joins)
- `progress.homework_id` (joins)

**Medium Priority:**
- `quiz.topic` (filtering)
- `quiz_attempts.quiz_id` (history)

### Query Optimization

**Avoid N+1 Queries:**
```typescript
// Bad
const homework = await fetchHomework();
for (let hw of homework) {
  hw.quiz = await fetchQuiz(hw.id);
  hw.progress = await fetchProgress(hw.id);
}

// Good
const homework = await supabase
  .from('homework')
  .select('*, quiz(*), progress(*)')
  .order('created_at', { ascending: false });
```

### Caching Strategy

**React Query:**
```typescript
const { data: homework } = useQuery(
  ['homework'],
  fetchHomework,
  {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30  // 30 minutes
  }
);
```

---

## Next Steps

- [Data Models](./01-DATA-MODELS.md) - TypeScript interfaces
- [Migration Guide](./08-MIGRATION-GUIDE.md) - Full migration plan
- [API Integration](./02-API-INTEGRATION.md) - Backend integration
