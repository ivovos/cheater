# User Flows

Complete user journeys and interaction patterns for all major features.

## Flow Overview

1. **Camera Capture Flow** - Take photo → Generate quiz → Navigate to quiz
2. **Quiz Gameplay Flow** - Answer questions → Get feedback → Complete
3. **Results & Review Flow** - View score → Play again or exit
4. **Homework Management** - Browse → Detail → Delete

---

## 1. Camera Capture Flow

### User Journey

```
[Homework List] → Tap + button
    ↓
[Source Picker] → Choose "Take Photo" or "Choose from Library"
    ↓
[Camera/Library] → Capture or select image
    ↓
[Image Preview] → Confirm or retake
    ↓
[Processing (AI)] → 2-3 seconds
    ↓
[Quiz Ready] → Auto-navigate to QuizView
    ↓
[Play Quiz]
```

### Detailed Steps

#### Step 1: Trigger Capture
- **Screen**: HomeworkListView
- **Action**: User taps floating "+" button (bottom-right)
- **Haptic**: Light impact
- **Transition**: Sheet modal slides up from bottom (0.3s)

#### Step 2: Source Selection
- **Screen**: CaptureFlowView (Source Picker)
- **Layout**:
  ```
  Camera icon (60pt)
  "Capture Your Homework"
  "Take a photo or choose from library"
  
  [Take Photo] button (camera icon)
  [Choose from Library] button (photo icon)
  ```
- **Actions**:
  - Tap "Take Photo" → Opens camera
  - Tap "Choose from Library" → Opens photo library
  - Swipe down / tap Cancel → Dismiss modal

#### Step 3: Image Capture/Selection
- **Camera**:
  - Native iOS camera interface
  - Tap shutter to capture
  - Return to preview
- **Library**:
  - Native iOS photo picker
  - Select image
  - Return to preview

#### Step 4: Image Preview
- **Screen**: CaptureFlowView (Preview)
- **Layout**:
  ```
  [Image preview - scrollable]
  
  [Use This Photo] button (checkmark, primary)
  [Retake] button (arrow, secondary)
  ```
- **Actions**:
  - Tap "Use This Photo" → Start AI processing
  - Tap "Retake" → Back to source picker

#### Step 5: AI Processing
- **Screen**: ProcessingView (overlay)
- **Timeline**:
  ```
  0.0s: Show overlay with blur backdrop
  0.0s: Display "Analyzing Homework..." + spinner
  0.5s: Image uploaded and processing
  2.0s: AI response received
  2.5s: Parsing and validation
  3.0s: Save to database
  3.2s: Show "Quiz Ready!" with checkmark
  4.2s: Auto-navigate to QuizView
  ```
- **Visual States**:
  1. **Generating** (0-3s):
     - Icon: brain
     - Title: "Analyzing Homework"
     - Message: "Claude is reading your homework..."
     - Spinner: rotating
  2. **Saving** (3-3.2s):
     - Icon: square.and.arrow.down
     - Title: "Saving Quiz"
     - Message: "Almost done..."
  3. **Complete** (3.2-4.2s):
     - Icon: checkmark.circle.fill (green)
     - Title: "Quiz Ready!"
     - Message: "Your quiz is ready to play"

#### Step 6: Navigation to Quiz
- **Transition**: Push navigation from right (0.3s)
- **Destination**: QuizView
- **Initial State**:
  - Question 1 of 10
  - Progress: 10%
  - No answer selected

### Error Handling

**Scenario 1: No API Key**
- Show alert: "Configuration Error"
- Message: "API key is missing"
- Action: Dismiss capture flow

**Scenario 2: Network Error**
- Show alert: "Connection Failed"
- Message: "Could not connect to AI service"
- Actions: "Try Again" or "Cancel"

**Scenario 3: Timeout**
- Show alert: "Request Timeout"
- Message: "The request took too long"
- Suggestion: "Try taking a clearer photo"

**Scenario 4: Invalid Response**
- Show alert: "Quiz Generation Failed"
- Message: "Could not generate quiz from this image"
- Suggestion: "Try different homework or clearer photo"

---

## 2. Quiz Gameplay Flow

### User Journey

```
[QuizView] → Question 1
    ↓
[Select Answer] → Immediate feedback
    ↓
[Read Explanation] → Tap "Next Question"
    ↓
[Repeat for Q2-Q9]
    ↓
[Question 10] → Tap "Finish Quiz"
    ↓
[QuizResultsView] → View score and stats
```

### Question Types Flow

#### MCQ (Multiple Choice)

```
Display 4 options (A, B, C, D)
    ↓
User taps option B
    ↓
Haptic feedback (light impact)
    ↓
Button animation (scale 0.95 → 1.0)
    ↓
Wait 100ms
    ↓
Show feedback:
- If correct: Green background, checkmark icon, success haptic
- If wrong: Red background, xmark icon, error haptic
    ↓
Display explanation below
    ↓
Enable "Next Question" button
```

**Visual States:**
1. **Normal**: White background, gray border
2. **Pressed**: Scale 0.95, reduced shadow
3. **Selected**: Blue border, highlighted
4. **Correct**: Green background, green border, checkmark
5. **Wrong**: Red background, red border, xmark

#### Fill-in-Blank

```
Display text field
    ↓
User types answer
    ↓
Enable "Submit" button (when text.length > 0)
    ↓
User taps "Submit"
    ↓
Check answer (case-insensitive, exact match)
    ↓
Show feedback:
- Display user answer
- Display correct answer
- Color code (green if match, red if not)
    ↓
Enable "Next Question" button
```

#### Short Answer

```
Display text editor (multi-line)
    ↓
User types answer
    ↓
Enable "Submit" button (when text.length > 0)
    ↓
User taps "Submit"
    ↓
Check answer (lenient: contains key concepts)
    ↓
Show feedback:
- Display user answer block
- Display model answer block
- Color code correct/incorrect
    ↓
Enable "Next Question" button
```

### Navigation Controls

#### Next Question
- **Enabled**: After answering current question
- **Action**: Advance to next question
- **Animation**: Slide left (0.3s)
- **Last question**: Button text changes to "Finish Quiz"

#### Skip Question
- **Enabled**: Before answering
- **Action**: Record as incorrect, advance to next
- **Confirmation**: None (quick skip)

#### Exit Quiz
- **Trigger**: Tap back button or swipe from left
- **Confirmation**: Alert dialog
  - Title: "Exit Quiz?"
  - Message: "Your progress will be lost"
  - Actions: "Cancel" | "Exit" (destructive)

### Progress Tracking

**Live Updates:**
- Progress bar: 10% → 20% → ... → 100%
- Question counter: "Question 1 of 10" → "Question 2 of 10"
- Time tracking: Start on first question

---

## 3. Results & Review Flow

### Quiz Completion

```
User answers question 10
    ↓
Calculate score and time
    ↓
Update progress in database
    ↓
Animate to results screen (0.5s fade + scale)
    ↓
Show QuizResultsView
```

### Results Display Timeline

```
0.0s: Screen appears with fade-in
0.2s: Grade emoji appears (scale in)
0.4s: Circular progress animates (1s duration)
1.4s: Stats cards slide in
1.8s: Action buttons appear
2.0s: Confetti (if 90%+)
```

### Results Breakdown

**Header:**
- Emoji (80pt): 🎉 | 👍 | 👌 | 💪
- Grade message:
  - 90-100%: "🎉 Excellent!"
  - 70-89%: "👍 Great Job!"
  - 50-69%: "👌 Good Effort!"
  - 0-49%: "💪 Keep Practicing!"

**Circular Progress:**
- Animates from 0% to actual percentage
- Color based on score:
  - 90%+: Green
  - 70%+: Blue
  - 50%+: Orange
  - <50%: Red
- Center text: "8/10" and "80%"

**Stats Cards:**
```
✓ Correct: 8 questions (green)
✗ Wrong: 2 questions (red)
⏱ Time: 2:34 (blue)
```

**Actions:**
1. **Play Again**:
   - Primary button
   - Action: Reset quiz, navigate to QuizView Q1
   - Records new attempt

2. **Done**:
   - Secondary button
   - Action: Navigate back to homework list
   - Updates progress

### Progress Update Logic

```typescript
// Update homework progress
const percentage = (score / 10) * 100;

progress.totalAttempts += 1;
progress.lastPlayedAt = now();
progress.bestScore = Math.max(progress.bestScore, score);
progress.completionPercentage = Math.max(
  progress.completionPercentage,
  percentage
);

save(progress);
```

---

## 4. Homework Management Flow

### Browsing Homework

**Screen**: HomeworkListView

**Sorting**: Newest first (createdAt DESC)

**Card Information**:
- Title (e.g., "Maths - Algebra")
- Subject badge
- Created date
- Progress bar + percentage
- Best score (if attempted)
- Attempt count

**Actions**:
- Tap card → Navigate to detail
- Long press → Show context menu (Delete)
- Swipe left → Delete action (iOS)
- Pull down → Refresh list

### Homework Detail

**Screen**: HomeworkDetailView

**Information Displayed**:
```
[Image Preview] (200px tall)

📚 Subject: Mathematics
📅 Added: November 6, 2024
⏰ Last played: 2 hours ago

[Progress Card]
Progress: 80%
────────────────
Best Score: 8/10
Attempts: 3

[Start Quiz] button
```

**Actions**:
1. **Start Quiz**:
   - Primary button
   - Text changes based on attempts:
     - 0 attempts: "Start Quiz"
     - 1+ attempts: "Play Again"
   - Opens QuizView (full-screen cover)

2. **Delete**:
   - Trash icon in toolbar
   - Confirmation alert
   - Cascade deletes quiz and progress

### Delete Confirmation

```
Alert:
  Title: "Delete Homework?"
  Message: "This will delete the homework, quiz, and all progress."
  Actions:
    - "Cancel" (default)
    - "Delete" (destructive, red)
```

---

## Interaction Patterns

### Gestures

**Swipe**:
- Right edge → Back navigation
- Down on modal → Dismiss
- Left on list item → Delete (iOS)

**Long Press**:
- Homework card → Context menu
- Answer button → No action (prevent accidents)

**Tap**:
- Buttons → Haptic + action
- Cards → Navigate
- Outside modal → Dismiss

### Haptic Feedback Map

| Action | Feedback Type |
|--------|--------------|
| Button press | Light impact |
| Correct answer | Success notification |
| Wrong answer | Error notification |
| Quiz complete | Success (if 90%+) or Warning |
| Delete | Medium impact |
| Navigation | Light impact |
| Text input focus | Selection |

### Loading States

**Initial Load**:
- Show skeleton screens
- Animate in when data loads

**Refresh**:
- Pull-to-refresh spinner
- Brief haptic when triggered

**Empty States**:
- Icon + message + action
- "No homework yet! Tap + to add."

---

## Animation Specifications

### Page Transitions

**Push** (Forward navigation):
```
Current screen slides left 100%
New screen slides in from right (0% → 100%)
Duration: 0.3s
Easing: ease-in-out
```

**Pop** (Back navigation):
```
Current screen slides right 100%
Previous screen reveals from left
Duration: 0.3s
Easing: ease-in-out
```

**Modal** (Sheet presentation):
```
Backdrop fades in (0 → 0.4 opacity)
Sheet slides up from bottom
Duration: 0.4s
Spring: damping 0.7
```

### Component Animations

**Button Press**:
```
Scale: 1.0 → 0.95 → 1.0
Duration: 0.1s + 0.2s
Spring: damping 0.6
```

**Card Appearance**:
```
Opacity: 0 → 1
TranslateY: 20px → 0
Duration: 0.3s
Delay: index × 0.05s (stagger)
```

**Progress Ring**:
```
StrokeDashoffset: full → percentage
Duration: 1.0s
Easing: ease-out
```

---

## Error Recovery Flows

### Network Reconnection

```
User offline → Attempt quiz generation
    ↓
Show error: "No internet connection"
    ↓
User connects to wifi
    ↓
Show "Connected" toast
    ↓
Auto-retry failed operation
```

### API Quota Exceeded

```
User generates quiz → API returns 429
    ↓
Show error: "Rate limit reached"
    ↓
Message: "Please wait 5 minutes"
    ↓
Store homework without quiz
    ↓
Retry button (manual retry after delay)
```

### Invalid Image

```
User selects blurry/dark image → AI cannot process
    ↓
Show error: "Could not read homework"
    ↓
Suggestion: "Try a clearer photo with better lighting"
    ↓
Return to source picker
```

---

## Accessibility Flows

### VoiceOver Support

**Navigation**:
- All buttons have labels
- Images have descriptions
- Progress announcements

**Quiz Gameplay**:
- Announce question number
- Read question text
- Read answer options
- Announce feedback (correct/incorrect)

**Results**:
- Announce score
- Read stats breakdown

### Dynamic Type

- All text scales with user preference
- Minimum 17pt for body text
- Layouts adapt to larger text

---

## Next Steps

- [UI Components](./05-UI-COMPONENTS.md) - Component specs
- [Design System](./04-DESIGN-SYSTEM.md) - Animation timings
- [Migration Guide](./08-MIGRATION-GUIDE.md) - Implementation guide
