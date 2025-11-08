# Supabase Migrations

This directory contains SQL migrations for setting up the Cheater app database schema.

## Running Migrations

### Option 1: Supabase CLI (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

4. Run migrations:
```bash
supabase db push
```

### Option 2: Manual Execution

Run the SQL files in order through the Supabase Dashboard:

1. Go to your project at https://app.supabase.com
2. Navigate to SQL Editor
3. Copy and paste each migration file in order:
   - `01_create_homework_table.sql`
   - `02_create_quiz_table.sql`
   - `03_create_progress_table.sql`
   - `04_create_quiz_attempts_table.sql`
   - `05_create_functions.sql`

## Database Schema

### Tables

- **homework**: Stores homework assignments with images
- **quiz**: Stores generated quizzes with questions (JSONB)
- **progress**: Tracks user progress per homework
- **quiz_attempts**: History of all quiz attempts

### Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own data
- Data is automatically filtered by `user_id`

### Storage

You'll also need to set up a storage bucket for homework images:

1. Go to Storage in Supabase Dashboard
2. Create a new bucket called `homework-images`
3. Set it to **Public**
4. Add the following policies:
   - Users can upload: `auth.uid() = storage.foldername(name)[1]::uuid`
   - Users can read: `auth.uid() = storage.foldername(name)[1]::uuid`

## Environment Variables

Add these to your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing the Database

After running migrations, test with:

```sql
-- Insert test homework (replace user_id with your auth.uid())
INSERT INTO homework (user_id, title, subject, image_url)
VALUES (
  'your-user-id-here',
  'Math Homework',
  'Mathematics',
  'https://example.com/image.jpg'
);

-- Verify RLS is working
SELECT * FROM homework; -- Should only show your data
```
