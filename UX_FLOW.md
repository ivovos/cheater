# UX Flow & Design Specification
## iOS Homework Revision App

**Project Name**: Homework Revision Game App
**Version**: 1.0 (MVP)
**Date**: November 4, 2025
**Platform**: iOS (iPhone)
**Design Language**: iOS Native (SwiftUI)

---

## Table of Contents
1. [Design Principles](#design-principles)
2. [Visual Style](#visual-style)
3. [User Flows](#user-flows)
4. [Screen Specifications](#screen-specifications)
5. [Navigation Structure](#navigation-structure)
6. [Interaction Patterns](#interaction-patterns)
7. [States & Feedback](#states--feedback)
8. [Accessibility](#accessibility)
9. [Responsive Design](#responsive-design)

---

## Design Principles

### 1. Simplicity First
- Minimal cognitive load for students
- Clear, uncluttered interfaces
- One primary action per screen
- Progressive disclosure of features

### 2. Student-Friendly
- Large, tappable elements (44pt minimum)
- Clear visual hierarchy
- Encouraging, positive language
- No jargon or complex terms

### 3. Fast & Responsive
- Immediate visual feedback
- Progress indicators for slow operations
- Optimistic UI updates
- Smooth animations (60 FPS)

### 4. Native iOS Feel
- Follow Apple Human Interface Guidelines
- Use SF Symbols for icons
- iOS-standard components and patterns
- Support Dynamic Type and Dark Mode

### 5. Motivating
- Celebrate achievements (high scores)
- Visual progress indicators
- Encouraging empty states
- Positive error messages

---

## Visual Style

### Color Palette

**Primary Colors**:
- **Accent Blue**: `#007AFF` (iOS system blue)
  - Primary buttons, links, highlights
- **Success Green**: `#34C759` (iOS system green)
  - Correct answers, completion
- **Error Red**: `#FF3B30` (iOS system red)
  - Wrong answers, errors
- **Warning Orange**: `#FF9500` (iOS system orange)
  - Alerts, tips

**Neutral Colors**:
- **Background**: `#FFFFFF` (light), `#000000` (dark)
- **Secondary Background**: `#F2F2F7` (light), `#1C1C1E` (dark)
- **Card Background**: `#FFFFFF` (light), `#2C2C2E` (dark)
- **Text Primary**: `#000000` (light), `#FFFFFF` (dark)
- **Text Secondary**: `#3C3C43` (60% opacity)

**Gradients** (optional, for special moments):
- Success: Green to blue gradient
- Achievement: Purple to pink gradient

### Typography

**Font Family**: SF Pro (iOS system font)

**Text Styles**:
- **Large Title**: 34pt, Bold (screen titles)
- **Title**: 28pt, Bold (section headers)
- **Headline**: 17pt, Semibold (card titles, buttons)
- **Body**: 17pt, Regular (main content)
- **Callout**: 16pt, Regular (secondary info)
- **Subheadline**: 15pt, Regular (metadata)
- **Footnote**: 13pt, Regular (captions)

**Dynamic Type**: Support all text sizes (accessibility)

### Icons

**Source**: SF Symbols 3.3+ (iOS 16 compatible)

**Key Icons**:
- `plus.circle.fill` - Add homework
- `camera.fill` - Take photo
- `photo.on.rectangle.angled` - Upload photo
- `doc.text.viewfinder` - Scan document
- `square.and.pencil` - Edit
- `checkmark.circle.fill` - Correct answer
- `xmark.circle.fill` - Wrong answer
- `chart.bar.fill` - Progress
- `person.circle.fill` - Profile
- `list.bullet` - Homework list

### Spacing

**Grid System**: 8pt base unit

- **Tiny**: 4pt
- **Small**: 8pt
- **Medium**: 16pt
- **Large**: 24pt
- **XLarge**: 32pt

### Corner Radius

- **Buttons**: 12pt
- **Cards**: 16pt
- **Modals**: 20pt (top corners only)
- **Images**: 12pt

### Shadows

- **Card Shadow**:
  - Offset: (0, 2)
  - Radius: 8
  - Color: Black 10% opacity
- **Button Pressed**:
  - Offset: (0, 4)
  - Radius: 12
  - Color: Black 15% opacity

---

## User Flows

### Flow 1: First-Time User Onboarding

```
App Launch (First Time)
    ↓
┌─────────────────────────────────┐
│  Welcome Screen                 │
│  - App logo/icon                │
│  - "Welcome to Homework Helper" │
│  - Tagline: "Turn homework into │
│    fun quizzes"                 │
│  - [Get Started] button         │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│  Feature Intro (3 slides)       │
│  Slide 1: Capture                │
│  - Image: Camera illustration   │
│  - "Snap a photo of homework"   │
│  Slide 2: Quiz                   │
│  - Image: Quiz illustration     │
│  - "Play interactive games"     │
│  Slide 3: Progress               │
│  - Image: Chart illustration    │
│  - "Track your learning"        │
│  - [Next] / [Skip] buttons      │
│  - Page indicators (dots)       │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│  Sign Up Screen                 │
│  - Email input field            │
│  - Password input field         │
│  - [Sign Up] button             │
│  - "Already have account?" link │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│  Permission Request             │
│  - Camera permission modal      │
│  - "We need camera access to    │
│    capture your homework"       │
│  - [Allow] / [Don't Allow]      │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│  Main Dashboard (Empty State)   │
│  - "No homework yet!"           │
│  - Illustration: Empty desk     │
│  - "Tap + to add your first     │
│    homework and start learning" │
│  - Floating [+] button          │
└─────────────────────────────────┘
```

**Key Decisions**:
- Keep onboarding to 3 screens max
- Allow skipping intro slides
- Request permissions just-in-time (when needed)

---

### Flow 2: Returning User Login

```
App Launch (Returning User)
    ↓
┌─────────────────────────────────┐
│  Splash Screen (1 second max)   │
│  - App logo/icon                │
│  - Loading indicator            │
└────────────┬────────────────────┘
             ↓
    Check for saved session
             ↓
    ┌────────┴────────┐
    │                 │
Valid Session    No Session
    │                 │
    ↓                 ↓
Dashboard        Login Screen
                      ↓
                 Enter credentials
                      ↓
                  Dashboard
```

**Auto-Login**:
- If valid session token exists → Dashboard
- If expired → Login Screen
- Remember session across app launches

---

### Flow 3: Capture Homework

```
Main Dashboard
    ↓
Tap [+] button
    ↓
┌─────────────────────────────────┐
│  Capture Method Selector        │
│  (Action Sheet / Modal)         │
│                                 │
│  [📷 Take Photo]                │
│  [📄 Scan Document]             │
│  [🖼️  Upload from Photos]       │
│  [Cancel]                       │
└────┬──────┬─────────┬───────────┘
     │      │         │
     │      │         └─────────────────┐
     │      │                           │
     │      └─────────────┐             │
     │                    │             │
     ↓                    ↓             ↓
┌─────────────┐  ┌─────────────┐  ┌────────────┐
│Camera View  │  │Document     │  │Photo       │
│             │  │Scanner      │  │Picker      │
│- Viewfinder │  │(VisionKit)  │  │            │
│- [Capture]  │  │- Auto-detect│  │- Grid view │
│  button     │  │- Multi-page │  │- Select    │
│- Cancel     │  │  (future)   │  │  image     │
└──────┬──────┘  └──────┬──────┘  └─────┬──────┘
       │                │                │
       └────────────────┴────────────────┘
                        │
                        ↓
         ┌──────────────────────────────┐
         │  Image Preview Screen        │
         │  - Full screen preview       │
         │  - [Retake] button (left)    │
         │  - [Use This] button (right) │
         └──────────────┬───────────────┘
                        │
                  Tap [Use This]
                        │
                        ↓
         ┌──────────────────────────────┐
         │  Processing Screen           │
         │  - Progress spinner          │
         │  - "Analyzing homework..."   │
         │  - Progress: "Extracting     │
         │    text..." (OCR)            │
         │  - Progress: "Generating     │
         │    quiz..." (AI)             │
         │  - Estimated: 10-15 seconds  │
         └──────────────┬───────────────┘
                        │
                ┌───────┴────────┐
                │                │
           Success           Error
                │                │
                ↓                ↓
    ┌────────────────┐    ┌──────────────┐
    │Success Message │    │Error Alert   │
    │"Quiz ready!"   │    │"Failed to    │
    │Toast/Banner    │    │ process.     │
    │                │    │ Try again?"  │
    └───────┬────────┘    │[Retry][Cancel]│
            │             └──────────────┘
            ↓
    ┌────────────────────────────────────┐
    │  Homework Detail Screen            │
    │  - Original image preview          │
    │  - Title: "Math Homework" (auto)   │
    │  - Date added                      │
    │  - [Start Quiz] button             │
    └────────────────────────────────────┘
```

**Timing**:
- Image preview: Instant
- OCR processing: 2-5 seconds
- Quiz generation: 5-15 seconds
- Total: 7-20 seconds

**Error Handling**:
- Camera access denied → Explain + Settings link
- Poor image quality → "Image too blurry. Try again?"
- OCR failed → "Couldn't read text. Try clearer image?"
- AI generation failed → "Quiz generation failed. Retry?"

---

### Flow 4: Play Quiz

```
Main Dashboard
    ↓
Tap homework card
    ↓
┌─────────────────────────────────┐
│  Homework Detail Screen         │
│                                 │
│  [Original Image Thumbnail]     │
│                                 │
│  Math Homework                  │
│  Added: Nov 4, 2025             │
│                                 │
│  Progress: 60% ████████░░       │
│  Best Score: 8/10               │
│  Last Played: Yesterday         │
│                                 │
│  [Start Quiz] (large button)    │
│  [Play Again]                   │
│                                 │
│  Extracted Text: (collapsible)  │
│  "Solve the following..."       │
└────────────┬────────────────────┘
             │
      Tap [Start Quiz]
             │
             ↓
┌─────────────────────────────────┐
│  Quiz Screen (Question 1/10)    │
│                                 │
│  ████░░░░░░░░░░░░░░░ (Progress) │
│                                 │
│  Question 1 of 10               │
│                                 │
│  What is the result of          │
│  5 × 6?                         │
│                                 │
│  ┌──────────────────────────┐  │
│  │ A) 25                    │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ B) 30                    │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ C) 35                    │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ D) 40                    │  │
│  └──────────────────────────┘  │
│                                 │
│  [Skip Question]                │
└────────────┬────────────────────┘
             │
      Tap answer (e.g., B)
             │
             ↓
┌─────────────────────────────────┐
│  Quiz Screen (Answer Feedback)  │
│                                 │
│  ████░░░░░░░░░░░░░░░            │
│                                 │
│  Question 1 of 10               │
│                                 │
│  What is the result of          │
│  5 × 6?                         │
│                                 │
│  ┌──────────────────────────┐  │
│  │ A) 25                    │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ ✓ B) 30   [GREEN]        │  │← Selected (correct)
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ C) 35                    │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ D) 40                    │  │
│  └──────────────────────────┘  │
│                                 │
│  ✓ Correct!                     │
│  5 × 6 = 30. Multiplication is  │
│  repeated addition.             │
│                                 │
│  [Next Question]                │
└────────────┬────────────────────┘
             │
      Tap [Next Question]
             │
             ↓
      Repeat for questions 2-9
             │
             ↓
      Question 10 completed
             │
             ↓
┌─────────────────────────────────┐
│  Quiz Results Screen            │
│                                 │
│  🎉 Great Job!                  │
│                                 │
│  Your Score                     │
│  8/10                           │
│  80%                            │
│                                 │
│  [Progress Ring Animation]      │
│                                 │
│  Time Taken: 2m 34s             │
│                                 │
│  ✓ Correct: 8                   │
│  ✗ Wrong: 2                     │
│                                 │
│  [Review Answers]               │
│  [Play Again]                   │
│  [Back to Dashboard]            │
└─────────────────────────────────┘
```

**Interactions**:
- Tap answer → Immediate feedback (color change, checkmark/x)
- Next button appears after feedback shown (1 second)
- Progress bar animates smoothly
- Results screen celebrates high scores (confetti for 90%+)

**Quiz State Management**:
- Track current question index
- Store user answers
- Calculate score in real-time
- Save attempt to database on completion

---

### Flow 5: View Progress & Homework Library

```
Main Dashboard (Tab 1: Homework)
┌─────────────────────────────────┐
│  ☰ Homework                 👤  │
│                                 │
│  Search: [🔍 Search homework]   │
│                                 │
│  Sort: [Most Recent ▼]          │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [Thumbnail]             │   │
│  │ Math Homework           │   │
│  │ Nov 4, 2025             │   │
│  │ Progress: 80% ████████░ │   │
│  │ Best: 8/10              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [Thumbnail]             │   │
│  │ Science Notes           │   │
│  │ Nov 3, 2025             │   │
│  │ Progress: 40% ████░░░░░ │   │
│  │ Best: 6/10              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [Thumbnail]             │   │
│  │ History Essay           │   │
│  │ Nov 1, 2025             │   │
│  │ Progress: 100% ████████ │   │
│  │ Best: 10/10 ⭐          │   │
│  └─────────────────────────┘   │
│                                 │
│           [+] (Floating)        │
└─────────────────────────────────┘
```

```
Main Dashboard (Tab 2: Progress)
┌─────────────────────────────────┐
│  ☰ Progress                 👤  │
│                                 │
│  Overall Progress               │
│  ┌────────────────────────┐    │
│  │  [Circular Progress]   │    │
│  │        73%             │    │
│  │                        │    │
│  │  11 homework items     │    │
│  │  8 completed (100%)    │    │
│  │  3 in progress         │    │
│  └────────────────────────┘    │
│                                 │
│  This Week                      │
│  ┌────────────────────────┐    │
│  │  Quizzes Played: 15    │    │
│  │  Avg Score: 82%        │    │
│  │  Time Studying: 1h 23m │    │
│  └────────────────────────┘    │
│                                 │
│  Recent Quizzes                 │
│  ┌────────────────────────┐    │
│  │ Math Homework          │    │
│  │ 8/10 (80%)             │    │
│  │ Yesterday              │    │
│  └────────────────────────┘    │
│  ┌────────────────────────┐    │
│  │ Science Notes          │    │
│  │ 9/10 (90%)             │    │
│  │ 2 days ago             │    │
│  └────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Empty States**:

```
Homework List (Empty)
┌─────────────────────────────────┐
│  ☰ Homework                 👤  │
│                                 │
│                                 │
│      [Illustration: Book]       │
│                                 │
│  No homework yet!               │
│                                 │
│  Tap the + button below to      │
│  add your first homework and    │
│  start learning.                │
│                                 │
│                                 │
│           [+]                   │
│                                 │
└─────────────────────────────────┘
```

---

### Flow 6: Error & Edge Cases

#### Poor Image Quality
```
Camera → Capture → Processing
    ↓
OCR detects low confidence
    ↓
┌─────────────────────────────────┐
│  ⚠️ Image Quality Alert         │
│                                 │
│  We had trouble reading this    │
│  image. Tips for better results:│
│                                 │
│  • Use good lighting            │
│  • Hold camera steady           │
│  • Make sure text is clear      │
│                                 │
│  [Try Again]  [Use Anyway]      │
└─────────────────────────────────┘
```

#### Network Error
```
Quiz Generation → API Call Fails
    ↓
┌─────────────────────────────────┐
│  ⚠️ Connection Error            │
│                                 │
│  Couldn't generate quiz.        │
│  Check your internet connection │
│  and try again.                 │
│                                 │
│  [Retry]  [Cancel]              │
└─────────────────────────────────┘
```

#### No Text Found
```
OCR → Empty Result
    ↓
┌─────────────────────────────────┐
│  ℹ️ No Text Detected            │
│                                 │
│  We couldn't find any text in   │
│  this image. Please make sure   │
│  your homework has clear,       │
│  readable text.                 │
│                                 │
│  [Try Another Image]  [Cancel]  │
└─────────────────────────────────┘
```

---

## Screen Specifications

### 1. Main Dashboard (Homework List)

**Layout**: Vertical ScrollView with Cards

**Components**:
- Navigation Bar
  - Title: "Homework"
  - Right: Profile icon button
- Search Bar (optional for MVP)
- Sort/Filter Controls
  - Dropdown: "Most Recent", "By Subject", "By Progress"
- Homework Cards (LazyVStack)
  - Image Thumbnail (60×60pt, rounded corners)
  - Title (Headline font)
  - Date (Footnote font, secondary color)
  - Progress Bar (custom view, animated)
  - Best Score (if quiz played)
- Floating Action Button (+)
  - Position: Bottom right, 16pt from edges
  - Size: 56×56pt
  - Icon: plus.circle.fill
  - Shadow: Elevated
  - Color: Accent Blue

**States**:
- Empty: Show empty state illustration + message
- Loading: Skeleton cards or progress indicator
- Populated: Show cards
- Error: Error banner at top

**SwiftUI Structure**:
```swift
struct HomeworkListView: View {
    @StateObject var viewModel: HomeworkListViewModel

    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottomTrailing) {
                if viewModel.homework.isEmpty {
                    EmptyStateView()
                } else {
                    ScrollView {
                        LazyVStack(spacing: 16) {
                            ForEach(viewModel.homework) { homework in
                                HomeworkCardView(homework: homework)
                                    .onTapGesture {
                                        viewModel.selectedHomework = homework
                                    }
                            }
                        }
                        .padding()
                    }
                }

                // Floating action button
                Button {
                    viewModel.showCapture = true
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .resizable()
                        .frame(width: 56, height: 56)
                        .foregroundColor(.accentColor)
                }
                .padding()
            }
            .navigationTitle("Homework")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        viewModel.showProfile = true
                    } label: {
                        Image(systemName: "person.circle.fill")
                    }
                }
            }
        }
    }
}
```

---

### 2. Homework Card Component

**Dimensions**: Full width, 120pt height

**Layout**:
```
┌──────────────────────────────────────┐
│ [Thumb] Title          Best: 8/10    │
│  60×60  Nov 4, 2025                  │
│         Progress: 80% ████████░░░░   │
└──────────────────────────────────────┘
```

**Visual Design**:
- Background: Card color (white/dark)
- Corner radius: 16pt
- Shadow: Subtle drop shadow
- Border: None (or 1pt light gray)
- Padding: 12pt internal

**Interaction**:
- Tap: Navigate to homework detail
- Long press (future): Quick actions menu (delete, edit)

**SwiftUI**:
```swift
struct HomeworkCardView: View {
    let homework: Homework

    var body: some View {
        HStack(spacing: 12) {
            // Thumbnail
            AsyncImage(url: URL(string: homework.imageURL)) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                Color.gray.opacity(0.2)
            }
            .frame(width: 60, height: 60)
            .cornerRadius(12)

            // Info
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(homework.title)
                        .font(.headline)
                    Spacer()
                    if let bestScore = homework.bestScore {
                        Text("Best: \(bestScore)/10")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                Text(homework.createdAt, style: .date)
                    .font(.footnote)
                    .foregroundColor(.secondary)

                // Progress bar
                ProgressView(value: homework.progress, total: 1.0)
                    .tint(.accentColor)
                Text("Progress: \(Int(homework.progress * 100))%")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 2)
    }
}
```

---

### 3. Camera Capture Screen

**Fullscreen Modal**

**Components**:
- UIViewControllerRepresentable wrapping UIImagePickerController or VNDocumentCameraViewController
- Controls:
  - Cancel button (top left)
  - Flash toggle (top right, if camera)
  - Capture button (center bottom, large circle)
  - Gallery button (bottom left, thumbnail)

**Native Camera**:
- Use `UIImagePickerController` with `.camera` source type
- Or use `VNDocumentCameraViewController` for document scanning

---

### 4. Quiz Screen

**Fullscreen View**

**Layout**:
```
┌──────────────────────────────────┐
│  ████░░░░░░░░░░░  Question 1/10  │← Progress
│                                  │
│  What is the capital of France?  │← Question
│                                  │
│  ┌────────────────────────────┐ │
│  │ A) London                  │ │← Option A
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ B) Paris                   │ │← Option B
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ C) Berlin                  │ │← Option C
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ D) Madrid                  │ │← Option D
│  └────────────────────────────┘ │
│                                  │
│  [Skip Question]                 │← Skip button
└──────────────────────────────────┘
```

**Answer Button States**:
- **Default**: White background, gray border
- **Selected (before submit)**: Blue border, blue text
- **Correct (after submit)**: Green background, white text, checkmark icon
- **Wrong (after submit)**: Red background, white text, X icon
- **Correct answer (when user wrong)**: Green border, green text

**Animations**:
- Button tap: Scale down slightly (0.95)
- Correct answer: Bounce animation + confetti (if perfect)
- Wrong answer: Shake animation
- Progress bar: Smooth fill animation

**SwiftUI**:
```swift
struct QuizView: View {
    @StateObject var viewModel: QuizViewModel
    @State private var selectedAnswer: Int?
    @State private var showFeedback = false

    var currentQuestion: Question {
        viewModel.questions[viewModel.currentQuestionIndex]
    }

    var body: some View {
        VStack(spacing: 24) {
            // Progress
            VStack(alignment: .leading, spacing: 8) {
                ProgressView(value: Double(viewModel.currentQuestionIndex + 1), total: Double(viewModel.questions.count))
                    .tint(.accentColor)
                Text("Question \(viewModel.currentQuestionIndex + 1) of \(viewModel.questions.count)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }

            // Question
            Text(currentQuestion.question)
                .font(.title2)
                .fontWeight(.semibold)
                .multilineTextAlignment(.center)
                .padding(.vertical)

            // Answer options
            VStack(spacing: 16) {
                ForEach(Array(currentQuestion.options.enumerated()), id: \.offset) { index, option in
                    AnswerButton(
                        text: option,
                        isSelected: selectedAnswer == index,
                        isCorrect: showFeedback && index == currentQuestion.correctIndex,
                        isWrong: showFeedback && selectedAnswer == index && index != currentQuestion.correctIndex
                    ) {
                        selectAnswer(index)
                    }
                }
            }

            // Explanation (after answer)
            if showFeedback {
                FeedbackView(
                    isCorrect: selectedAnswer == currentQuestion.correctIndex,
                    explanation: currentQuestion.explanation
                )
                .transition(.opacity.combined(with: .move(edge: .top)))

                Button("Next Question") {
                    nextQuestion()
                }
                .buttonStyle(.borderedProminent)
                .font(.headline)
            }

            Spacer()

            // Skip button
            if !showFeedback {
                Button("Skip Question") {
                    skipQuestion()
                }
                .foregroundColor(.secondary)
            }
        }
        .padding()
        .animation(.easeInOut, value: showFeedback)
    }

    func selectAnswer(_ index: Int) {
        selectedAnswer = index
        withAnimation {
            showFeedback = true
        }
        viewModel.recordAnswer(index)
    }

    func nextQuestion() {
        selectedAnswer = nil
        showFeedback = false
        viewModel.nextQuestion()
    }

    func skipQuestion() {
        viewModel.skipQuestion()
    }
}
```

---

### 5. Quiz Results Screen

**Centered Modal**

**Layout**:
```
┌──────────────────────────────────┐
│                                  │
│         🎉 Great Job!            │← Emoji (changes based on score)
│                                  │
│         Your Score               │
│           8/10                   │← Large, bold
│           80%                    │
│                                  │
│    [Circular Progress Ring]      │← Animated
│                                  │
│    Time Taken: 2m 34s            │
│                                  │
│    ✓ Correct: 8                  │
│    ✗ Wrong: 2                    │
│                                  │
│  ┌────────────────────────────┐ │
│  │    Review Answers          │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │    Play Again              │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │    Back to Dashboard       │ │
│  └────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

**Score-Based Feedback**:
- 90-100%: "🎉 Excellent!" (confetti animation)
- 70-89%: "👍 Great Job!"
- 50-69%: "👌 Good Effort!"
- <50%: "💪 Keep Practicing!"

**Animations**:
- Circular progress ring animates from 0 to final percentage (1 second)
- Confetti falls for high scores (90%+)
- Score numbers count up

---

### 6. Progress Dashboard

**Tab View**

**Layout**: Stats Cards + Charts

**Components**:
- Overall Progress Card
  - Circular progress indicator (large)
  - Percentage complete
  - Total homework count
  - Completion breakdown
- This Week Card
  - Quizzes played
  - Average score
  - Time studying
- Recent Quizzes List
  - Mini cards with homework title, score, date

**Future Enhancements**:
- Subject breakdown chart
- Streak counter
- Achievement badges

---

## Navigation Structure

### Primary Navigation: Tab Bar

```
┌─────────────────────────────────────┐
│                                     │
│         [Main Content]              │
│                                     │
│                                     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  📚 Homework   📊 Progress   👤 Me  │
└─────────────────────────────────────┘
```

**Tabs** (MVP - 2 tabs, Profile future):
1. **Homework** (list.bullet)
   - Homework list view
   - Default tab
2. **Progress** (chart.bar.fill)
   - Stats and progress overview
3. **Profile** (person.circle) - Optional for MVP
   - User settings
   - Account management

### Secondary Navigation: Navigation Stack

- Homework List → Homework Detail → Quiz
- Progress → (drill-down to specific stats)

### Modal Navigation

- Camera/Upload flow (full screen modal)
- Settings (sheet)
- Alerts and action sheets

---

## Interaction Patterns

### Gestures

**Tap**:
- Select homework card → navigate to detail
- Tap answer option → select answer
- Tap button → perform action

**Swipe** (Future):
- Swipe card left → delete homework
- Swipe card right → mark as complete

**Pull to Refresh**:
- Pull down on homework list → refresh from server

**Long Press** (Future):
- Long press card → show quick actions

### Buttons

**Primary Button** (accent color, filled):
- "Start Quiz"
- "Next Question"
- "Sign Up"

**Secondary Button** (gray, outlined):
- "Play Again"
- "Review Answers"

**Tertiary Button** (text only):
- "Skip Question"
- "Cancel"

**Icon Button**:
- Profile icon
- Add (+) floating button

### Loading States

**Skeleton Screens**:
- Homework list loading → show skeleton cards

**Progress Indicators**:
- Spinner: OCR processing, quiz generation
- Progress bar: Quiz progress, upload progress

**Optimistic Updates**:
- Add homework → show immediately, upload in background

---

## States & Feedback

### Visual Feedback

**Success**:
- Green checkmark
- Success banner (toast)
- Confetti animation (high scores)

**Error**:
- Red X icon
- Alert dialog with explanation
- Shake animation

**Loading**:
- Activity indicator (spinner)
- Progress bar with percentage
- Skeleton UI

**Empty**:
- Illustration + helpful message
- Call-to-action button

### Haptic Feedback

**Light**:
- Button taps
- Selection changes

**Medium**:
- Correct answer
- Quiz completed

**Heavy**:
- Wrong answer
- Error

**Success**:
- Quiz completed with high score

```swift
// Example haptic usage
let generator = UIImpactFeedbackGenerator(style: .medium)
generator.impactOccurred()
```

### Audio Feedback (Optional)

- Correct answer: Ding sound
- Wrong answer: Buzz sound
- Quiz complete: Celebration sound

**Settings**: Allow user to disable sounds

---

## Accessibility

### VoiceOver Support

**All interactive elements**:
- Clear accessibility labels
- Hints for complex interactions
- Meaningful grouping

```swift
Button("Start Quiz") {
    startQuiz()
}
.accessibilityLabel("Start quiz")
.accessibilityHint("Begins a 10-question quiz based on your homework")
```

### Dynamic Type

- Support all text sizes
- Use semantic text styles (.headline, .body, etc.)
- Test with largest text size

### Color Contrast

- Minimum 4.5:1 contrast ratio for text
- Use SF Symbols with automatic weight adjustment
- Avoid color as only differentiator (use icons too)

### Reduce Motion

- Respect `UIAccessibility.isReduceMotionEnabled`
- Provide alternative to animations
- Simplify transitions

```swift
withAnimation(UIAccessibility.isReduceMotionEnabled ? .none : .spring()) {
    showFeedback = true
}
```

### Keyboard Navigation (iPad, future)

- Tab key navigation
- Enter key to activate buttons
- Arrow keys for selection

---

## Responsive Design

### iPhone Screen Sizes

**Compact Width (all iPhones in portrait)**:
- Single column layout
- Full-width cards
- Bottom tab bar

**Regular Width (iPad, future)**:
- Two-column layout
- Sidebar + detail
- Top tab bar

### Safe Areas

- Respect safe area insets (notch, home indicator)
- Use `.safeAreaInset()` modifier
- Don't place critical UI behind notch

### Landscape Mode

**Support** (MVP can be portrait-only):
- Portrait: Optimized, primary experience
- Landscape: Functional but not optimized

### Adapt to Content

```swift
GeometryReader { geometry in
    if geometry.size.width > 600 {
        // iPad layout
        TwoColumnLayout()
    } else {
        // iPhone layout
        SingleColumnLayout()
    }
}
```

---

## Dark Mode Support

**Automatic**:
- Use semantic colors (`.primary`, `.secondary`, `.background`)
- Test in both light and dark modes
- Avoid hardcoded colors

**Color Adaptation**:
```swift
// Automatically adapts
Color(.systemBackground) // White (light), Black (dark)
Color(.label) // Black (light), White (dark)
Color.accentColor // System blue (adapts)
```

**Custom Colors**:
- Define in Asset Catalog with light/dark variants
- Or use adaptive color sets:

```swift
Color("CardBackground")
  // Asset Catalog:
  // Light Appearance: #FFFFFF
  // Dark Appearance: #2C2C2E
```

---

## Animation Guidelines

### Timing

- **Fast** (0.2s): Button taps, selections
- **Medium** (0.3s): View transitions, cards
- **Slow** (0.5s+): Results animations, celebrations

### Easing

- **Spring**: Natural, bouncy (preferred for iOS)
- **Ease In Out**: Smooth, polished
- **Linear**: Progress bars, loaders

```swift
// Spring animation (preferred)
withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
    showView = true
}

// Ease in out
withAnimation(.easeInOut(duration: 0.3)) {
    opacity = 1.0
}
```

### Performance

- Keep animations at 60 FPS
- Avoid animating large images
- Use GPU-accelerated properties (opacity, scale, rotation)

---

## Appendix

### Related Documents
- [PRD.md](./PRD.md) - Product requirements
- [TECH_REQUIREMENTS.md](./TECH_REQUIREMENTS.md) - Technical specifications

### Design Resources
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Symbols App](https://developer.apple.com/sf-symbols/)
- [iOS Design Themes](https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/)

### Tools
- **Figma**: High-fidelity mockups (optional)
- **Xcode Previews**: Live SwiftUI previews
- **SF Symbols**: Icon browsing

---

**Document Status**: Draft v1.0
**Last Updated**: November 4, 2025
**Owner**: UX Designer / Developer
**Next Review**: After creating initial mockups
