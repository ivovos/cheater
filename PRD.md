# Product Requirements Document (PRD)
## iOS Homework Revision App

**Project Name**: Homework Revision Game App
**Version**: 1.0 (MVP)
**Date**: November 4, 2025
**Platform**: iOS (iPhone)
**Target iOS Versions**: iOS 16 - iOS 26+

---

## Table of Contents
1. [Product Vision](#product-vision)
2. [Target User](#target-user)
3. [Problem Statement](#problem-statement)
4. [Product Goals](#product-goals)
5. [Success Metrics](#success-metrics)
6. [Core Features (MVP)](#core-features-mvp)
7. [User Stories](#user-stories)
8. [Feature Requirements](#feature-requirements)
9. [Out of Scope (MVP)](#out-of-scope-mvp)
10. [Future Enhancements](#future-enhancements)
11. [Constraints & Assumptions](#constraints--assumptions)

---

## Product Vision

Create a simple, engaging iOS app that transforms static secondary school homework into interactive revision games. By capturing photos of homework assignments, students can automatically generate quizzes that make learning fun and track their progress over time.

**Mission**: Make homework revision enjoyable and effective for secondary school students through gamification and smart content transformation.

---

## Target User

**Primary User**: Secondary school students (ages 11-16)
- Currently attending secondary school
- Receives regular homework assignments on paper or digital format
- Needs help with revision and exam preparation
- May struggle with traditional revision methods
- Comfortable with mobile technology

**Secondary User**: Parents
- Want to support their child's learning
- May set up the app initially
- Monitor progress and usage

**Initial Focus**: The developer's son (secondary school student with iPhone 11, iOS 16)

---

## Problem Statement

Secondary school students often:
- Find homework revision boring and struggle to stay motivated
- Have difficulty organizing multiple homework assignments
- Lack structured ways to test their knowledge
- Don't know what content to focus on when studying
- Need help retaining information for exams

Traditional revision methods (re-reading notes, highlighting) are passive and less effective than active recall through quizzing.

---

## Product Goals

### Primary Goals
1. **Engagement**: Make homework revision fun through interactive games
2. **Accessibility**: Simple capture/upload of homework from any source
3. **Progress**: Help students track their learning journey
4. **Automation**: Minimize manual work - automatically generate quizzes from homework

### Secondary Goals
- Build healthy revision habits
- Increase retention of homework content
- Reduce exam anxiety through regular practice
- Provide visibility into student progress

---

## Success Metrics

### MVP Success Criteria
- **User Activation**: 80%+ of users complete at least one quiz
- **Retention**: Users return to play quizzes at least 3x per week
- **Technical Performance**:
  - OCR accuracy >85% for printed text
  - Quiz generation success rate >95%
  - App loads in <2 seconds
- **User Satisfaction**: Positive feedback from initial users (developer's son + small test group)

### Key Performance Indicators (KPIs)
- Number of homework items added per user per week
- Average quiz completion rate
- Time spent in app per session
- Quiz retry rate (indicates engagement)
- Daily active users (DAU) / Weekly active users (WAU)

---

## Core Features (MVP)

### 1. User Authentication
- Email/password registration and login
- Secure session management
- Basic profile (name, year group)

### 2. Homework Capture
- **Photo Capture**: Take picture using device camera
- **Upload**: Select existing photo from camera roll
- **Screenshot Upload**: Import screenshots of digital homework
- Preview and confirm captured image

### 3. Text Extraction (OCR)
- Automatic text recognition from captured images
- Support for printed text (primary focus)
- Basic handwriting recognition (best effort)
- Display extracted text for verification

### 4. Interactive Quiz Generation
- AI-powered quiz creation from homework content
- Multiple choice questions (10 questions per quiz)
- Age-appropriate difficulty
- Questions test understanding, not just memorization

### 5. Quiz Gameplay
- Clean, simple quiz interface
- One question at a time
- Multiple choice answers (4 options)
- Immediate feedback on answers (correct/incorrect)
- Show correct answer when wrong
- Score tracking throughout quiz

### 6. Homework Library
- List view of all captured homework
- Each item shows:
  - Title/subject
  - Thumbnail of original image
  - Progress indicator (completion %)
  - Date added
- Tap to view details or start quiz

### 7. Progress Tracking
- Completion percentage per homework item
- Overall progress dashboard
- Quiz history (scores, dates)
- Simple statistics view

### 8. Homework Management
- View homework details
- See original captured image
- Access generated quiz
- Delete homework items

---

## User Stories

### Authentication & Onboarding
- **As a student**, I want to sign up quickly so I can start using the app
- **As a returning user**, I want to log in seamlessly to access my homework library

### Homework Capture
- **As a student**, I want to take a photo of my paper homework so I can create a quiz from it
- **As a student**, I want to upload a screenshot of digital homework so I can revise from any format
- **As a student**, I want to preview my capture before processing to ensure it's clear
- **As a student**, I want the app to automatically detect the homework page to simplify capture

### Quiz Generation & Play
- **As a student**, I want the app to automatically generate questions so I don't have to create them manually
- **As a student**, I want quizzes that test my understanding so I actually learn the material
- **As a student**, I want to play a quiz immediately after capturing homework so I can revise right away
- **As a student**, I want to see if my answers are correct instantly so I can learn from mistakes
- **As a student**, I want to see my score at the end so I know how well I'm doing

### Progress & Organization
- **As a student**, I want to see all my homework in one place so I can choose what to revise
- **As a student**, I want to track my progress on each homework item so I know what I've mastered
- **As a student**, I want to replay quizzes so I can improve my score
- **As a student**, I want to see my overall progress so I stay motivated

---

## Feature Requirements

### FR-1: User Authentication
**Priority**: P0 (Must Have)

**Requirements**:
- Email and password sign up
- Email validation
- Secure password storage (handled by Supabase)
- Login with email/password
- "Remember me" functionality
- Password reset capability (post-MVP enhancement)
- Logout functionality

**Acceptance Criteria**:
- User can create account with valid email and password (min 8 characters)
- User can log in and access their homework library
- User stays logged in across app sessions
- User can log out successfully

---

### FR-2: Homework Capture
**Priority**: P0 (Must Have)

**Requirements**:
- Camera permission request with clear explanation
- Photo library permission request
- Native camera interface
- Ability to take photo using camera
- Ability to select existing photo from library
- Preview captured/selected image
- Confirm or retake option
- Basic image quality check (not too blurry, good lighting)

**Acceptance Criteria**:
- User can grant camera permissions
- User can capture photo of homework clearly
- User can upload photo from library
- User can preview and confirm/retake image
- Captured image is high enough quality for OCR

**Technical Notes**:
- Use native UIImagePickerController or SwiftUI PhotosPicker
- Maximum image size: 2MB (compress if needed)
- Supported formats: JPEG, PNG
- Landscape and portrait orientations supported

---

### FR-3: Text Extraction (OCR)
**Priority**: P0 (Must Have)

**Requirements**:
- Automatic text extraction from images
- Progress indicator during processing
- Display extracted text for user review
- Handle multi-line and formatted text
- Process images within 5 seconds on average
- Minimum 85% accuracy for printed text

**Acceptance Criteria**:
- Text is extracted from captured homework image
- Extracted text is displayed to user
- Processing completes within reasonable time (2-10 seconds)
- Accuracy is sufficient for quiz generation

**Technical Notes**:
- Use Apple Vision Framework (VNRecognizeTextRequest)
- Recognition level: .accurate
- Recognition language: English (UK)
- Pre-process image (enhance contrast, perspective correction)

---

### FR-4: AI Quiz Generation
**Priority**: P0 (Must Have)

**Requirements**:
- Generate 10 multiple-choice questions from homework content
- Each question has 4 answer options
- One correct answer per question
- Questions test comprehension and application
- Age-appropriate language and difficulty
- Include brief explanation for correct answers
- Complete generation within 15 seconds
- Handle various subject areas (Math, English, Science, History, etc.)

**Acceptance Criteria**:
- Quiz is generated successfully from extracted text
- Quiz contains exactly 10 questions
- Questions are relevant to homework content
- Questions are appropriately difficult for secondary school level
- All questions have 4 options with 1 correct answer
- Generation succeeds for 95%+ of homework items

**Technical Notes**:
- Use Claude API via Supabase Edge Function
- Structured JSON output format
- Include subject detection in prompt
- Fallback handling if generation fails

---

### FR-5: Quiz Gameplay
**Priority**: P0 (Must Have)

**Requirements**:
- Display one question at a time
- Show question text clearly (large, readable font)
- Display 4 answer options as tappable buttons
- Progress indicator (e.g., "Question 3/10")
- Immediate visual feedback on answer selection (green=correct, red=incorrect)
- Show correct answer if user selects wrong answer
- Display brief explanation after each answer
- "Next" button to proceed to next question
- Score tracking throughout quiz
- Results screen at end showing:
  - Final score (X/10)
  - Percentage
  - Time taken
  - Option to replay quiz
  - Option to return to homework library

**Acceptance Criteria**:
- User can complete full 10-question quiz
- Feedback is immediate and clear
- Score is calculated correctly
- Results screen shows accurate information
- User can replay quiz or exit

**User Experience Notes**:
- Clean, distraction-free interface
- Large touch targets for answers (min 44pt height)
- Smooth transitions between questions
- Celebratory animation/message for high scores

---

### FR-6: Homework Library
**Priority**: P0 (Must Have)

**Requirements**:
- Display all user's homework items in grid or list
- Each homework card shows:
  - Title (auto-generated or user-entered)
  - Subject (if detected/entered)
  - Thumbnail of original image
  - Progress indicator (percentage complete)
  - Date added
- Sort options: Most recent first (default), by subject, by progress
- Tap card to view homework details
- Empty state message when no homework added
- Floating "+" button to add new homework (always accessible)
- Pull to refresh

**Acceptance Criteria**:
- All homework items are displayed
- Cards show accurate information
- Tapping card navigates to homework detail view
- "+" button launches capture flow
- Empty state is helpful and encouraging

**Visual Design Notes**:
- Card-based layout for easy scanning
- Clear visual hierarchy
- Progress bars should be prominent and colorful
- Thumbnail provides quick recognition

---

### FR-7: Progress Tracking
**Priority**: P0 (Must Have)

**Requirements**:
- Track completion percentage per homework item
  - Formula: (number of completed quizzes / total quizzes) × 100
  - For MVP: 1 quiz per homework, completion based on quiz attempts
- Display progress on homework cards
- Simple dashboard/stats view showing:
  - Overall completion percentage
  - Number of homework items added
  - Number of quizzes completed
  - Recent quiz scores
- Update progress after each quiz completion

**Acceptance Criteria**:
- Progress is accurately calculated and displayed
- Progress updates immediately after quiz completion
- User can see their overall progress at a glance
- Stats motivate continued usage

**Future Enhancements** (Post-MVP):
- Streak tracking (consecutive days)
- Subject breakdown
- Achievements/badges
- Progress charts over time

---

### FR-8: Homework Detail View
**Priority**: P0 (Must Have)

**Requirements**:
- Display original captured image (full screen preview)
- Show extracted text (expandable/collapsible)
- Display quiz information:
  - Number of questions
  - Best score (if quiz played)
  - Last played date
- "Start Quiz" button (prominent)
- "Play Again" if quiz already completed
- Back button to homework library

**Acceptance Criteria**:
- User can view all details about a homework item
- User can start quiz from this screen
- Original image is viewable at good quality

---

## Out of Scope (MVP)

The following features are **explicitly excluded** from the MVP to ensure fast delivery:

### Capture Features
- Multi-page document scanning
- PDF upload support
- Batch capture of multiple homework items
- Manual text editing/correction
- Advanced image editing (crop, rotate, filters)

### Quiz Features
- Question types beyond multiple choice (true/false, fill-in-blank, matching, essay)
- Timed quizzes
- Difficulty level selection
- Hint system
- Custom quiz creation (manual question entry)
- Quiz sharing with friends

### Progress & Gamification
- Achievements and badges
- Streak tracking (consecutive days)
- Leaderboards
- Points system
- Daily challenges
- Rewards/unlockables
- Detailed analytics and charts

### Social Features
- Friend connections
- Compare progress with peers
- Sharing quizzes or scores
- Class/group features
- Teacher/parent dashboard

### Content Features
- Subject-specific question types (e.g., math equation solving)
- Flashcard mode
- Study notes/summaries
- Video explanations
- External content integration (textbooks, online resources)

### Technical Features
- Offline mode (full functionality without internet)
- Apple Sign In / Social login
- iPad optimization
- Widget support
- Push notifications
- Dark mode (use system default)
- Multiple language support
- Export data/reports

---

## Future Enhancements (Phase 2+)

### Phase 2: Enhanced Capture & Content
- **PDF Upload Support**: Allow importing homework from PDF files
- **Multi-Page Scanning**: Scan multiple pages of homework in one session
- **Handwriting Improvement**: Better OCR for handwritten homework
- **Manual Text Correction**: Edit extracted text before quiz generation
- **Subject Detection**: Automatically detect homework subject for better quiz generation

### Phase 3: Advanced Quiz Features
- **Multiple Quiz Types**: True/false, fill-in-the-blank, matching games
- **Difficulty Levels**: Easy, medium, hard question generation
- **Adaptive Quizzing**: Focus on questions the student got wrong
- **Timed Mode**: Optional timer for exam simulation
- **Custom Quizzes**: Manual question creation and editing

### Phase 4: Progress & Motivation
- **Streak Tracking**: Track consecutive days of practice
- **Achievements System**: Badges for milestones (10 quizzes, 90% score, etc.)
- **Progress Analytics**: Detailed charts showing improvement over time
- **Subject Breakdown**: See progress by subject area
- **Study Recommendations**: AI suggests which homework to review based on performance

### Phase 5: Social & Collaboration
- **Study Groups**: Share homework and quizzes with classmates
- **Parent Dashboard**: View child's progress (with permission)
- **Teacher Features**: Assign homework, track class progress
- **Friendly Competition**: Compare scores with friends (opt-in)

### Phase 6: Platform & Technical
- **iPad Version**: Optimized layout for larger screens
- **Apple Watch**: Quick quiz sessions on watch
- **Offline Mode**: Full functionality without internet connection
- **Apple Sign In**: Quick authentication option
- **Push Notifications**: Reminders to practice
- **Widgets**: Home screen progress widgets
- **Export Features**: Export progress reports, quiz results

---

## Constraints & Assumptions

### Constraints
- **Budget**: Minimize costs - use free tiers where possible
- **Timeline**: MVP target 4-6 weeks
- **Device Support**: iPhone only (iOS 16+), no iPad optimization initially
- **Developer Resources**: Solo developer (or small team)
- **API Limits**: Free/low-cost tier limits on AI API usage

### Technical Constraints
- Must work on older hardware (iPhone 11 minimum)
- Must maintain 60fps performance
- Image processing must complete in <10 seconds
- App size should be <50MB download

### Assumptions
- Students have access to iPhone (not Android)
- Students have internet connection for quiz generation
- Homework is primarily in English
- Students are self-motivated to use the app
- Parents/students are comfortable with basic photo capture
- Homework content is suitable for AI processing (no copyrighted standardized test materials)

### Privacy Assumptions
- Users consent to uploading homework images to cloud
- AI processing of homework content is acceptable
- Data stored securely follows GDPR/COPPA guidelines
- User can delete their data at any time

---

## Risks & Mitigations

### Risk 1: Poor OCR Accuracy on Handwritten Homework
**Impact**: High - Could prevent quiz generation
**Probability**: Medium
**Mitigation**:
- Focus MVP on printed homework first
- Set expectations with users (printed text works best)
- Use Apple Vision's handwriting recognition (available but less accurate)
- Add manual text correction in Phase 2

### Risk 2: AI-Generated Quizzes Are Poor Quality
**Impact**: High - Undermines core value proposition
**Probability**: Medium
**Mitigation**:
- Extensive prompt engineering and testing
- Include subject and year level in prompts
- Add user feedback mechanism ("Was this question helpful?")
- Allow quiz regeneration
- Iterate based on real usage data

### Risk 3: API Costs Higher Than Expected
**Impact**: Medium - Could affect sustainability
**Probability**: Low-Medium
**Mitigation**:
- Start with conservative usage limits per user
- Implement aggressive caching
- Monitor costs closely
- Optimize image sizes to reduce processing costs
- Consider on-device ML in future phases

### Risk 4: Low User Engagement
**Impact**: High - App doesn't achieve purpose
**Probability**: Medium
**Mitigation**:
- User testing with target student (developer's son)
- Iterate based on feedback
- Add motivational features in Phase 2 (streaks, achievements)
- Keep quiz experience fast and fun
- Add variety in question types (Phase 2+)

### Risk 5: Performance Issues on Older Devices
**Impact**: Medium - Poor UX on iPhone 11
**Probability**: Low
**Mitigation**:
- Test on physical iPhone 11 throughout development
- Optimize image processing
- Use background threads for heavy operations
- Monitor memory usage
- Provide progress indicators for slow operations

---

## Open Questions

1. **Question Types**: Should MVP include any question types beyond multiple choice?
   - *Decision*: No, keep MVP simple with multiple choice only

2. **Manual Intervention**: Should users be able to edit extracted text before quiz generation?
   - *Decision*: No for MVP, add in Phase 2 if OCR accuracy is problematic

3. **Onboarding**: How much guidance do students need? Should there be a tutorial?
   - *Decision*: Minimal onboarding, learn by doing. Can add tutorial in future if needed

4. **Pricing Model**: Will this be free, freemium, or paid?
   - *Decision*: Free for MVP, evaluate monetization post-launch based on usage

5. **Subject Selection**: Should users manually tag homework by subject?
   - *Decision*: Optional for MVP, auto-detect in future

---

## Appendix

### Related Documents
- [TECH_REQUIREMENTS.md](./TECH_REQUIREMENTS.md) - Technical specifications and architecture
- [UX_FLOW.md](./UX_FLOW.md) - Detailed user experience flows and wireframes

### Glossary
- **OCR**: Optical Character Recognition - technology to extract text from images
- **MVP**: Minimum Viable Product - first version with core features only
- **Supabase**: Backend-as-a-Service platform providing auth, database, and storage
- **SwiftUI**: Apple's modern UI framework for iOS development

### References
- [Apple Vision Framework Documentation](https://developer.apple.com/documentation/vision)
- [Supabase Documentation](https://supabase.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

---

**Document Status**: Draft v1.0
**Last Updated**: November 4, 2025
**Owner**: Product Owner / Developer
**Next Review**: After MVP development begins
