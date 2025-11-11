# Cheater - AI Homework Quiz Generator

> **AI Assistant**: Read this file from top to bottom. Don't skip to docs/ folder until you need specific implementation details.

## 🚨 WHICH PROJECT ARE YOU WORKING ON?

**Always specify before running commands:**
- 📱 **React Native (Expo)**: `cd Cheater-React`
- 🌐 **Web (Next.js)**: `cd cheater-web`
- 🍎 **iOS (Swift/Xcode)**: Open `Cheater-iOS/Cheater.xcodeproj`

---

## ⚡ Quick Start Commands

### React Native Development
```bash
cd Cheater-React
npm install                    # First time only
npx expo start                 # Start Metro bundler
npx expo start -c              # Clear cache if issues
```

**Running on devices:**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app (physical device)

### Web Development
```bash
cd cheater-web
npm install                    # First time only
npm run dev                    # Start Next.js dev server
# Open http://localhost:3000
```

### iOS Development
1. Open `Cheater-iOS/Cheater.xcodeproj` in Xcode
2. Select simulator (iPhone 15 Pro recommended)
3. Press `⌘ + R` to build and run

### Common Maintenance
```bash
# Reset if things break
cd Cheater-React && rm -rf node_modules && npm install
cd ../cheater-web && rm -rf node_modules && npm install

# Clear all caches
npx expo start -c              # React Native
rm -rf .next                   # Next.js
```

---

## 🗂️ Project Structure

```
CHEATER/
├── 📱 Cheater-React/          # React Native + Expo (MVP COMPLETE)
│   ├── app/                   # Expo Router screens
│   ├── components/            # UI components
│   ├── services/              # API, database, prompts
│   ├── stores/                # Zustand state management
│   └── supabase/              # Database migrations
│
├── 🌐 cheater-web/            # Next.js web version (IN PROGRESS)
│   ├── app/                   # App router
│   ├── components/            # React components
│   └── lib/                   # Services & utilities
│
├── 🍎 Cheater-iOS/            # Swift + SwiftUI (PRODUCTION)
│   ├── Models/                # Data structures
│   ├── Services/              # AIService, PromptManager
│   ├── ViewModels/            # @Published state
│   └── Views/                 # SwiftUI components
│
├── 📚 docs/                   # ✅ SOURCE OF TRUTH
│   ├── 00-OVERVIEW.md         # Features & architecture
│   ├── 01-DATA-MODELS.md      # Homework, Quiz, Question
│   ├── 02-API-INTEGRATION.md  # Claude Vision API
│   ├── 03-PROMPTS-SYSTEM.md   # Intelligent prompting
│   ├── 04-DESIGN-SYSTEM.md    # Colors, typography, spacing
│   ├── 05-UI-COMPONENTS.md    # Component specs
│   ├── 06-USER-FLOWS.md       # Complete user journeys
│   ├── 07-DATABASE-SCHEMA.md  # Supabase schema
│   └── 08-MIGRATION-GUIDE.md  # iOS → React Native
│
├── 🔧 shared/config/          # Shared across all platforms
│   ├── Prompts.json           # Topic-specific AI prompts
│   └── TrainingData.json      # Example homework types

```

---

## 🎯 What Is Cheater?

AI-powered app that turns homework photos into interactive quizzes:

1. **📸 Photo homework** (or choose from library)
2. **🤖 AI generates 10 questions** (MCQ, fill-blank, short-answer)
3. **🎮 Kid plays quiz** (immediate feedback, explanations)
4. **📊 Track progress** (best scores, completion rates)

**Tech Stack:**
- **AI**: Claude Vision API (Anthropic)
- **iOS**: Swift + SwiftUI + Core Data
- **React Native**: TypeScript + Expo + Supabase
- **Web**: Next.js + TypeScript + Supabase

---

## 🔑 Environment Setup

### First Time Setup

```bash
# 1. Install dependencies for each project
cd Cheater-React && npm install
cd ../cheater-web && npm install

# 2. Copy environment templates
cp Cheater-React/.env.example Cheater-React/.env
cp cheater-web/.env.example cheater-web/.env

# 3. Add API keys to both .env files
# ANTHROPIC_API_KEY=sk-ant-...
# SUPABASE_URL=https://...
# SUPABASE_ANON_KEY=eyJ...
```

### Getting API Keys

**Anthropic (Claude AI):**
1. Go to https://console.anthropic.com
2. Create API key
3. Copy to `.env` as `ANTHROPIC_API_KEY`
4. Cost: ~$0.04 per quiz

**Supabase (Database - React Native & Web only):**
1. Go to https://supabase.com
2. Create project
3. Copy URL and anon key to `.env`
4. Run migrations: `cd Cheater-React && npx supabase db push`

**iOS uses Core Data (no cloud setup needed)**

---

## 📖 When to Read Detailed Docs

**Don't read docs/ folder unless you need specific implementation details.**

Read these **in order** when working on features:

| Task | Read These Docs |
|------|----------------|
| Understanding data structure | `01-DATA-MODELS.md` |
| API integration issues | `02-API-INTEGRATION.md` |
| Changing quiz generation | `03-PROMPTS-SYSTEM.md` |
| Styling components | `04-DESIGN-SYSTEM.md` |
| Building new UI | `05-UI-COMPONENTS.md` |
| User flow questions | `06-USER-FLOWS.md` |
| Database changes | `07-DATABASE-SCHEMA.md` |
| iOS → React Native migration | `08-MIGRATION-GUIDE.md` |

---

## 🛠️ Common Tasks

### Running the App
```bash
# React Native
cd Cheater-React && npx expo start

# Web
cd cheater-web && npm run dev

# iOS
# Open Xcode project and press ⌘+R
```

### Making Code Changes

**React Native/Web:**
1. Edit files in `components/`, `app/`, or `services/`
2. Save - hot reload happens automatically
3. Check terminal for errors

**iOS:**
1. Edit `.swift` files
2. Press `⌘ + B` to build
3. Press `⌘ + R` to run

### Testing Quiz Generation

```bash
# React Native - use Expo Go app
cd Cheater-React && npx expo start
# Take photo or upload test image

# Web
cd cheater-web && npm run dev
# Navigate to upload page

# iOS
# Run in simulator, use simulator's photo library
```

### Editing AI Prompts

```bash
# Edit shared config (affects all platforms)
open shared/config/Prompts.json

# Changes apply to:
# - iOS (via symlinked Config/ folder)
# - React Native (via services/PromptManager.ts)
# - Web (via lib/promptManager.ts)
```

### Changing Question Types

1. Edit `shared/config/Prompts.json`
2. Update `questionTypeDistribution` for topic:
   ```json
   "maths": {
     "mcq": 0.6,        // 60%
     "fillBlank": 0.3,  // 30%
     "shortAnswer": 0.1 // 10%
   }
   ```
3. Ensure values sum to 1.0
4. Test with real homework images

### Adding New Topics

1. Add to `shared/config/Prompts.json`:
   ```json
   "prompts": {
     "vision": {
       "geography": {
         "systemMessage": "You are an expert geography teacher...",
         "instructions": ["Identify maps, countries, capitals..."],
         "requirements": [...]
       }
     }
   }
   ```
2. Add distribution: `"geography": { "mcq": 0.5, ... }`
3. Add to `settings.topics` array
4. Update title generation logic in each platform

---

## 🐛 Troubleshooting

### "Command not found: expo"
```bash
cd Cheater-React
npx expo start  # Use 'npx', not 'expo' directly
```

### Metro bundler errors
```bash
cd Cheater-React
npx expo start -c              # -c clears cache
# Or full reset:
rm -rf node_modules && npm install && npx expo start -c
```

### "Module not found" in Next.js
```bash
cd cheater-web
rm -rf .next node_modules
npm install
npm run dev
```

### API key errors
Check `.env` file exists and has valid keys:
```bash
# React Native
cat Cheater-React/.env

# Web
cat cheater-web/.env

# Should contain:
# ANTHROPIC_API_KEY=sk-ant-...
# SUPABASE_URL=https://...
# SUPABASE_ANON_KEY=eyJ...
```

### Supabase connection issues
```bash
# Check if migrations are applied
cd Cheater-React
npx supabase status

# Apply migrations
npx supabase db push
```

### iOS build errors
1. Clean build folder: `⌘ + Shift + K`
2. Close Xcode and delete derived data:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```
3. Reopen project and build

### Claude Code is slow
**This happens when it reads legacy folders. If Claude tries to read:**
- `Project definition/` folder → STOP, redirect to `docs/`
- Old docs in `Cheater-iOS/` → STOP, redirect to `docs/`

**Be specific with commands:**
- ✅ "Run the React Native development server"
- ❌ "Start the app" (which app?)

---

## 🎨 Design Principles

All platforms follow **iOS-native design**:

### Colors
- Primary: `#007AFF` (iOS Blue)
- Success: `#34C759` (iOS Green)  
- Error: `#FF3B30` (iOS Red)
- Background: White (light) / Black (dark)

### Typography
- Large Title: 34pt Bold
- Title: 28pt Regular
- Headline: 17pt Semibold
- Body: 17pt Regular

### Spacing (8px base)
- tiny: 4px
- small: 8px
- medium: 16px
- large: 24px

### Animations
Use spring animations (damping: 0.7, stiffness: 300)

**Full specs**: `docs/04-DESIGN-SYSTEM.md`

---

## 📊 Data Models

### Core Entities

**Homework** (the original assignment photo)
```typescript
{
  id: string;              // UUID
  title: string;           // "Maths - Algebra"
  subject?: string;        // "maths", "english", etc.
  imageURL: string;        // Local file path or Supabase URL
  ocrText?: string;        // Extracted text from image
  createdAt: Date;
  bestScore?: number;      // 0-100
  totalAttempts: number;
  completionPercentage: number;
  lastPlayedAt?: Date;
}
```

**Quiz** (generated from homework)
```typescript
{
  id: string;
  homeworkId: string;
  questions: Question[];   // Exactly 10 questions
  createdAt: Date;
  topic?: string;          // "maths", "english", etc.
  subtopic?: string;       // "algebra", "grammar", etc.
}
```

**Question** (individual quiz question)
```typescript
{
  id: string;
  type: "mcq" | "fillBlank" | "shortAnswer";
  question: string;
  
  // For MCQ only:
  options?: string[];      // Exactly 4 options
  correctIndex?: number;   // 0-3
  
  // For fillBlank/shortAnswer:
  correctAnswer?: string;
  
  explanation: string;
}
```

**Progress** (quiz attempt tracking)
```typescript
{
  id: string;
  homeworkId: string;
  quizId: string;
  score: number;           // 0-100
  answers: Answer[];       // User's answers
  completedAt: Date;
}
```

**Full details**: `docs/01-DATA-MODELS.md`

---

## 🤖 AI Integration

### Claude Vision API

**Model**: `claude-sonnet-4-20250514`  
**Endpoint**: `https://api.anthropic.com/v1/messages`  
**Cost**: ~$0.04 per quiz

### What Happens in One API Call

1. Send homework image (base64, max 1280px, 75% JPEG quality)
2. Send topic-specific prompt from `Prompts.json`
3. Claude returns:
   - OCR text from image
   - Quiz title (e.g. "Maths - Algebra")
   - Topic classification ("maths", "english", etc.)
   - Exactly 10 questions (MCQ, fill-blank, short-answer mix)
   - Explanations for each answer

### Image Processing Pipeline
```
Original Image
    ↓
Resize to max 1280px
    ↓
Convert to JPEG (75% quality)
    ↓
Base64 encode
    ↓
Send to Claude API (~180KB)
```

**Full details**: `docs/02-API-INTEGRATION.md`

---

## 🎯 Coding Conventions

### File Naming

**React Native/Web (TypeScript):**
- Components: `PascalCase.tsx` (e.g., `HomeworkCard.tsx`)
- Services: `camelCase.ts` (e.g., `aiService.ts`)
- Stores: `camelCase.ts` (e.g., `homeworkStore.ts`)

**iOS (Swift):**
- All files: `PascalCase.swift` (e.g., `HomeworkListView.swift`)

### Code Style

**React Native/Web:**
```typescript
// Named exports for components
export const HomeworkCard: React.FC<Props> = ({ homework }) => {
  const colors = useColors();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      {/* Content */}
    </View>
  );
};

// StyleSheet at bottom
const styles = StyleSheet.create({
  card: {
    padding: Spacing.medium,
    borderRadius: Radius.card,
  }
});
```

**iOS (SwiftUI):**
```swift
struct HomeworkCard: View {
    let homework: Homework
    
    var body: some View {
        HStack(spacing: 16) {
            thumbnail
            content
        }
        .padding(16)
        .background(Color.appCardBackground)
        .cornerRadius(16)
    }
    
    private var thumbnail: some View {
        // Extract complex subviews
    }
}
```

### State Management

**React Native/Web (Zustand):**
```typescript
export const useHomeworkStore = create<HomeworkState>((set) => ({
  homework: [],
  isLoading: false,
  
  loadHomework: async () => {
    set({ isLoading: true });
    const data = await HomeworkDB.getAll();
    set({ homework: data, isLoading: false });
  }
}));
```

**iOS (SwiftUI):**
```swift
@MainActor
class HomeworkViewModel: ObservableObject {
    @Published var homework: [Homework] = []
    @Published var isLoading = false
    
    func loadHomework() async {
        isLoading = true
        // Load data
        isLoading = false
    }
}
```

---

## ⚠️ Common Pitfalls

### 1. Running Commands in Wrong Directory
**Problem**: Running `npm start` in project root does nothing  
**Solution**: Always `cd` to specific project first:
```bash
cd Cheater-React && npx expo start
# OR
cd cheater-web && npm run dev
```

### 2. Forgetting to Resize Images
**Problem**: API timeout or high costs  
**Solution**: Always resize before sending:
```typescript
// Check services/aiService.ts for implementation
const resized = await resizeImage(imageUri, 1280);
```

### 3. Not Validating API Responses
**Problem**: App crashes on malformed quiz data  
**Solution**: Always validate:
```typescript
if (quiz.questions.length !== 10) {
  throw new Error('Invalid quiz: must have exactly 10 questions');
}
```

### 4. Hardcoding Colors
**Problem**: Dark mode looks broken  
**Solution**: Use semantic colors:
```typescript
// ✅ Correct
const colors = useColors();
backgroundColor: colors.cardBackground

// ❌ Wrong
backgroundColor: '#FFFFFF'
```

### 5. Supabase PostgREST Relationship Errors
**Problem**: "More than one relationship found" errors  
**Cause**: Duplicate foreign key constraints in migrations  
**Solution**: Use only ONE FK per relationship:
```sql
-- ✅ Correct (choose one)
CREATE TABLE progress (
  homework_id UUID REFERENCES homework(id)
);

-- ❌ Wrong (duplicate!)
CREATE TABLE progress (
  homework_id UUID REFERENCES homework(id),
  CONSTRAINT fk_homework FOREIGN KEY (homework_id) REFERENCES homework(id)
);
```

---

## 📦 Deployment

### React Native (Expo)
```bash
cd Cheater-React
eas build --platform ios     # iOS
eas build --platform android # Android
eas submit                   # Submit to stores
```

### Web (Next.js on Vercel)
```bash
cd cheater-web
vercel                       # Deploy
# Or connect GitHub repo to Vercel
```

### iOS (App Store)
1. Archive in Xcode: `Product → Archive`
2. Upload to App Store Connect
3. Submit for review

---

## 🔒 Important Rules for AI Assistant

1. **ONLY read `docs/` folder** for implementation details
2. **ALWAYS** specify which project before running commands
3. **Test changes** in development before suggesting
4. **Validate data models** - UUIDs, exactly 10 questions, etc.
5. **Use semantic colors** - never hardcode colors
6. **Spring animations** - damping: 0.7, stiffness: 300
7. **Keep responses concise** - user prefers brevity

---

## 📚 Resources

- [Claude API Docs](https://docs.anthropic.com/claude/reference/messages_post)
- [Expo Docs](https://docs.expo.dev)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [SwiftUI Docs](https://developer.apple.com/documentation/swiftui)

---

**Project Status:**
- ✅ iOS: Production ready (Core Data + SwiftUI)
- ✅ React Native: MVP complete (Supabase + Expo)
- 🚧 Web: In progress (Next.js + Supabase)

**Last Updated**: November 2024  
**Documentation Version**: 2.0.0