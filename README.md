# Cheater
**Turn homework into fun quizzes with AI**

A cross-platform app that captures homework images and generates interactive quizzes using Claude Vision API. Track progress, master concepts, and make studying engaging.

---

## Overview

Cheater helps students learn by transforming homework into personalized quizzes:
- 📷 **Capture homework** via camera or photo library
- 🧠 **AI quiz generation** using Claude Vision API (direct image-to-quiz)
- 🎯 **Smart classification** with topic-specific prompts (maths, science, english, history)
- 🎮 **Multiple question types** (MCQ, fill-in-blank, short answer)
- 📊 **Progress tracking** with stats and best scores
- 🎨 **Native feel** with smooth animations and haptics

---

## Repository Structure

This is a **monorepo** containing multiple implementations:

```
cheater/
├── Cheater-iOS/          # iOS native app (Swift + SwiftUI)
├── Cheater-React/        # React Native app (planned - web + mobile)
├── docs/                 # Comprehensive documentation (9 files)
├── shared/config/        # Shared configuration (Prompts.json, TrainingData.json)
└── README.md            # This file
```

### Current Implementations

| Platform | Status | Tech Stack | Purpose |
|----------|--------|------------|---------|
| **iOS Native** | ✅ Active Development | Swift, SwiftUI, Core Data | Native iOS app with Claude Vision |
| **React Native** | 📋 Planned | React Native, Expo, Supabase | Cross-platform (web + iOS + Android) |

---

## Quick Start

### iOS App (Current)

```bash
# 1. Clone repository
git clone https://github.com/ivovos/cheater.git
cd cheater/Cheater-iOS

# 2. Configure API key
cp Config.example.plist Config.plist
# Edit Config.plist and add your ANTHROPIC_API_KEY

# 3. Open in Xcode
open Cheater-iOS.xcodeproj

# 4. Build and run (⌘R)
```

**Requirements:**
- macOS Sonoma 14.0+
- Xcode 15.0+
- iOS 16.7.10+ device/simulator
- Claude API key (get from [console.anthropic.com](https://console.anthropic.com))

### React Native App (Planned)

Coming soon. Will support:
- Web deployment via Vercel
- iOS/Android via Expo
- Faster iteration with hot reload
- Supabase backend (multi-user)

---

## Documentation

Comprehensive documentation is available in the [`/docs`](./docs) folder:

| File | Description |
|------|-------------|
| [00-OVERVIEW.md](./docs/00-OVERVIEW.md) | Project vision, features, tech stack, roadmap |
| [01-DATA-MODELS.md](./docs/01-DATA-MODELS.md) | TypeScript/Swift interfaces for all models |
| [02-API-INTEGRATION.md](./docs/02-API-INTEGRATION.md) | Claude Vision API integration details |
| [03-PROMPTS-SYSTEM.md](./docs/03-PROMPTS-SYSTEM.md) | Smart prompts and classification system |
| [04-DESIGN-SYSTEM.md](./docs/04-DESIGN-SYSTEM.md) | Colors, typography, animations, iOS patterns |
| [05-UI-COMPONENTS.md](./docs/05-UI-COMPONENTS.md) | Component library specifications |
| [06-USER-FLOWS.md](./docs/06-USER-FLOWS.md) | User journeys and interaction patterns |
| [07-DATABASE-SCHEMA.md](./docs/07-DATABASE-SCHEMA.md) | Core Data + Supabase schemas |
| [08-MIGRATION-GUIDE.md](./docs/08-MIGRATION-GUIDE.md) | iOS → React Native migration plan |

### Shared Configuration

The [`/shared/config`](./shared/config) folder contains configuration used by both implementations:

- **Prompts.json** (v2.0.0): Topic-specific vision prompts for Claude API
- **TrainingData.json** (v1.0.0): Example homework types for better detection
- **README.md**: Configuration usage and update guide

---

## Technology Stack

### iOS Implementation

| Layer | Technology |
|-------|-----------|
| **Language** | Swift 5.9 |
| **UI Framework** | SwiftUI |
| **State Management** | Combine (@Published, ObservableObject) |
| **Database** | Core Data (local, single-user) |
| **AI Service** | Claude Vision API (Anthropic) |
| **Image Processing** | UIKit (resize, JPEG compression) |
| **Animations** | SwiftUI native animations |
| **Architecture** | MVVM |

### React Native Implementation (Planned)

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native + Expo |
| **Language** | TypeScript |
| **UI Library** | react-native-reanimated, Framer Motion |
| **State Management** | Zustand |
| **Database** | Supabase (PostgreSQL with RLS) |
| **AI Service** | Claude Vision API (Anthropic) |
| **Image Processing** | expo-image-manipulator |
| **Routing** | Expo Router (file-based) |
| **Deployment** | Vercel (web), Expo (native) |

---

## Features

### Current (iOS)

✅ **Smart Quiz Generation**
- Direct image-to-quiz with Claude Vision API
- Topic classification (maths, science, english, history, generic)
- Multiple question types (MCQ, fill-blank, short answer)
- Spelling list detection

✅ **Quiz Gameplay**
- 10 questions per homework
- Immediate feedback with explanations
- Type-specific answer inputs
- Progress tracking

✅ **Progress & Stats**
- Best score tracking
- Completion percentage
- Attempt history
- Last played timestamp

✅ **iOS Native Experience**
- Dark mode support
- Haptic feedback
- Smooth spring animations
- Native UI components

### Planned (React Native)

📋 **Multi-user Support**
- User authentication (Supabase Auth)
- Cloud storage for homework images
- Cross-device sync

📋 **Web Access**
- Play quizzes in browser
- Responsive design
- Easy sharing via URL

📋 **Enhanced Features**
- Quiz attempt history
- Detailed analytics
- Custom quiz creation
- Study streaks

---

## Project Status

### iOS App Progress

| Component | Status | Completion |
|-----------|--------|------------|
| Data Models | ✅ Complete | 100% |
| Core Data Schema | ✅ Complete | 100% |
| AI Service (Vision API) | ✅ Complete | 100% |
| Smart Classification | ✅ Complete | 100% |
| UI Components | ✅ Complete | 100% |
| Quiz Gameplay | ✅ Complete | 100% |
| Results Screen | ✅ Complete | 100% |
| Camera Capture | 🚧 In Progress | 80% |
| Image Processing | 🚧 In Progress | 80% |
| Error Handling | 🚧 In Progress | 70% |

**Overall: ~90% Complete**

### Documentation Progress

| Document | Status |
|----------|--------|
| Data Models | ✅ Complete (782 lines) |
| API Integration | ✅ Complete (791 lines) |
| Prompts System | ✅ Complete (330 lines) |
| Design System | ✅ Complete (699 lines) |
| UI Components | ✅ Complete (663 lines) |
| User Flows | ✅ Complete (588 lines) |
| Database Schema | ✅ Complete (619 lines) |
| Migration Guide | ✅ Complete (comprehensive) |

**Total: 4,763+ lines of documentation**

---

## How It Works

### 1. Camera Capture Flow

```
[Homework List] → Tap + button
    ↓
[Choose Source] → Camera or Photo Library
    ↓
[Capture/Select] → Take or choose homework image
    ↓
[AI Processing] → Claude Vision analyzes image (2-3 seconds)
    │              - Classifies topic (maths, science, etc.)
    │              - Detects question types needed
    │              - Generates 10 questions
    ↓
[Quiz Ready] → Auto-navigate to quiz
    ↓
[Play Quiz]
```

### 2. Quiz Gameplay

**Three Question Types:**

1. **Multiple Choice (MCQ)**
   - 4 options (A, B, C, D)
   - Tap to select
   - Immediate feedback with explanation

2. **Fill in the Blank**
   - Text input field
   - Case-insensitive matching
   - Show correct answer if wrong

3. **Short Answer**
   - Multi-line text editor
   - Lenient matching (key concepts)
   - Model answer comparison

### 3. Progress Tracking

After completing a quiz:
- **Best Score**: Track your highest score (0-10)
- **Completion %**: Based on best performance
- **Total Attempts**: How many times you've played
- **Last Played**: Timestamp of last attempt

---

## API Integration

### Claude Vision API

The app uses Claude's multimodal Vision API to generate quizzes directly from images:

**Request Format:**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4096,
  "messages": [{
    "role": "user",
    "content": [
      {
        "type": "image",
        "source": {
          "type": "base64",
          "media_type": "image/jpeg",
          "data": "<base64-encoded-image>"
        }
      },
      {
        "type": "text",
        "text": "Analyze this maths homework..."
      }
    ]
  }]
}
```

**Image Processing:**
- Resize to max 1280px width
- JPEG compression at 75% quality
- Base64 encoding
- ~100-200 KB per image

**Cost:** ~$0.03-0.04 per quiz generation

See [docs/02-API-INTEGRATION.md](./docs/02-API-INTEGRATION.md) for complete details.

---

## Contributing

### For iOS Development

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly on iOS 16.7.10+ and iOS 26
5. Commit with descriptive messages
6. Push to your fork
7. Open a Pull Request

### For Documentation

Documentation improvements are welcome! All docs are in `/docs` folder:
- Follow existing markdown format
- Include code examples
- Update table of contents
- Test all links

---

## Roadmap

### Phase 1: iOS MVP ✅ (Current - 90% Complete)
- [x] Core Data models
- [x] Claude Vision API integration
- [x] Smart topic classification
- [x] Multiple question types
- [x] Quiz gameplay UI
- [x] Progress tracking
- [ ] Camera capture flow (in progress)
- [ ] End-to-end polish

### Phase 2: React Native Port 📋 (Planned)
- [ ] Expo project setup
- [ ] Supabase backend
- [ ] User authentication
- [ ] Component migration
- [ ] Web deployment (Vercel)
- [ ] Cross-platform testing

### Phase 3: Enhanced Features 🔮 (Future)
- [ ] Quiz attempt history
- [ ] Detailed analytics dashboard
- [ ] Custom quiz creation
- [ ] Study streaks and gamification
- [ ] Social features (share quizzes)
- [ ] Offline mode
- [ ] Export to PDF

---

## Cost Structure

### Development
- **Claude API**: ~$0.03-0.04 per quiz
- **Supabase** (React Native): Free tier (500MB storage, 2GB bandwidth)
- **Vercel** (Web): Free tier (hobby projects)
- **Expo** (Build service): Free tier (limited builds)

### Per User (React Native)
- **Storage**: ~1-2 MB per homework (images)
- **Database**: ~10 KB per homework (metadata + quiz)
- **API**: Variable based on quiz generation frequency

See [docs/00-OVERVIEW.md](./docs/00-OVERVIEW.md#cost-analysis) for detailed breakdown.

---

## License

This project is currently unlicensed. All rights reserved.

---

## Acknowledgments

- **Claude API** by Anthropic for powerful vision-based quiz generation
- **SwiftUI** by Apple for beautiful native iOS UI
- **React Native** by Meta (planned) for cross-platform capabilities
- **Supabase** (planned) for backend infrastructure

---

## Contact

**Repository**: [github.com/ivovos/cheater](https://github.com/ivovos/cheater)

For bugs, feature requests, or questions, please open an issue on GitHub.

---

## Next Steps

### For iOS Development
1. Complete camera capture flow
2. Test end-to-end with real homework
3. Polish error handling
4. Add loading states
5. Beta testing with students

### For React Native Port
1. Review [docs/08-MIGRATION-GUIDE.md](./docs/08-MIGRATION-GUIDE.md)
2. Set up Expo project in `/Cheater-React`
3. Configure Supabase backend
4. Migrate components following design system
5. Implement authentication

**Start here**: [docs/00-OVERVIEW.md](./docs/00-OVERVIEW.md)
