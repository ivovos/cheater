# Homework Helper MVP - Project Plan
**Linear-Style Project Management**

---

## Project Overview

**Project Name:** Homework Helper
**Version:** MVP Phase 1 (Proof of Concept)
**Timeline:** 1-2 days focused work
**Goal:** Functional iOS app that captures homework images, extracts text, generates quizzes with AI, and enables quiz playback
**Auth:** None (local-only, single user)
**Storage:** Core Data (local)

---

## Status Legend

- 🔲 **Todo** - Not started
- 🔄 **In Progress** - Currently working on
- ✅ **Done** - Completed
- ⏸️ **Blocked** - Waiting on dependency
- ⚠️ **Needs Review** - Requires testing/validation

---

## Phase 1: Foundation (Est. 1 hour)

### Epic 1.1: Project Architecture Setup

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| F-001 | Create MVVM folder structure | ✅ | 10m | Dev | None |
| F-002 | Create DesignTokens.swift with semantic design system | ✅ | 20m | Dev | None |
| F-003 | Move existing files to proper folders | 🔲 | 10m | Dev | F-001 |
| F-004 | Update Xcode project file references | 🔲 | 10m | Dev | F-003 |
| F-005 | Create .gitignore for Config.plist and secrets | 🔲 | 5m | Dev | None |

**Deliverable:** Clean MVVM project structure with design system foundation
**Acceptance Criteria:**
- ✅ All folders exist: Models, Views, ViewModels, Services, CoreData, Design
- ✅ DesignTokens.swift contains all color, typography, spacing constants
- ✅ Project builds successfully

---

## Phase 2: Data Layer (Est. 1 hour)

### Epic 2.1: Core Data Setup

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| D-001 | Update .xcdatamodeld with HomeworkEntity | 🔲 | 15m | Dev | None |
| D-002 | Add QuizEntity to Core Data model | 🔲 | 10m | Dev | D-001 |
| D-003 | Add ProgressEntity to Core Data model | 🔲 | 10m | Dev | D-001 |
| D-004 | Create Homework.swift model | 🔲 | 10m | Dev | D-001 |
| D-005 | Create Quiz.swift model | 🔲 | 10m | Dev | D-002 |
| D-006 | Create Question.swift model | 🔲 | 5m | Dev | D-002 |
| D-007 | Update PersistenceController with helper methods | 🔲 | 10m | Dev | D-001 |

**Deliverable:** Complete Core Data stack for local storage
**Acceptance Criteria:**
- ✅ Core Data model contains all entities with proper relationships
- ✅ Swift models match Core Data entities
- ✅ Can save and fetch data from Core Data

---

## Phase 3: OCR Service (Est. 1 hour)

### Epic 3.1: Text Extraction

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| O-001 | Create OCRService.swift with Vision framework | 🔲 | 20m | Dev | None |
| O-002 | Implement extractText(from: UIImage) method | 🔲 | 15m | Dev | O-001 |
| O-003 | Add error handling for OCR failures | 🔲 | 10m | Dev | O-002 |
| O-004 | Add image quality validation | 🔲 | 10m | Dev | O-002 |
| O-005 | Test OCR with sample homework images | 🔲 | 15m | Dev | O-002 |

**Deliverable:** Working OCR service using Apple Vision
**Acceptance Criteria:**
- ✅ Can extract text from clear homework images
- ✅ Returns error for images with no text
- ✅ Handles low-quality images gracefully

---

## Phase 4: Camera & Image Capture (Est. 1.5 hours)

### Epic 4.1: Image Capture Flow

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| C-001 | Add camera/photo permissions to Info.plist | 🔲 | 5m | Dev | None |
| C-002 | Create CameraView.swift (UIKit wrapper) | 🔲 | 20m | Dev | C-001 |
| C-003 | Create PhotoPickerView.swift | 🔲 | 15m | Dev | C-001 |
| C-004 | Create CameraViewModel.swift | 🔲 | 20m | Dev | C-002 |
| C-005 | Add permission handling logic | 🔲 | 10m | Dev | C-004 |
| C-006 | Implement image optimization (resize/compress) | 🔲 | 15m | Dev | C-004 |
| C-007 | Create image preview screen | 🔲 | 15m | Dev | C-002 |
| C-008 | Add retake/use buttons to preview | 🔲 | 10m | Dev | C-007 |

**Deliverable:** Complete image capture flow
**Acceptance Criteria:**
- ✅ Can capture image via camera
- ✅ Can select image from photo library
- ✅ Shows permission prompts if needed
- ✅ Images are optimized before processing
- ✅ Preview screen shows captured image with retake/use options

---

## Phase 5: AI Quiz Generation (Est. 1.5 hours)

### Epic 5.1: Claude API Integration

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| A-001 | Create Config.plist for API keys | 🔲 | 5m | Dev | None |
| A-002 | Add Config.plist to .gitignore | 🔲 | 2m | Dev | A-001 |
| A-003 | Create AIService.swift | 🔲 | 15m | Dev | None |
| A-004 | Implement generateQuiz(from: String) method | 🔲 | 30m | Dev | A-003 |
| A-005 | Design Claude prompt for quiz generation | 🔲 | 20m | Dev | A-004 |
| A-006 | Add JSON parsing for Claude response | 🔲 | 15m | Dev | A-004 |
| A-007 | Add error handling for API failures | 🔲 | 10m | Dev | A-004 |
| A-008 | Create mock quiz for offline testing | 🔲 | 10m | Dev | A-003 |
| A-009 | Test quiz generation with sample text | 🔲 | 15m | Dev | A-004 |

**Deliverable:** Working AI service for quiz generation
**Acceptance Criteria:**
- ✅ Can call Claude API with OCR text
- ✅ Returns properly formatted quiz (10 questions, 4 options each)
- ✅ Handles API failures gracefully
- ✅ Mock quiz available for testing without API

---

## Phase 6: Homework List & Display (Est. 1.5 hours)

### Epic 6.1: Homework Library

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| H-001 | Create HomeworkListView.swift | 🔲 | 20m | Dev | D-007 |
| H-002 | Create HomeworkListViewModel.swift | 🔲 | 20m | Dev | H-001, D-007 |
| H-003 | Create HomeworkCardView.swift component | 🔲 | 25m | Dev | H-001 |
| H-004 | Add empty state view | 🔲 | 15m | Dev | H-001 |
| H-005 | Add floating + button for new homework | 🔲 | 10m | Dev | H-001 |
| H-006 | Implement delete homework functionality | 🔲 | 15m | Dev | H-002 |
| H-007 | Add navigation to homework detail | 🔲 | 10m | Dev | H-001 |

**Deliverable:** Functional homework library view
**Acceptance Criteria:**
- ✅ Displays list of saved homework items
- ✅ Shows empty state when no homework
- ✅ Can tap + to add new homework
- ✅ Can delete homework items
- ✅ Shows thumbnail, title, date, progress, best score on cards

---

## Phase 7: Capture Flow Integration (Est. 1 hour)

### Epic 7.1: End-to-End Capture

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| CF-001 | Create CaptureFlowViewModel.swift | 🔲 | 20m | Dev | C-004, O-001, A-003 |
| CF-002 | Wire camera → OCR pipeline | 🔲 | 10m | Dev | CF-001 |
| CF-003 | Wire OCR → AI pipeline | 🔲 | 10m | Dev | CF-001 |
| CF-004 | Wire AI → Core Data save | 🔲 | 10m | Dev | CF-001 |
| CF-005 | Create ProcessingView.swift for loading states | 🔲 | 20m | Dev | CF-001 |
| CF-006 | Add progress indicators for each step | 🔲 | 10m | Dev | CF-005 |

**Deliverable:** Complete capture workflow
**Acceptance Criteria:**
- ✅ Capture image → extract text → generate quiz → save to database
- ✅ Shows loading states at each step
- ✅ Handles errors at any step gracefully
- ✅ Returns to homework list on success

---

## Phase 8: Quiz Playing (Est. 2 hours)

### Epic 8.1: Quiz Gameplay

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| Q-001 | Create QuizView.swift | 🔲 | 25m | Dev | D-005 |
| Q-002 | Create QuizViewModel.swift | 🔲 | 25m | Dev | Q-001 |
| Q-003 | Create AnswerButton.swift component | 🔲 | 20m | Dev | Q-001 |
| Q-004 | Implement answer selection logic | 🔲 | 15m | Dev | Q-002 |
| Q-005 | Create FeedbackView.swift for correct/wrong answers | 🔲 | 20m | Dev | Q-001 |
| Q-006 | Add progress bar to quiz view | 🔲 | 10m | Dev | Q-001 |
| Q-007 | Implement skip question functionality | 🔲 | 10m | Dev | Q-002 |
| Q-008 | Add timer tracking (optional) | 🔲 | 10m | Dev | Q-002 |
| Q-009 | Calculate final score | 🔲 | 10m | Dev | Q-002 |

**Deliverable:** Interactive quiz gameplay
**Acceptance Criteria:**
- ✅ Displays questions one at a time
- ✅ Shows 4 answer options (A, B, C, D)
- ✅ Provides immediate feedback on answer selection
- ✅ Shows explanation for correct answer
- ✅ Tracks progress through quiz
- ✅ Can skip questions
- ✅ Calculates final score

---

## Phase 9: Quiz Results (Est. 45 minutes)

### Epic 9.1: Results Display

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| R-001 | Create QuizResultsView.swift | 🔲 | 20m | Dev | Q-002 |
| R-002 | Add score display (X/10, percentage) | 🔲 | 10m | Dev | R-001 |
| R-003 | Add circular progress animation | 🔲 | 15m | Dev | R-001 |
| R-004 | Add score-based messaging | 🔲 | 10m | Dev | R-001 |
| R-005 | Add action buttons (Review, Play Again, Done) | 🔲 | 10m | Dev | R-001 |
| R-006 | Save quiz attempt to Core Data | 🔲 | 10m | Dev | R-001, D-007 |
| R-007 | Update best score if new high score | 🔲 | 10m | Dev | R-006 |

**Deliverable:** Quiz results screen
**Acceptance Criteria:**
- ✅ Shows final score (X/10 and percentage)
- ✅ Displays time taken
- ✅ Shows score-based message (Great Job!, Keep Practicing!, etc.)
- ✅ Animates circular progress ring
- ✅ Saves attempt to database
- ✅ Updates best score if applicable

---

## Phase 10: Homework Detail (Est. 45 minutes)

### Epic 10.1: Detail View

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| HD-001 | Create HomeworkDetailView.swift | 🔲 | 20m | Dev | D-004 |
| HD-002 | Display homework image preview | 🔲 | 10m | Dev | HD-001 |
| HD-003 | Show homework metadata (title, date) | 🔲 | 5m | Dev | HD-001 |
| HD-004 | Display progress stats | 🔲 | 10m | Dev | HD-001 |
| HD-005 | Add "Start Quiz" button | 🔲 | 5m | Dev | HD-001 |
| HD-006 | Add "Play Again" button | 🔲 | 5m | Dev | HD-001 |
| HD-007 | Add collapsible extracted text section | 🔲 | 10m | Dev | HD-001 |
| HD-008 | Navigate to quiz on button tap | 🔲 | 5m | Dev | HD-001, Q-001 |

**Deliverable:** Homework detail screen
**Acceptance Criteria:**
- ✅ Shows homework image thumbnail
- ✅ Displays title and date
- ✅ Shows progress (completion %, best score, times played)
- ✅ Can start quiz from this screen
- ✅ Can replay quiz
- ✅ Shows extracted OCR text in collapsible section

---

## Phase 11: Progress Tracking (Est. 45 minutes)

### Epic 11.1: Progress System

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| P-001 | Create ProgressEntity calculations | 🔲 | 15m | Dev | D-003 |
| P-002 | Track completion percentage | 🔲 | 10m | Dev | P-001 |
| P-003 | Track best score | 🔲 | 5m | Dev | P-001 |
| P-004 | Track total attempts | 🔲 | 5m | Dev | P-001 |
| P-005 | Track last played date | 🔲 | 5m | Dev | P-001 |
| P-006 | Display progress on homework cards | 🔲 | 10m | Dev | H-003, P-001 |
| P-007 | Display progress on detail view | 🔲 | 10m | Dev | HD-001, P-001 |

**Deliverable:** Progress tracking system
**Acceptance Criteria:**
- ✅ Tracks how many times each quiz has been played
- ✅ Tracks best score for each quiz
- ✅ Calculates completion percentage
- ✅ Updates progress after each quiz attempt
- ✅ Displays progress visually on cards and detail view

---

## Phase 12: Error Handling & Polish (Est. 1.5 hours)

### Epic 12.1: Error States

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| E-001 | Create ErrorView.swift component | 🔲 | 15m | Dev | None |
| E-002 | Add camera permission denied error | 🔲 | 10m | Dev | E-001, C-004 |
| E-003 | Add OCR failure error handling | 🔲 | 10m | Dev | E-001, O-001 |
| E-004 | Add network/API error handling | 🔲 | 10m | Dev | E-001, A-003 |
| E-005 | Add no text detected error | 🔲 | 10m | Dev | E-001, O-001 |
| E-006 | Add loading states to all async operations | 🔲 | 20m | Dev | All |
| E-007 | Add skeleton screens for lists | 🔲 | 15m | Dev | H-001 |
| E-008 | Add progress indicators for long operations | 🔲 | 10m | Dev | CF-001 |

### Epic 12.2: Haptic Feedback

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| HF-001 | Add haptic feedback to button taps | 🔲 | 10m | Dev | All |
| HF-002 | Add haptic on correct answer | 🔲 | 5m | Dev | Q-002 |
| HF-003 | Add haptic on wrong answer | 🔲 | 5m | Dev | Q-002 |
| HF-004 | Add haptic on quiz completion | 🔲 | 5m | Dev | R-001 |

**Deliverable:** Comprehensive error handling and feedback
**Acceptance Criteria:**
- ✅ All error scenarios have proper UI feedback
- ✅ Loading states shown for all async operations
- ✅ Haptic feedback on all major interactions
- ✅ No silent failures

---

## Phase 13: Animations (Est. 45 minutes)

### Epic 13.1: UI Animations

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| AN-001 | Add card transition animations | 🔲 | 10m | Dev | H-003 |
| AN-002 | Add answer button animations (scale on tap) | 🔲 | 10m | Dev | Q-003 |
| AN-003 | Add shake animation for wrong answer | 🔲 | 10m | Dev | Q-003 |
| AN-004 | Add bounce animation for correct answer | 🔲 | 10m | Dev | Q-003 |
| AN-005 | Add progress bar fill animation | 🔲 | 10m | Dev | Q-001 |
| AN-006 | Add circular progress animation on results | 🔲 | 10m | Dev | R-001 |
| AN-007 | Add confetti for 90%+ scores | 🔲 | 15m | Dev | R-001 |

**Deliverable:** Polished animations throughout app
**Acceptance Criteria:**
- ✅ Smooth transitions between screens
- ✅ Visual feedback on all interactions
- ✅ Celebratory animation for high scores
- ✅ All animations respect reduced motion setting

---

## Phase 14: Testing & Bug Fixes (Est. 2 hours)

### Epic 14.1: Quality Assurance

| ID | Task | Status | Est | Owner | Dependencies |
|----|------|--------|-----|-------|--------------|
| T-001 | Test complete flow: capture → OCR → quiz → results | 🔲 | 20m | Dev | All |
| T-002 | Test error scenarios (bad image, no network, etc.) | 🔲 | 20m | Dev | All |
| T-003 | Test on iOS 16.7.10 device/simulator | 🔲 | 15m | Dev | All |
| T-004 | Test memory usage and leaks | 🔲 | 15m | Dev | All |
| T-005 | Test with various homework types (math, science, etc.) | 🔲 | 20m | Dev | All |
| T-006 | Fix critical bugs | 🔲 | 30m | Dev | T-001-T-005 |
| T-007 | Code cleanup and documentation | 🔲 | 20m | Dev | All |

**Deliverable:** Stable, tested MVP
**Acceptance Criteria:**
- ✅ All core flows work end-to-end
- ✅ No crashes in normal usage
- ✅ Error states tested and working
- ✅ Works on minimum iOS version (16.7.10)
- ✅ No memory leaks
- ✅ Code is clean and documented

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OCR quality poor on handwritten homework | Medium | High | Test with varied images, provide tips for better captures |
| Claude API quota/cost | Low | Medium | Use mock data for testing, monitor usage |
| Quiz quality inconsistent | Medium | High | Refine prompts, add validation for quiz structure |
| iOS 16 compatibility issues | Low | Medium | Test on iOS 16 simulator regularly |
| Core Data migration issues later | Low | Low | Keep schema simple, plan for future migration |

---

## Success Metrics

### MVP Success Criteria
- ✅ Can capture homework image in <30 seconds
- ✅ OCR accuracy >80% on clear printed text
- ✅ Quiz generated in <15 seconds
- ✅ Quiz has 10 valid questions with 4 options each
- ✅ Quiz gameplay is smooth and responsive
- ✅ Progress is saved and persists across app launches
- ✅ No crashes during normal usage
- ✅ App works on iOS 16.7.10+

### Post-MVP Goals
- 🎯 Add user authentication (Supabase)
- 🎯 Add cloud storage and sync
- 🎯 Implement full theming system
- 🎯 Add onboarding flow
- 🎯 Add statistics dashboard
- 🎯 Support multiple subjects
- 🎯 Add spaced repetition
- 🎯 TestFlight beta testing

---

## Current Sprint (Week 1)

**Goal:** Complete Phases 1-7 (Foundation through Capture Flow)
**Due:** Day 1
**Progress:** 2/35 tasks completed (6%)

### Today's Focus
1. ✅ F-001: Folder structure
2. ✅ F-002: Design tokens
3. 🔄 F-003: Move files to folders
4. 🔲 F-004: Update Xcode references
5. 🔲 D-001: Core Data setup

---

## Notes
- Keep commits small and atomic
- Test each feature before moving to next
- Document any design decisions
- Update this plan as we progress
- Celebrate small wins!

---

**Last Updated:** November 4, 2025
**Status:** In Progress
**Next Review:** After Phase 7 completion
