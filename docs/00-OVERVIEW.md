# Project Overview

## Vision

Cheater is an AI-powered educational app that transforms homework assignments into interactive quizzes. By leveraging Claude AI's Vision API, students can simply photograph their homework and instantly receive a personalized 10-question quiz to test their understanding.

## Target Users

- **Primary**: Secondary school students (ages 11-18)
- **Secondary**: Parents supervising homework completion
- **Future**: Teachers creating classroom quizzes

## Core Value Proposition

1. **Instant Quiz Generation**: Convert any homework image to a quiz in 2-3 seconds
2. **Smart Topic Detection**: Automatically identifies subject and adjusts question types
3. **Multiple Question Formats**: MCQ, fill-in-blank, and short-answer questions
4. **Progress Tracking**: Monitor improvement over time with scores and completion rates
5. **Adaptive Learning**: Special handling for spelling lists, math worksheets, reading comprehension, etc.

## Key Features

### 1. Camera Capture Flow
- Take photo or choose from library
- Image preview with confirmation
- AI processing with visual feedback
- Auto-navigation to generated quiz

### 2. Smart Quiz Classification
- **Topic Detection**: Maths, English, Science, History, or Generic
- **Subtopic Identification**: Algebra, Grammar, Biology, World War 2, etc.
- **Special Cases**: Spelling lists detected and handled with appropriate question types
- **Adaptive Distributions**: Question type mix varies by subject

### 3. Multi-Format Questions
- **Multiple Choice (MCQ)**: 4 options with immediate feedback
- **Fill-in-Blank**: Text input with exact matching
- **Short Answer**: Essay-style with lenient grading

### 4. Interactive Gameplay
- Progress indicator (X of 10)
- Question-by-question feedback
- Skip functionality
- Explanation for each answer
- Haptic feedback (iOS)

### 5. Progress & Analytics
- Best score tracking
- Total attempts count
- Completion percentage
- Last played timestamp
- Historical performance

### 6. Smart Title Generation
- "Maths - Algebra"
- "Spelling Practice"
- "Science - Biology"
- "History - World War 2"

## Technology Stack Comparison

### Current (iOS - SwiftUI)

| Component | Technology |
|-----------|-----------|
| **Language** | Swift 5.9+ |
| **UI Framework** | SwiftUI |
| **State Management** | @Published, @StateObject |
| **Async** | Swift Concurrency (async/await, Actor) |
| **Database** | Core Data (SQLite) |
| **Networking** | URLSession |
| **Camera** | UIImagePickerController |
| **Image Processing** | UIKit, Core Graphics |
| **OCR** | Apple Vision (VNRecognizeTextRequest) |
| **AI API** | Claude Vision API (Anthropic) |
| **Animations** | SwiftUI Animations, spring physics |
| **Haptics** | UIFeedbackGenerator |

### Future (React Native - Expo)

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **UI Framework** | React Native + Expo |
| **State Management** | Zustand |
| **Async** | Promises, async/await |
| **Database** | Supabase (PostgreSQL) |
| **Networking** | Axios / Fetch |
| **Camera** | expo-camera, expo-image-picker |
| **Image Processing** | expo-image-manipulator |
| **OCR** | Not required (Claude Vision handles) |
| **AI API** | Claude Vision API (Anthropic) |
| **Animations** | Framer Motion (web), reanimated (native) |
| **Haptics** | expo-haptics |
| **Navigation** | Expo Router |
| **Deployment** | Vercel (web), EAS Build (native) |

## Architecture Philosophy

### Core Principles

1. **Separation of Concerns**
   - Models: Pure data structures
   - Services: Business logic and external APIs
   - ViewModels: State management
   - Views: Presentation only

2. **Type Safety**
   - Strict TypeScript (React Native)
   - Strong Swift typing (iOS)
   - Validated data structures

3. **Offline-First (Future)**
   - Cache generated quizzes
   - Queue API calls
   - Sync when online

4. **Performance**
   - Image optimization before upload
   - Lazy loading
   - Efficient re-renders
   - 60fps animations

5. **Error Resilience**
   - Graceful degradation
   - User-friendly error messages
   - Retry logic with backoff
   - Offline detection

## Data Flow

```
User Action (Camera)
    ↓
Capture Image
    ↓
Process & Compress (1280px, 75% JPEG)
    ↓
Base64 Encode
    ↓
Claude Vision API Request
    ├─ Image Data
    └─ Topic-Specific Prompt
    ↓
Parse JSON Response
    ├─ Topic/Subtopic
    ├─ Confidence Score
    └─ 10 Questions (validated)
    ↓
Generate Smart Title
    ↓
Save to Database
    ├─ Homework Entity
    ├─ Quiz Entity (JSON questions)
    └─ Progress Entity
    ↓
Navigate to Quiz
    ↓
User Plays Quiz
    ├─ Answer Questions
    ├─ Get Feedback
    └─ View Explanations
    ↓
Complete Quiz
    ↓
Update Progress
    ├─ Calculate Score
    ├─ Update Best Score
    ├─ Increment Attempts
    └─ Update Completion %
    ↓
Show Results
    ├─ Circular Progress
    ├─ Grade Message
    └─ Stats
```

## Cost Structure

### Claude API Usage

**Per Quiz Generated:**
- Image Input: ~1.15 KB base64 = ~$0.012
- Text Output: ~2,000 tokens = ~$0.030
- **Total: ~$0.04 per quiz**

### Supabase (Future)

- Database: Free tier (500 MB)
- Storage: Free tier (1 GB)
- Auth: Free tier (50,000 MAU)

### Vercel Deployment (Future)

- Web hosting: Free tier (100 GB bandwidth)
- Serverless functions: Free tier (100 GB-hours)

## Future Roadmap

### Phase 1 (Current - iOS MVP)
- ✅ Camera capture
- ✅ Claude Vision integration
- ✅ Smart topic detection
- ✅ Multi-format questions
- ✅ Progress tracking
- ✅ Spelling list detection
- ✅ Training data system

### Phase 2 (Next - React Native Port)
- 🔄 React Native + Expo setup
- 🔄 Supabase migration
- 🔄 Web deployment (Vercel)
- 🔄 iOS-native feel (animations, haptics)
- 🔄 PWA support

### Phase 3 (Future Enhancements)
- 📋 User authentication
- 📋 Cloud sync across devices
- 📋 Sharing quizzes with classmates
- 📋 Teacher accounts (class management)
- 📋 Analytics dashboard
- 📋 Spaced repetition system
- 📋 Voice input for answers
- 📋 AR homework scanning

### Phase 4 (Monetization)
- 📋 Freemium model (5 quizzes/month free)
- 📋 Premium subscription ($4.99/month)
- 📋 School/district licensing
- 📋 API access for educators

## Project Status

**Current Version**: 1.0.0 (iOS Beta)
**Lines of Code**: ~3,500 (Swift)
**Test Coverage**: N/A (MVP stage)
**Last Updated**: November 2024

## Repository Structure

```
cheater/
├── Cheater-iOS/          # Native iOS app (SwiftUI)
├── Cheater-React/        # React Native app (Expo) - Coming soon
├── docs/                 # This documentation
├── shared/              # Shared config files
│   └── config/
│       ├── Prompts.json
│       └── TrainingData.json
└── README.md            # Root readme
```

## Key Differentiators

1. **True AI Understanding**: Uses Vision API (not OCR + text)
2. **Smart Classification**: Detects homework type and adapts
3. **Educational Focus**: Explanations for every answer
4. **Native Feel**: iOS-quality animations and interactions
5. **Instant Results**: 2-3 second quiz generation
6. **Offline-Capable**: Quiz gameplay works offline (future)

## Success Metrics

### User Engagement
- Quizzes generated per user per week
- Quiz completion rate
- Average score improvement over time
- Return rate (DAU/MAU)

### Quality Metrics
- Topic classification accuracy
- User satisfaction (app store rating)
- Bug reports per 1000 users
- API success rate

### Business Metrics
- Cost per quiz generated
- API efficiency (tokens per quiz)
- User acquisition cost
- Conversion to premium

## Getting Started

See individual README files in:
- [Cheater-iOS README](../Cheater-iOS/README.md)
- [Cheater-React README](../Cheater-React/README.md) (coming soon)

For technical details, continue to:
- [Data Models](./01-DATA-MODELS.md)
- [API Integration](./02-API-INTEGRATION.md)
- [Design System](./04-DESIGN-SYSTEM.md)
