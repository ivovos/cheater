# Cheater React Native App

AI-powered homework quiz generator using Claude Vision API. Full-stack app with Expo, Supabase, and iOS-native design.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Copy `.env.template` to `.env` and add your API keys:
```bash
cp .env.template .env
```

Edit `.env`:
```
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set up Supabase

1. Create a Supabase project at https://supabase.com
2. Run the SQL migrations in `supabase/migrations/` in order:
   - `01_create_homework_table.sql`
   - `02_create_quiz_table.sql`
   - `03_create_progress_table.sql`
   - `04_create_attempts_table.sql`
   - `05_create_functions.sql`
3. Create a storage bucket named `homework-images`:
   - Go to Storage → New Bucket
   - Name: `homework-images`
   - Public bucket: **No** (we'll use RLS policies)
   - Click "Create Bucket"
4. Configure Storage Policies (go to bucket → Policies):
   - **SELECT policy**: Allow users to view their own images
     ```
     (storage.foldername(name))[1] = auth.uid()::text
     ```
   - **INSERT policy**: Allow users to upload to their own folder
     ```
     (storage.foldername(name))[1] = auth.uid()::text
     ```
   - **DELETE policy**: Allow users to delete their own images
     ```
     (storage.foldername(name))[1] = auth.uid()::text
     ```
5. Add your Supabase credentials to `.env`

### 4. Run the App

**For Web (Recommended for Development):**
```bash
# Terminal 1: Start Expo
npx expo start --web

# Terminal 2: Start proxy server (for Claude API)
node proxy-server.js
```

Access at http://localhost:8081

**For iOS Simulator:**
```bash
npm run ios
```

**For Android Emulator:**
```bash
npm run android
```

**Expo Go (Scan QR Code):**
```bash
npm start
```

## 📱 Using the App

### Capture Tab
1. Click "Pick an Image"
2. Select a homework photo
3. Click "Generate Quiz"
4. Wait 30-60 seconds for AI processing
5. Automatically navigate to quiz

### Homework Tab
- View all your saved homework assignments
- See completion percentage and best scores
- Tap any homework to play its quiz

### Quiz Screen
- Answer 10 questions one by one
- Get immediate feedback on each answer
- See explanations for incorrect answers
- View final score and retry if desired

### Supported Content Types:
- **Math worksheets** - MCQ + fill-in-blank questions
- **Spelling lists** - Auto-detected, spelling-focused MCQs
- **Reading passages** - Comprehension questions
- **Science diagrams** - Content-based questions
- **History notes** - Event and fact questions

## ✨ Features

### Core Functionality
- ✅ **Photo Capture** - Pick homework images from library
- ✅ **AI Quiz Generation** - Claude Vision API analyzes and creates quizzes
- ✅ **Smart Classification** - Auto-detects topics (Math, English, Science, History)
- ✅ **Multiple Question Types** - MCQ, fill-in-blank, short-answer
- ✅ **Instant Feedback** - See correct answers and explanations
- ✅ **Progress Tracking** - Best scores, completion %, attempts
- ✅ **Offline Storage** - Supabase database with anonymous auth

### Technical Stack
- ✅ **Expo + TypeScript** - Cross-platform with type safety
- ✅ **Expo Router** - File-based navigation
- ✅ **Zustand** - Lightweight state management
- ✅ **Supabase** - PostgreSQL + Storage + Auth
- ✅ **iOS-Native Design** - SF Pro typography, iOS colors, haptics
- ✅ **React Native Reanimated** - Smooth 60fps animations
- ✅ **Adaptive Dark Mode** - Full light/dark theme support

### Coming Soon
- 🚧 Native iOS/Android builds with EAS
- 🚧 Vercel deployment for web version
- 🚧 Camera capture (currently library only)
- 🚧 Quiz history and analytics

## 📂 Project Structure

```
Cheater-React/
├── app/                     # Expo Router file-based navigation
│   ├── _layout.tsx          # Root layout with auth
│   ├── (tabs)/              # Tab navigation
│   │   ├── _layout.tsx      # Tab bar setup
│   │   ├── index.tsx        # Home screen (homework list)
│   │   └── capture.tsx      # Capture screen (photo → quiz)
│   └── quiz/
│       └── [id].tsx         # Quiz play screen (dynamic route)
├── components/              # Reusable UI components
│   ├── HomeworkCard.tsx     # Homework item with stats
│   ├── AnswerButton.tsx     # Quiz answer button
│   ├── QuestionView.tsx     # Adaptive question display
│   └── ProgressBar.tsx      # Animated progress indicator
├── services/                # Business logic & external APIs
│   ├── aiService.ts         # Claude Vision API integration
│   ├── promptManager.ts     # Prompt building & training data
│   ├── supabase.ts          # Supabase client setup
│   ├── homeworkDB.ts        # Homework CRUD operations
│   └── quizDB.ts            # Quiz CRUD operations
├── stores/                  # Zustand state management
│   ├── homeworkStore.ts     # Homework list state
│   ├── quizStore.ts         # Quiz play state
│   └── captureStore.ts      # Capture flow state
├── theme/                   # Design system
│   ├── colors.ts            # iOS-native color palette
│   ├── useColors.ts         # Dark mode hook
│   ├── typography.ts        # SF Pro text styles
│   ├── spacing.ts           # 8px-based spacing scale
│   ├── radius.ts            # Border radius tokens
│   ├── shadow.ts            # iOS-native shadows
│   ├── haptics.ts           # Haptic feedback helpers
│   └── index.ts             # Theme exports
├── types/                   # TypeScript definitions
│   ├── question.ts          # Question types & validation
│   ├── quiz.ts              # Quiz & attempt types
│   ├── homework.ts          # Homework & progress types
│   ├── claude.ts            # Claude API types & errors
│   └── database.ts          # Supabase database types
├── supabase/                # Database migrations
│   └── migrations/          # SQL migration files
├── config/                  # -> ../shared/config (symlink)
│   ├── Prompts.json         # Topic-specific prompts
│   └── TrainingData.json    # Training examples
├── proxy-server.js          # Express proxy for Claude API (CORS)
├── index.ts                 # Expo Router entry point
├── babel.config.js          # Babel config for Reanimated
├── .env                     # Environment variables (not in git)
├── .env.template            # Template for .env
└── app.json                 # Expo configuration
```

## 🔑 Environment Variables

All environment variables are required for the app to function:

- `EXPO_PUBLIC_ANTHROPIC_API_KEY` - Get from https://console.anthropic.com
  - Cost: ~$0.04 per quiz generated
- `EXPO_PUBLIC_SUPABASE_URL` - Database URL from your Supabase project
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Anonymous key from your Supabase project

## 📊 API Costs

Claude Sonnet 4 pricing per quiz:
- Input: ~2,000 tokens × $3.00/1M = $0.006
- Output: ~2,100 tokens × $15.00/1M = $0.032
- **Total: ~$0.04 per quiz**

## 🐛 Troubleshooting

### "API key is missing"
- Make sure you created `.env` file (not just `.env.template`)
- Check that the API key starts with `sk-ant-api03-`
- Restart the dev server after adding the key

### "Request timed out"
- Claude Vision can take 30-60 seconds
- Check your internet connection
- Try with a smaller/clearer image

### "Could not parse quiz response"
- Try a clearer photo with better lighting
- Make sure the homework text is readable
- Try a different type of homework

### Image processing fails
- Make sure the image isn't too large (will auto-resize to 1280px)
- Try JPEG instead of PNG
- Check camera/photo library permissions

### "Supabase not configured - skipping database save"
- Make sure you created `.env` file with Supabase credentials
- Verify `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart the Expo dev server after adding env vars

### "Could not embed because more than one relationship was found"
- This is a PostgREST error when Supabase queries have ambiguous joins
- Check your database queries don't have unnecessary `select('*, quiz (*), progress (*)')` joins
- Simplify queries to only join what's needed for that specific view

### App stuck on "Saving homework..."
- Check browser console (F12) for detailed error messages
- Verify all database migrations ran successfully
- Ensure storage bucket policies are configured correctly
- Hard refresh the browser (Cmd+Shift+R) to clear cache

## 📚 Documentation

See the `docs/` folder in the root project for detailed documentation:
- [00-OVERVIEW.md](../docs/00-OVERVIEW.md) - Project vision
- [01-DATA-MODELS.md](../docs/01-DATA-MODELS.md) - Data structures
- [02-API-INTEGRATION.md](../docs/02-API-INTEGRATION.md) - API details
- [03-PROMPTS-SYSTEM.md](../docs/03-PROMPTS-SYSTEM.md) - Prompt system
- [08-MIGRATION-GUIDE.md](../docs/08-MIGRATION-GUIDE.md) - Migration guide

## ✅ What's Built

The MVP is complete with all core features:

1. ✅ **Supabase Database** - PostgreSQL with RLS, Storage, Anonymous Auth
2. ✅ **Zustand Stores** - homeworkStore, quizStore, captureStore
3. ✅ **Design System** - iOS-native colors, typography, spacing, shadows, haptics
4. ✅ **UI Components** - HomeworkCard, AnswerButton, QuestionView, ProgressBar
5. ✅ **Screens** - Home (homework list), Capture (photo → quiz), Quiz (gameplay)
6. ✅ **Animations** - React Native Reanimated with spring physics
7. ✅ **Full Flow** - Capture photo → Generate quiz → Save to DB → Play quiz → Track progress

## 🎯 Next Steps

To deploy and enhance:

1. **Test & Fix Bugs** - Verify the PostgREST fix works, test edge cases
2. **Add Camera Capture** - Currently library-only, add live camera support
3. **Quiz History** - View past attempts and detailed analytics
4. **Deploy Web** - Vercel deployment for web version
5. **Native Builds** - EAS Build for iOS and Android
6. **Performance Optimization** - Image caching, lazy loading, offline support

## 📄 License

MIT
