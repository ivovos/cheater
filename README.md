# Cheater
**Turn homework into fun quizzes with AI**

An AI-powered educational app available on iOS and Web that captures homework images and generates interactive quizzes using Claude Vision API. Track progress, master concepts, and make studying engaging.

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

This is a **monorepo** containing two implementations:

```
cheater/
├── Cheater-iOS/          # iOS native app (Swift + SwiftUI)
├── cheater-web/          # Next.js web app (TypeScript + React)
├── docs/                 # Comprehensive documentation
├── shared/config/        # Shared configuration (Prompts.json, TrainingData.json)
└── README.md            # This file
```

### Current Implementations

| Platform | Status | Tech Stack | Purpose |
|----------|--------|------------|---------|
| **iOS Native** | ✅ Production Ready | Swift, SwiftUI, Core Data | Native iOS app with Claude Vision |
| **Next.js Web** | ✅ MVP Complete | Next.js 16, TypeScript, Supabase | Modern web app with responsive design |

---

## Quick Start

### iOS App

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

### Next.js Web App

```bash
# 1. Navigate to web directory
cd cheater/cheater-web

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Run development server
npm run dev
```

**Requirements:**
- Node.js 18+
- Claude API key
- Supabase account (free tier)

---

## Documentation

Comprehensive documentation is available in the [`/docs`](./docs) folder:

| File | Description |
|------|-------------|
| [00-OVERVIEW.md](./docs/00-OVERVIEW.md) | Project vision, features, tech stack, roadmap |
| [01-DATA-MODELS.md](./docs/01-DATA-MODELS.md) | TypeScript/Swift interfaces for all models |
| [02-API-INTEGRATION.md](./docs/02-API-INTEGRATION.md) | Claude Vision API integration details |
| [03-PROMPTS-SYSTEM.md](./docs/03-PROMPTS-SYSTEM.md) | Smart prompts and classification system |
| [04-DESIGN-SYSTEM.md](./docs/04-DESIGN-SYSTEM.md) | Colors, typography, animations, design patterns |
| [05-DATABASE-SCHEMA.md](./docs/05-DATABASE-SCHEMA.md) | Core Data (iOS) + Supabase (Web) schemas |

See [CLAUDE.MD](./CLAUDE.MD) for AI assistant guidelines and complete project documentation.

### Shared Configuration

The [`/shared/config`](./shared/config) folder contains configuration used by both implementations:

- **Prompts.json** (v2.0.0): Topic-specific vision prompts for Claude API
- **TrainingData.json** (v1.0.0): Example homework types for better detection
- **README.md**: Configuration usage and update guide

---

## Technology Stack

### iOS Native

| Layer | Technology |
|-------|-----------|
| **Language** | Swift 5.9 |
| **UI Framework** | SwiftUI |
| **State Management** | Combine (@Published, ObservableObject) |
| **Database** | Core Data (local storage) |
| **AI Service** | Claude Vision API (Anthropic) |
| **Image Processing** | UIKit (resize, JPEG compression) |
| **Animations** | SwiftUI native animations |
| **Architecture** | MVVM |

### Next.js Web

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 with App Router |
| **Language** | TypeScript |
| **UI Library** | Tailwind CSS v4, Radix UI |
| **State Management** | Zustand |
| **Database** | Supabase (PostgreSQL with RLS) |
| **AI Service** | Claude Vision API (Anthropic) |
| **Image Processing** | Browser Canvas API |
| **Animations** | Framer Motion |
| **Deployment** | Vercel |

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

### Current (Next.js Web)

✅ **Web Access**
- Play quizzes in browser
- Headway-inspired modern design
- Responsive (desktop sidebar + mobile bottom nav)
- Dark mode support

✅ **Cloud Backend**
- Supabase PostgreSQL database
- Image storage in Supabase Storage
- Server-side API proxying

### Planned Features

📋 **Enhanced Features**
- User authentication (Supabase Auth)
- Quiz attempt history
- Detailed analytics
- Custom quiz creation
- Study streaks
- Cross-device sync

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

### Phase 1: iOS Native App ✅ (Complete)
- [x] Core Data models
- [x] Claude Vision API integration
- [x] Smart topic classification
- [x] Multiple question types
- [x] Quiz gameplay UI
- [x] Progress tracking
- [x] Camera capture flow
- [x] End-to-end polish

### Phase 2: Next.js Web App ✅ (Complete)
- [x] Next.js 16 project setup
- [x] Supabase backend
- [x] Component library (Radix UI)
- [x] Web deployment ready (Vercel)
- [x] Responsive design
- [x] Dark mode support

### Phase 3: Enhanced Features 🚧 (In Progress)
- [ ] User authentication (Supabase Auth)
- [ ] Quiz attempt history
- [ ] Detailed analytics dashboard
- [ ] Custom quiz creation
- [ ] Study streaks and gamification
- [ ] Social features (share quizzes)
- [ ] Export to PDF

### Phase 4: Production 🔮 (Planned)
- [ ] iOS App Store submission
- [ ] Web app production deployment
- [ ] User onboarding flow
- [ ] Performance monitoring
- [ ] User feedback collection

---

## Cost Structure

### Development
- **Claude API**: ~$0.03-0.04 per quiz
- **Supabase** (Web): Free tier (500MB storage, 2GB bandwidth)
- **Vercel** (Web): Free tier (hobby projects)

### Per User (Web)
- **Storage**: ~1-2 MB per homework (images in Supabase Storage)
- **Database**: ~10 KB per homework (metadata + quiz in PostgreSQL)
- **API**: Variable based on quiz generation frequency

See [docs/00-OVERVIEW.md](./docs/00-OVERVIEW.md) for more details.

---

## License

This project is currently unlicensed. All rights reserved.

---

## Acknowledgments

- **Claude API** by Anthropic for powerful vision-based quiz generation
- **SwiftUI** by Apple for beautiful native iOS UI
- **Next.js** by Vercel for modern web framework
- **Supabase** for backend infrastructure
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives

---

## Contact

**Repository**: [github.com/ivovos/cheater](https://github.com/ivovos/cheater)

For bugs, feature requests, or questions, please open an issue on GitHub.

---

## Next Steps

### For Production
1. Deploy web app to Vercel
2. Submit iOS app to App Store
3. Implement user authentication
4. Add analytics and monitoring
5. Beta testing with students

### For Contributors
1. Review [CLAUDE.MD](./CLAUDE.MD) for project guidelines
2. Check [docs/00-OVERVIEW.md](./docs/00-OVERVIEW.md) for architecture overview
3. Follow design system in [docs/04-DESIGN-SYSTEM.md](./docs/04-DESIGN-SYSTEM.md)
4. Test both iOS and Web implementations

**Start here**: [CLAUDE.MD](./CLAUDE.MD)
