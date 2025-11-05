# cheater
**Turn homework into fun quizzes**

An iOS app that captures homework images, extracts text with OCR, generates interactive quizzes using AI, and tracks your progress.

---

## Features

- 📷 **Capture homework** via camera or photo library
- 🔍 **OCR text extraction** using Apple Vision
- 🤖 **AI quiz generation** with Claude API
- 🎮 **Interactive quizzes** with immediate feedback
- 📊 **Progress tracking** with stats and scores
- 🎨 **Native iOS design** with Dark Mode support

---

## Requirements

- **macOS**: Sonoma 14.0+ (for Xcode 15)
- **Xcode**: 15.0+
- **iOS**: 16.7.10+ (minimum), 26.0 (target)
- **Device**: iPhone 8 or later
- **Claude API Key**: For quiz generation (optional for testing)

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ivovos/cheater.git
cd cheater
```

### 2. Open in Xcode

```bash
cd Cheater-iOS
open Cheater-iOS.xcodeproj
```

### 3. Configure API Key (Optional)

For quiz generation to work, you need a Claude API key:

```bash
# Copy the example config
cp Cheater-iOS/Config.example.plist Cheater-iOS/Config.plist

# Edit Config.plist and add your API key
# <key>ANTHROPIC_API_KEY</key>
# <string>your-api-key-here</string>
```

**Note:** Config.plist is gitignored and won't be committed.

### 4. Build and Run

1. Select your target device/simulator (iPhone 15 Pro recommended)
2. Press **⌘R** to build and run
3. The app will launch with sample homework data

---

## Project Structure

```
Cheater-iOS/
├── App/
│   └── Cheater_iOSApp.swift          # App entry point
├── Models/
│   ├── Homework.swift                # Homework domain model
│   ├── Quiz.swift                    # Quiz domain model
│   └── Question.swift                # Question model
├── ViewModels/
│   ├── HomeworkListViewModel.swift   # List screen logic
│   └── QuizViewModel.swift           # Quiz gameplay logic
├── Views/
│   ├── Homework/
│   │   ├── HomeworkListView.swift    # Main list screen
│   │   └── HomeworkDetailView.swift  # Homework detail
│   ├── Quiz/
│   │   ├── QuizView.swift            # Quiz gameplay
│   │   └── QuizResultsView.swift     # Results screen
│   └── Components/
│       ├── HomeworkCardView.swift    # Card component
│       ├── AnswerButton.swift        # Quiz answer button
│       └── FeedbackView.swift        # Answer feedback
├── Services/
│   ├── OCRService.swift              # Text extraction
│   └── AIService.swift               # Quiz generation
├── CoreData/
│   ├── Persistence.swift             # Core Data controller
│   └── Cheater_iOS.xcdatamodeld      # Data model
└── Design/
    └── DesignTokens.swift            # Design system
```

---

## Architecture

**Pattern:** MVVM (Model-View-ViewModel)

- **Models:** Domain models (Homework, Quiz, Question)
- **Views:** SwiftUI views (declarative UI)
- **ViewModels:** Business logic and state management
- **Services:** Reusable services (OCR, AI, Storage)

**Data Storage:** Core Data (local, single user)

**Key Technologies:**
- SwiftUI for UI
- Apple Vision for OCR
- Claude API for AI quiz generation
- Core Data for persistence
- Combine for reactive state

---

## Current Status

### ✅ Completed (60%)
- Foundation and architecture
- Core Data models
- OCR and AI services
- Homework list UI
- Quiz gameplay UI
- Results screen
- Progress tracking
- Dark mode support

### 🚧 In Progress (40%)
- Camera capture flow
- Image processing
- End-to-end integration
- Error handling
- Loading states

See [PROGRESS_REPORT.md](PROGRESS_REPORT.md) for detailed status.

---

## Usage

### Playing with Sample Data

The app comes with sample homework data:

1. **Launch app** → See 3 sample homework items
2. **Tap any homework** → View details
3. **Tap "Start Quiz"** → Play 10-question quiz
4. **Answer questions** → Get immediate feedback
5. **Complete quiz** → See your score and stats

### Adding New Homework (Coming Soon)

1. Tap **+** button
2. Choose camera or photo library
3. Capture homework image
4. Review and confirm
5. Wait for quiz generation (10-15 seconds)
6. Start playing!

---

## Testing

### Unit Tests

```bash
# Run tests
⌘U in Xcode

# Or via command line
xcodebuild test -scheme Cheater-iOS -destination 'platform=iOS Simulator,name=iPhone 15'
```

### UI Tests

```bash
# Coming soon
```

### Manual Testing

- Test on iPhone 11 (iOS 16.7.10) - minimum version
- Test on iPhone 15 Pro (iOS 26) - target version
- Test in both Light and Dark mode
- Test with various homework types

---
