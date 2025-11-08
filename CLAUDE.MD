# Cheater Project - AI Assistant Guide

> **IMPORTANT**: All project documentation and instructions are in the [docs/](docs/) folder. The "Project definition" folder and "Cheater-iOS" folder contain legacy/outdated information and should be ignored. Always refer to the docs folder for current, accurate information.

## Quick Start

When working on this project, **ALWAYS** consult these documentation files in order:

1. [docs/00-OVERVIEW.md](docs/00-OVERVIEW.md) - Project vision, features, and architecture
2. [docs/01-DATA-MODELS.md](docs/01-DATA-MODELS.md) - All data structures (Homework, Quiz, Question, etc.)
3. [docs/02-API-INTEGRATION.md](docs/02-API-INTEGRATION.md) - Claude Vision API integration patterns
4. [docs/03-PROMPTS-SYSTEM.md](docs/03-PROMPTS-SYSTEM.md) - Intelligent prompting system
5. [docs/04-DESIGN-SYSTEM.md](docs/04-DESIGN-SYSTEM.md) - Colors, typography, spacing, animations
6. [docs/05-UI-COMPONENTS.md](docs/05-UI-COMPONENTS.md) - Component implementations
7. [docs/06-USER-FLOWS.md](docs/06-USER-FLOWS.md) - Complete user flows and state management
8. [docs/07-DATABASE-SCHEMA.md](docs/07-DATABASE-SCHEMA.md) - Database schema and relationships
9. [docs/08-MIGRATION-GUIDE.md](docs/08-MIGRATION-GUIDE.md) - iOS to React Native migration guide

## Project Overview

**Cheater** is an AI-powered educational app that transforms homework assignments into interactive quizzes using Claude AI's Vision API.

### Core Features
- **Camera Capture**: Photo homework or choose from library
- **Smart Quiz Classification**: Auto-detects topic (Maths, English, Science, History) and adapts question types
- **Multi-Format Questions**: MCQ, fill-in-blank, short-answer
- **Progress Tracking**: Best scores, completion rates, attempts
- **Adaptive Learning**: Special handling for spelling lists, math worksheets, etc.

### Technology Stack

#### Current (iOS)
- **Language**: Swift 5.9+
- **UI**: SwiftUI
- **State**: @Published, @StateObject
- **Async**: Swift Concurrency (async/await, Actor)
- **Database**: Core Data
- **API**: Claude Vision API (Anthropic)

#### React Native (In Progress → MVP Complete)
- **Language**: TypeScript
- **UI**: React Native + Expo
- **State**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Navigation**: Expo Router
- **Status**: Full MVP complete with all core features working

## Architecture Principles

### Separation of Concerns
1. **Models**: Pure data structures (see [01-DATA-MODELS.md](docs/01-DATA-MODELS.md))
2. **Services**: Business logic and external APIs (see [02-API-INTEGRATION.md](docs/02-API-INTEGRATION.md))
3. **ViewModels**: State management
4. **Views**: Presentation only

### Key Services
- **AIService**: Claude Vision API integration, image processing, quiz generation
- **PromptManager**: Loads and builds topic-specific prompts from `shared/config/Prompts.json`
- **PersistenceController**: Core Data management (iOS) or Supabase (React Native)

## Data Models

### Core Entities
All models use:
- **UUIDs** for IDs
- **ISO 8601** dates
- **Optional fields** marked with `?`
- **Validation functions** for each model
- **Type safety** (TypeScript/Swift)

#### Homework
```typescript
{
  id: string;
  title: string;
  subject?: string;
  imageURL: string;
  ocrText?: string;
  createdAt: Date;
  bestScore?: number;
  totalAttempts: number;
  completionPercentage: number;
  lastPlayedAt?: Date;
}
```

#### Quiz
```typescript
{
  id: string;
  homeworkId: string;
  questions: Question[];  // Exactly 10
  createdAt: Date;
  topic?: string;         // "maths", "english", "science", "history", "generic"
  subtopic?: string;      // "algebra", "grammar", etc.
  classificationConfidence?: number;
}
```

#### Question
```typescript
{
  id: string;
  type: "mcq" | "fillBlank" | "shortAnswer";
  question: string;

  // For MCQ only
  options?: string[];      // Exactly 4 options
  correctIndex?: number;   // 0-3

  // For fillBlank and shortAnswer
  correctAnswer?: string;

  explanation: string;
}
```

**Full details**: [docs/01-DATA-MODELS.md](docs/01-DATA-MODELS.md)

## API Integration

### Claude Vision API

**Endpoint**: `https://api.anthropic.com/v1/messages`
**Model**: `claude-sonnet-4-20250514`
**Timeout**: 60 seconds

### Image Processing Pipeline
```
Original Image
    ↓
Resize (max 1280px)
    ↓
Convert to JPEG (75% quality)
    ↓
Base64 Encode
    ↓
Send to Claude API
```

### Request Format
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "messages": [{
    "role": "user",
    "content": [
      {
        "type": "image",
        "source": {
          "type": "base64",
          "media_type": "image/jpeg",
          "data": "<base64_image>"
        }
      },
      {
        "type": "text",
        "text": "<vision_prompt>"
      }
    ]
  }]
}
```

### Cost Per Quiz
- Input: ~$0.006 (2,000 tokens)
- Output: ~$0.032 (2,100 tokens)
- **Total**: ~$0.04 per quiz

**Full details**: [docs/02-API-INTEGRATION.md](docs/02-API-INTEGRATION.md)

## Prompts System

### Configuration Files
- **`shared/config/Prompts.json`**: Topic-specific prompt templates
- **`shared/config/TrainingData.json`**: Example homework types with strategies

### Topic-Specific Question Distributions

| Topic   | MCQ  | Fill-Blank | Short-Answer |
|---------|------|------------|--------------|
| Maths   | 60%  | 30%        | 10%          |
| English | 40%  | 40%        | 20%          |
| Science | 50%  | 30%        | 20%          |
| History | 50%  | 20%        | 30%          |
| Generic | 60%  | 25%        | 15%          |

### Special Cases
- **Spelling Lists**: Detected automatically, generates 90% MCQ with spelling variations
- **Math Worksheets**: Emphasizes fill-blank for calculations
- **Reading Comprehension**: More short-answer questions

### Smart Title Generation
- `"Maths - Algebra"`
- `"Spelling Practice"`
- `"Science - Biology"`
- `"History - World War 2"`

**Full details**: [docs/03-PROMPTS-SYSTEM.md](docs/03-PROMPTS-SYSTEM.md)

## Design System

### iOS-Native Design Philosophy
1. **Clarity**: Content is paramount
2. **Deference**: UI defers to content
3. **Depth**: Visual layers convey hierarchy
4. **Consistency**: Familiar iOS patterns
5. **Performance**: 60fps animations always

### Color Palette
```typescript
Colors = {
  primary: '#007AFF',        // iOS Blue
  success: '#34C759',        // iOS Green
  error: '#FF3B30',          // iOS Red
  warning: '#FF9500',        // iOS Orange

  // Adaptive (light/dark)
  background: { light: '#FFFFFF', dark: '#000000' },
  cardBackground: { light: '#FFFFFF', dark: '#1C1C1E' },
  textPrimary: { light: '#000000', dark: '#FFFFFF' },
  textSecondary: '#8E8E93',
}
```

### Typography (SF Pro Style)
- **Large Title**: 34pt, Bold
- **Title 1**: 28pt, Regular
- **Headline**: 17pt, Semibold
- **Body**: 17pt, Regular
- **Callout**: 16pt, Regular
- **Footnote**: 13pt, Regular

### Spacing (8px base)
```typescript
Spacing = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xLarge: 32,
  xxLarge: 48
}
```

### Spring Animations
```typescript
Spring.default = {
  damping: 0.7,
  stiffness: 300,
  mass: 1,
  response: 0.3
}
```

### Haptic Feedback
- **Light**: Button press
- **Medium**: Selection
- **Heavy**: Significant action
- **Success**: Correct answer
- **Error**: Wrong answer

**Full details**: [docs/04-DESIGN-SYSTEM.md](docs/04-DESIGN-SYSTEM.md)

## Coding Conventions

### File Structure
```
Project/
├── Models/          # Data structures
├── Services/        # Business logic (AIService, PromptManager)
├── ViewModels/      # State management (@Published)
├── Views/           # UI components
└── Config/          # Symlink to shared/config/
```

### Naming Conventions

#### Swift
- **Files**: PascalCase (e.g., `HomeworkListView.swift`)
- **Classes/Structs**: PascalCase (e.g., `AIService`, `Homework`)
- **Functions**: camelCase (e.g., `generateQuiz()`, `loadHomework()`)
- **Properties**: camelCase (e.g., `bestScore`, `totalAttempts`)
- **Constants**: camelCase with `let` (e.g., `let apiURL`)

#### TypeScript/React Native
- **Files**: PascalCase for components (e.g., `HomeworkCard.tsx`)
- **Files**: camelCase for services (e.g., `aiService.ts`)
- **Interfaces**: PascalCase (e.g., `interface Homework {}`)
- **Functions**: camelCase (e.g., `generateQuiz()`, `loadHomework()`)
- **Components**: PascalCase (e.g., `HomeworkCard`, `AnswerButton`)
- **Hooks**: camelCase with `use` prefix (e.g., `useColors()`, `useHomeworkStore()`)

### Code Style

#### SwiftUI Views
```swift
struct HomeworkCardView: View {
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
        // Extract complex views
    }
}
```

#### React Native Components
```typescript
export const HomeworkCard: React.FC<{ homework: Homework }> = ({ homework }) => {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      {/* Content */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.medium,
    borderRadius: Radius.card,
    ...Shadow.card
  }
});
```

### Async Patterns

#### Swift
```swift
// Use async/await
func loadHomework() async throws -> [Homework] {
    let data = try await fetchData()
    return parseHomework(data)
}

// Use Actor for thread safety
actor AIService {
    func generateQuiz() async throws -> Quiz { }
}
```

#### TypeScript
```typescript
// Use async/await with try-catch
async function loadHomework(): Promise<Homework[]> {
  try {
    const data = await fetchData();
    return parseHomework(data);
  } catch (error) {
    throw new AIServiceError(error);
  }
}
```

### Error Handling

#### Swift
```swift
enum AIError: Error {
    case invalidRequest
    case networkError
    case parsingError
}

do {
    let quiz = try await aiService.generateQuiz(from: image)
} catch {
    handleError(error)
}
```

#### TypeScript
```typescript
export class AIServiceError extends Error {
  constructor(
    public type: AIError,
    message: string,
    public statusCode?: number
  ) {
    super(message);
  }
}

try {
  const quiz = await aiService.generateQuiz(imageUri);
} catch (error) {
  if (error instanceof AIServiceError) {
    showUserError(error);
  }
}
```

## State Management

### iOS (SwiftUI)
```swift
@MainActor
class HomeworkListViewModel: ObservableObject {
    @Published var homework: [Homework] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    func loadHomework() async {
        isLoading = true
        // Load data
        isLoading = false
    }
}
```

### React Native (Zustand)
```typescript
export const useHomeworkStore = create<HomeworkState>((set, get) => ({
  homework: [],
  isLoading: false,
  error: null,

  loadHomework: async () => {
    set({ isLoading: true });
    const homework = await HomeworkDB.getAll();
    set({ homework, isLoading: false });
  }
}));
```

## Testing Strategy

### What to Test
1. **Data models**: Validation functions
2. **Services**: API calls, error handling
3. **ViewModels**: State transitions
4. **Components**: Rendering, user interactions
5. **Integration**: Full user flows

### What NOT to Test
- Third-party libraries
- Framework internals
- UI styling (visual regression tests instead)

## Common Tasks

### Adding a New Question Type
1. Update `QuestionType` enum in [01-DATA-MODELS.md](docs/01-DATA-MODELS.md)
2. Update validation logic in `Question` model
3. Update prompts in `shared/config/Prompts.json`
4. Update UI component to render new type
5. Update answer checking logic

### Adding a New Topic
1. Add topic to `Prompts.json` under `prompts.vision`
2. Define system message, instructions, requirements
3. Set distribution in `settings.questionTypeDistribution`
4. Add topic to `settings.topics` array
5. Update title generation logic

### Modifying Question Distribution
1. Edit `shared/config/Prompts.json`
2. Update `settings.questionTypeDistribution[topic]`
3. Ensure all values sum to 1.0
4. Test with real homework images

### Adding Training Examples
1. Edit `shared/config/TrainingData.json`
2. Add new example with indicators, strategies, and examples
3. Update `PromptManager.selectRelevantExamples()` priority mapping
4. Test detection accuracy

## Performance Guidelines

### Image Processing
- Resize to **max 1280px**
- Compress JPEG to **75% quality**
- Target: **~180KB** per image

### API Optimization
- Timeout: **60 seconds**
- Max tokens: **4096**
- Expected response time: **2-3 seconds**

### UI Performance
- **60fps** animations always
- Use hardware acceleration
- Avoid layout changes during animations
- Virtualize long lists
- Debounce expensive operations

## Deployment

### iOS (Current)
- Build with Xcode
- TestFlight for beta
- App Store submission

### React Native (Future)
- **Web**: Deploy to Vercel
- **iOS/Android**: Build with EAS Build
- **Environment**: Use `.env` for secrets

## Configuration Files

### `shared/config/Prompts.json`
- Version: 2.0.0
- Topic-specific prompts for Claude
- Question type distributions
- Classification settings

### `shared/config/TrainingData.json`
- Version: 1.0.0
- Example homework types
- Detection indicators
- Question strategies

**IMPORTANT**: These config files are shared between iOS and React Native implementations. Always validate JSON after editing.

## Common Pitfalls

### 1. Forgetting to Resize Images
- Always resize to 1280px max before API call
- Use 75% JPEG compression
- Monitor file sizes (~180KB target)

### 2. Not Validating API Responses
- Always validate 10 questions returned
- Check question type matches requirements
- Validate MCQ has 4 options
- Validate correctAnswer exists for fill-blank/short-answer

### 3. Ignoring Dark Mode
- Use semantic colors (`useColors()` or `Color.appBackground`)
- Test in both light and dark modes
- Avoid hardcoded color values

### 4. Poor Error Handling
- Show user-friendly messages
- Log technical details for debugging
- Implement retry logic for network errors
- Don't retry for invalid API keys

### 5. Blocking UI Thread
- Use async/await for all API calls
- Show loading states
- Allow cancellation of long operations
- Use background threads for heavy processing

### 6. Supabase PostgREST Relationship Errors (React Native)
- **Problem**: Duplicate foreign key constraints cause "Could not embed because more than one relationship was found" errors
- **Common Cause**: SQL migrations with both inline and explicit FOREIGN KEY constraints
- **Example**:
  ```sql
  CREATE TABLE progress (
    homework_id UUID REFERENCES homework(id),  -- Inline FK
    CONSTRAINT fk_homework
      FOREIGN KEY (homework_id) REFERENCES homework(id)  -- Explicit FK (duplicate!)
  );
  ```
- **Solutions**:
  1. Use `progress!homework_id (*)` syntax to specify which FK to use
  2. Or simplify queries to avoid joins: use `select('*')` and handle missing data gracefully
- **Best Practice**: Only use ONE foreign key constraint per relationship - either inline OR explicit, never both
- **Location**: See `Cheater-React/supabase/migrations/03_create_progress_table.sql`

## Resources

- [Claude API Docs](https://docs.anthropic.com/claude/reference/messages_post)
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Docs](https://supabase.com/docs)

## Getting Help

When encountering issues:

1. **Check the docs folder first** - All current information is there
2. **Review related documentation files** - Use the quick start list above
3. **Check API response logs** - Enable verbose logging for Claude API
4. **Validate configuration** - Ensure Prompts.json and TrainingData.json are valid
5. **Test with simpler cases** - Start with basic homework images

## Remember

- **ONLY use the `docs/` folder** for project information
- **IGNORE** `Project definition/` and `Cheater-iOS/` folders (legacy content)
- **All models use UUIDs** for IDs, never integers
- **Exactly 10 questions** per quiz, no exceptions
- **iOS-native feel** is the goal - spring animations, haptics, blur effects
- **Performance matters** - 60fps, 2-3 second quiz generation
- **Claude Vision API** does both OCR and question generation in one call

---

**Last Updated**: November 2024
**Documentation Version**: 1.0.0
**Project Status**:
- ✅ iOS MVP Complete (Core Data + SwiftUI)
- ✅ React Native MVP Complete (Supabase + Expo)
  - Full end-to-end flow working
  - Photo capture → AI quiz generation → Database save → Quiz gameplay
  - All core features implemented
  - Known issue: PostgREST relationship queries (documented above)
- 🚧 Deployment pending (Vercel web + EAS Build)
