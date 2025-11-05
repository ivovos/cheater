# Technical Requirements Document
## iOS Homework Revision App

**Project Name**: Homework Revision Game App
**Version**: 1.0 (MVP)
**Date**: November 4, 2025
**Platform**: iOS
**Minimum iOS Version**: 16.0
**Target iOS Version**: 26.0+ (latest)

---

## Table of Contents
1. [Technical Overview](#technical-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Development Environment](#development-environment)
5. [iOS Compatibility](#ios-compatibility)
6. [Dependencies](#dependencies)
7. [API Integrations](#api-integrations)
8. [Database Schema](#database-schema)
9. [File Storage](#file-storage)
10. [Security & Privacy](#security--privacy)
11. [Performance Requirements](#performance-requirements)
12. [Testing Strategy](#testing-strategy)
13. [Deployment](#deployment)
14. [Monitoring & Analytics](#monitoring--analytics)

---

## Technical Overview

### Architecture Pattern
**MVVM (Model-View-ViewModel)**
- **Models**: Data structures (Homework, Quiz, Question, User)
- **Views**: SwiftUI views (declarative UI)
- **ViewModels**: Business logic, state management, API calls
- **Services**: Reusable components (API clients, storage managers)

### Key Technologies
- **UI Framework**: SwiftUI (iOS 16+)
- **Language**: Swift 5.9+
- **Backend**: Supabase (PostgreSQL, Storage, Edge Functions)
- **OCR**: Apple Vision Framework (on-device)
- **AI**: Anthropic Claude API (via Supabase Edge Functions)
- **Local Storage**: Core Data (iOS 16 compatible)
- **Networking**: URLSession with async/await
- **Authentication**: Supabase Auth

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         iOS App (Swift)                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 SwiftUI Views                         │  │
│  │  (HomeworkListView, QuizView, CameraView, etc.)      │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              ViewModels (MVVM)                        │  │
│  │  - HomeworkListViewModel                              │  │
│  │  - QuizViewModel                                      │  │
│  │  - CameraViewModel                                    │  │
│  │  - AuthViewModel                                      │  │
│  └───┬────────────┬────────────┬────────────┬───────────┘  │
│      │            │            │            │                │
│  ┌───▼────┐  ┌───▼─────┐  ┌──▼──────┐  ┌──▼──────────┐    │
│  │  OCR   │  │Supabase │  │ Storage │  │  Core Data  │    │
│  │Service │  │ Service │  │ Service │  │  (Local)    │    │
│  │(Vision)│  │         │  │         │  │             │    │
│  └───┬────┘  └───┬─────┘  └──┬──────┘  └─────────────┘    │
└──────┼───────────┼───────────┼─────────────────────────────┘
       │           │           │
       │      ┌────▼───────────▼───────┐
       │      │   Supabase Backend     │
       │      │  ┌──────────────────┐  │
       │      │  │  Authentication  │  │
       │      │  └──────────────────┘  │
       │      │  ┌──────────────────┐  │
       │      │  │ PostgreSQL DB    │  │
       │      │  │  - users         │  │
       │      │  │  - homework      │  │
       │      │  │  - quizzes       │  │
       │      │  │  - quiz_attempts │  │
       │      │  └──────────────────┘  │
       │      │  ┌──────────────────┐  │
       │      │  │  Object Storage  │  │
       │      │  │ (homework images)│  │
       │      │  └──────────────────┘  │
       │      │  ┌──────────────────┐  │
       │      │  │ Edge Functions   │  │
       │      │  │ (Deno/TypeScript)│  │
       │      │  └────────┬─────────┘  │
       │      └───────────┼────────────┘
       │                  │
       │            ┌─────▼──────────┐
       └────────────► Apple Vision   │
                    │   Framework    │
                    │  (On-Device)   │
                    └────────────────┘

                    ┌────────────────┐
                    │  Claude API    │
                    │  (Anthropic)   │
                    └────────────────┘
```

### Data Flow

#### Homework Capture → Quiz Generation Flow
```
1. User captures photo (Camera)
   ↓
2. Image → CameraViewModel
   ↓
3. Image processing (compress, optimize)
   ↓
4. Upload to Supabase Storage → get URL
   ↓
5. OCRService (Apple Vision) → extract text
   ↓
6. Save homework record to Supabase DB (with image_url, ocr_text)
   ↓
7. Call Supabase Edge Function (/generate-quiz)
   ↓
8. Edge Function → Claude API (with OCR text)
   ↓
9. Claude returns JSON quiz structure
   ↓
10. Save quiz to Supabase DB
    ↓
11. Update UI → show homework in list
    ↓
12. User taps "Start Quiz" → load quiz → play
```

---

## Technology Stack

### Frontend (iOS App)

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **UI Framework** | SwiftUI | iOS 16+ | Declarative UI, native iOS components |
| **Programming Language** | Swift | 5.9+ | Modern, safe, performant |
| **Architecture** | MVVM | - | Separation of concerns, testable |
| **State Management** | @State, @Published, Combine | iOS 16+ | Reactive state updates |
| **Async Operations** | async/await | Swift 5.5+ | Clean asynchronous code |
| **Dependency Management** | Swift Package Manager (SPM) | - | Native, no third-party tools |

### Backend (Supabase)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **BaaS Platform** | Supabase | Managed backend infrastructure |
| **Database** | PostgreSQL 15+ | Relational database with JSON support |
| **Authentication** | Supabase Auth | Email/password, session management |
| **Storage** | Supabase Storage (S3-compatible) | Image/file storage |
| **Edge Functions** | Deno (TypeScript) | Serverless API endpoints |
| **Real-time** | PostgreSQL LISTEN/NOTIFY | Real-time updates (future) |

### AI & Machine Learning

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **OCR** | Apple Vision Framework | On-device text extraction |
| **Text Recognition** | VNRecognizeTextRequest | OCR API |
| **Document Scanning** | VNDocumentCameraViewController | Document detection |
| **Image Processing** | Core Image (CIFilter) | Image enhancement |
| **Quiz Generation** | Anthropic Claude 3.5 Sonnet API | AI-powered content generation |

### Local Storage

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Persistent Data** | Core Data | Local caching, offline data |
| **Preferences** | UserDefaults | App settings, user preferences |
| **File Storage** | FileManager | Temporary image cache |

### Networking

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **HTTP Client** | URLSession | Native networking |
| **API Client** | Supabase Swift SDK | Type-safe Supabase interactions |
| **JSON Parsing** | Codable | Type-safe JSON encoding/decoding |

---

## Development Environment

### Required Tools

1. **Xcode 15.0+**
   - Includes iOS 16+ SDK
   - SwiftUI previews
   - Simulator (iPhone 11, iPhone 15 Pro, etc.)

2. **macOS**
   - macOS Sonoma 14.0+ recommended
   - For Xcode 15 support

3. **Apple Developer Account**
   - Required for device testing
   - Required for TestFlight distribution
   - $99/year individual account

4. **Supabase Account**
   - Free tier available
   - Project setup required

5. **Anthropic API Key**
   - Claude API access
   - Pay-as-you-go pricing

### Recommended Tools

- **SF Symbols App**: Icon browsing
- **Postman/Insomnia**: API testing
- **Git**: Version control
- **Simulator**: iOS 16, iOS 17, iOS 26 testing
- **Physical Device**: iPhone 11 (iOS 16) for testing

### Development Setup Steps

```bash
# 1. Clone repository (after initialization)
git clone <repository-url>
cd cheater

# 2. Open Xcode project
open cheater.xcodeproj

# 3. Configure Supabase
# - Copy Config.example.plist to Config.plist
# - Add Supabase URL and Anon Key

# 4. Install dependencies (SPM handles automatically)
# - File → Add Package Dependencies in Xcode
# - Add supabase-swift

# 5. Build and run
# - Select target device/simulator
# - Cmd+R to build and run
```

---

## iOS Compatibility

### Target Versions
- **Minimum**: iOS 16.0 (iPhone 8 and later)
- **Target**: iOS 26.0 (latest, with Liquid Glass support)
- **Testing**: iOS 16.0 (iPhone 11) and iOS 26.0

### Device Support
- **iPhone Models**: iPhone 8 and later
- **Primary Test Device**: iPhone 11 (iOS 16)
- **Secondary Test Device**: iPhone 15 Pro (iOS 26)
- **iPad**: Not optimized (iPhone layout scales)
- **Mac Catalyst**: Not supported in MVP

### SwiftUI API Availability
```swift
// Example: Check API availability
if #available(iOS 17.0, *) {
    // Use SwiftData or iOS 17+ features
} else {
    // Fallback to Core Data for iOS 16
}
```

### Key Compatibility Considerations

| Feature | iOS 16 | iOS 17+ | Implementation |
|---------|--------|---------|----------------|
| SwiftUI | ✅ Full support | ✅ Enhanced | Use iOS 16 APIs |
| VisionKit | ✅ Supported | ✅ Enhanced | Works on both |
| Core Data | ✅ Supported | ✅ SwiftData available | Use Core Data for compatibility |
| async/await | ✅ Supported | ✅ Supported | Use freely |
| PhotosPicker | ✅ Supported | ✅ Enhanced | Use PhotosPickerItem |
| SF Symbols | ✅ v3.3 | ✅ v5.0+ | Use symbols from v3.3 |

---

## Dependencies

### Swift Package Manager Dependencies

#### 1. supabase-swift
```swift
.package(url: "https://github.com/supabase/supabase-swift", from: "2.0.0")
```
**Purpose**: Official Supabase client for Swift
**Includes**:
- Auth (authentication)
- Realtime (real-time subscriptions)
- Storage (file storage)
- Functions (edge functions)
- PostgREST (database API)

**Usage**:
```swift
import Supabase

let supabase = SupabaseClient(
    supabaseURL: URL(string: "https://your-project.supabase.co")!,
    supabaseKey: "your-anon-key"
)
```

### No Other Dependencies Required!
The app uses native Apple frameworks for most functionality:
- **Vision**: OCR
- **VisionKit**: Document scanning
- **SwiftUI**: UI
- **Core Data**: Local storage
- **URLSession**: Networking
- **Foundation**: Utilities

---

## API Integrations

### 1. Supabase API

#### Authentication API
```swift
// Sign up
try await supabase.auth.signUp(
    email: email,
    password: password
)

// Sign in
try await supabase.auth.signIn(
    email: email,
    password: password
)

// Get current session
let session = try await supabase.auth.session

// Sign out
try await supabase.auth.signOut()
```

#### Database API (PostgREST)
```swift
// Fetch homework list
let homework: [Homework] = try await supabase
    .from("homework")
    .select()
    .eq("user_id", userId)
    .order("created_at", ascending: false)
    .execute()
    .value

// Insert new homework
try await supabase
    .from("homework")
    .insert(homeworkData)
    .execute()

// Update progress
try await supabase
    .from("progress")
    .update(["completion_percentage": 80])
    .eq("homework_id", homeworkId)
    .execute()
```

#### Storage API
```swift
// Upload image
let fileName = "\(userId)/\(UUID().uuidString).jpg"
try await supabase.storage
    .from("homework-images")
    .upload(
        path: fileName,
        file: imageData,
        options: FileOptions(contentType: "image/jpeg")
    )

// Get public URL
let publicURL = try supabase.storage
    .from("homework-images")
    .getPublicURL(path: fileName)
```

#### Edge Functions API
```swift
// Call quiz generation function
struct QuizRequest: Codable {
    let ocrText: String
    let subject: String?
    let yearGroup: Int?
}

let response = try await supabase.functions
    .invoke(
        "generate-quiz",
        options: FunctionInvokeOptions(
            body: QuizRequest(
                ocrText: extractedText,
                subject: "Math",
                yearGroup: 9
            )
        )
    )

let quiz: Quiz = try JSONDecoder().decode(Quiz.self, from: response.data)
```

### 2. Apple Vision Framework (Local)

```swift
import Vision
import VisionKit

// Text recognition
func recognizeText(in image: UIImage) async throws -> String {
    guard let cgImage = image.cgImage else {
        throw OCRError.invalidImage
    }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["en-GB"]
    request.usesLanguageCorrection = true

    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    try handler.perform([request])

    guard let observations = request.results else {
        throw OCRError.noTextFound
    }

    let text = observations.compactMap { $0.topCandidates(1).first?.string }
        .joined(separator: "\n")

    return text
}

// Document camera (for scanning)
import VisionKit

struct DocumentScanner: UIViewControllerRepresentable {
    @Binding var scannedImages: [UIImage]

    func makeUIViewController(context: Context) -> VNDocumentCameraViewController {
        let scanner = VNDocumentCameraViewController()
        scanner.delegate = context.coordinator
        return scanner
    }

    func updateUIViewController(_ uiViewController: VNDocumentCameraViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(scannedImages: $scannedImages)
    }

    class Coordinator: NSObject, VNDocumentCameraViewControllerDelegate {
        @Binding var scannedImages: [UIImage]

        init(scannedImages: Binding<[UIImage]>) {
            _scannedImages = scannedImages
        }

        func documentCameraViewController(_ controller: VNDocumentCameraViewController, didFinishWith scan: VNDocumentCameraScan) {
            for i in 0..<scan.pageCount {
                scannedImages.append(scan.imageOfPage(at: i))
            }
            controller.dismiss(animated: true)
        }
    }
}
```

### 3. Claude API (via Supabase Edge Function)

#### Edge Function Code (TypeScript/Deno)
```typescript
// supabase/functions/generate-quiz/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.24.0"

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
})

serve(async (req) => {
  try {
    const { ocrText, subject, yearGroup } = await req.json()

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `You are an educational quiz generator for secondary school students.

Generate a 10-question multiple choice quiz from this homework content:

${ocrText}

Subject: ${subject || 'General'}
Year Group: ${yearGroup || 'Secondary School'}

Requirements:
- Exactly 10 questions
- Each question has exactly 4 options (A, B, C, D)
- One correct answer per question
- Questions test understanding, not just memorization
- Appropriate difficulty for ${yearGroup ? `Year ${yearGroup}` : 'secondary school'} students
- Include a brief explanation for the correct answer

Return ONLY a valid JSON object in this exact format:
{
  "questions": [
    {
      "question": "What is...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation..."
    }
  ]
}`
      }]
    })

    // Extract JSON from response
    const content = message.content[0].text
    const jsonMatch = content.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error("Failed to parse quiz JSON from Claude response")
    }

    const quiz = JSON.parse(jsonMatch[0])

    return new Response(
      JSON.stringify(quiz),
      { headers: { "Content-Type": "application/json" } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
```

**API Endpoint**: `https://your-project.supabase.co/functions/v1/generate-quiz`

**Rate Limits**: Managed by Anthropic (varies by plan)

**Cost**: ~$0.003/1K input tokens, ~$0.015/1K output tokens

---

## Database Schema

### Supabase PostgreSQL Schema

#### Table: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  year_group INTEGER,
  name TEXT,
  streak_count INTEGER DEFAULT 0,
  last_activity_date DATE
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

#### Table: `homework`
```sql
CREATE TABLE homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  subject TEXT,
  image_url TEXT NOT NULL,
  ocr_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_homework_user_id ON homework(user_id);
CREATE INDEX idx_homework_created_at ON homework(created_at DESC);

-- Row Level Security
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own homework"
  ON homework FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own homework"
  ON homework FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own homework"
  ON homework FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own homework"
  ON homework FOR DELETE
  USING (auth.uid() = user_id);
```

#### Table: `quizzes`
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example JSONB structure for questions:
-- {
--   "questions": [
--     {
--       "question": "What is...",
--       "options": ["A", "B", "C", "D"],
--       "correctIndex": 0,
--       "explanation": "Because..."
--     }
--   ]
-- }

-- Indexes
CREATE INDEX idx_quizzes_homework_id ON quizzes(homework_id);

-- Row Level Security
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quizzes for own homework"
  ON quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM homework
      WHERE homework.id = quizzes.homework_id
      AND homework.user_id = auth.uid()
    )
  );
```

#### Table: `quiz_attempts`
```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken_seconds INTEGER,
  answers JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example JSONB structure for answers:
-- [
--   { "questionIndex": 0, "selectedIndex": 0, "correct": true },
--   { "questionIndex": 1, "selectedIndex": 2, "correct": false }
-- ]

-- Indexes
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_completed_at ON quiz_attempts(completed_at DESC);

-- Row Level Security
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### Table: `progress`
```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  completion_percentage INTEGER DEFAULT 0,
  best_score INTEGER,
  total_attempts INTEGER DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, homework_id)
);

-- Indexes
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_homework_id ON progress(homework_id);

-- Row Level Security
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  USING (auth.uid() = user_id);
```

### Core Data Models (iOS - Local Cache)

```swift
// For offline caching and sync
@Model
class HomeworkEntity {
    var id: UUID
    var userId: UUID
    var title: String?
    var subject: String?
    var imageURL: String
    var ocrText: String?
    var createdAt: Date
    var synced: Bool // Sync status
}

@Model
class QuizEntity {
    var id: UUID
    var homeworkId: UUID
    var questionsJSON: Data // Store as JSON blob
    var createdAt: Date
    var synced: Bool
}

@Model
class ProgressEntity {
    var homeworkId: UUID
    var completionPercentage: Int
    var bestScore: Int?
    var totalAttempts: Int
    var lastPlayedAt: Date?
    var synced: Bool
}
```

---

## File Storage

### Supabase Storage

#### Bucket: `homework-images`

**Configuration**:
```javascript
// Create bucket in Supabase dashboard or via SQL
INSERT INTO storage.buckets (id, name, public)
VALUES ('homework-images', 'homework-images', true);

// Storage policy
CREATE POLICY "Users can upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'homework-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'homework-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'homework-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**File Structure**:
```
homework-images/
  ├── {user_id}/
  │   ├── {homework_id_1}.jpg
  │   ├── {homework_id_2}.jpg
  │   └── ...
  └── {user_id_2}/
      └── ...
```

**File Naming Convention**:
```swift
let fileName = "\(userId)/\(homeworkId).jpg"
```

**Image Optimization**:
- Maximum size: 2MB
- Format: JPEG (90% quality)
- Maximum dimensions: 2000x2000px
- Resize larger images before upload

```swift
func optimizeImage(_ image: UIImage) -> Data? {
    let maxDimension: CGFloat = 2000
    let size = image.size

    var newSize = size
    if size.width > maxDimension || size.height > maxDimension {
        let ratio = max(size.width / maxDimension, size.height / maxDimension)
        newSize = CGSize(width: size.width / ratio, height: size.height / ratio)
    }

    UIGraphicsBeginImageContextWithOptions(newSize, false, 1.0)
    image.draw(in: CGRect(origin: .zero, size: newSize))
    let resized = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()

    return resized?.jpegData(compressionQuality: 0.9)
}
```

### Local File Cache

**Location**: `FileManager.default.temporaryDirectory`

**Purpose**:
- Cache downloaded images
- Store images before upload
- Temporary OCR processing

**Cache Strategy**:
- Maximum cache size: 100MB
- Auto-cleanup on app launch
- Delete files older than 7 days

---

## Security & Privacy

### Authentication Security

1. **Password Requirements**:
   - Minimum 8 characters
   - Handled by Supabase Auth

2. **Session Management**:
   - JWT tokens (managed by Supabase)
   - Automatic refresh
   - Secure storage in Keychain

```swift
// Store session in Keychain
import Security

func storeSession(_ session: Session) {
    let data = try? JSONEncoder().encode(session)
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: "user_session",
        kSecValueData as String: data as Any
    ]
    SecItemDelete(query as CFDictionary)
    SecItemAdd(query as CFDictionary, nil)
}
```

### Data Security

1. **Row Level Security (RLS)**:
   - All Supabase tables have RLS enabled
   - Users can only access their own data
   - Enforced at database level

2. **API Keys**:
   - Stored in Config.plist (not committed to Git)
   - Never hardcoded in source code
   - Use Supabase anon key (safe for client)

```swift
// Config.plist structure
<dict>
    <key>SUPABASE_URL</key>
    <string>https://your-project.supabase.co</string>
    <key>SUPABASE_ANON_KEY</key>
    <string>your-anon-key-here</string>
</dict>

// .gitignore
Config.plist
```

3. **HTTPS Only**:
   - All API calls over HTTPS
   - App Transport Security enforced

### Privacy

1. **Data Collection**:
   - Minimal data collection (email, homework content)
   - No tracking or analytics in MVP
   - Clear privacy policy

2. **User Rights**:
   - Right to delete account and all data
   - Export data capability (future)
   - Transparent data usage

3. **COPPA/GDPR Compliance**:
   - Age verification (if user under 13, require parent consent)
   - Data retention policies
   - Right to be forgotten

4. **Permissions**:
   - Camera: "We need camera access to capture your homework"
   - Photo Library: "We need photo access to upload homework images"
   - Request only when needed (just-in-time)

```swift
// Info.plist privacy descriptions
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture photos of your homework for quiz generation.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to upload homework images.</string>
```

---

## Performance Requirements

### App Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **App Launch Time** | < 2 seconds | Cold start to first screen |
| **OCR Processing** | 2-5 seconds | Per image (average) |
| **Quiz Generation** | 5-15 seconds | From API call to response |
| **Image Upload** | < 5 seconds | 2MB image on 4G |
| **Quiz Load Time** | < 1 second | Fetch and display quiz |
| **Frame Rate** | 60 FPS | Smooth scrolling, animations |
| **Memory Usage** | < 200MB | Peak usage on iPhone 11 |
| **App Size** | < 50MB | Download size |

### Optimization Strategies

1. **Async Operations**:
   ```swift
   // Use async/await for all network and heavy operations
   Task {
       let text = try await ocrService.extractText(from: image)
       let quiz = try await aiService.generateQuiz(from: text)
   }
   ```

2. **Image Lazy Loading**:
   ```swift
   // Use AsyncImage for remote images
   AsyncImage(url: URL(string: homework.imageURL)) { image in
       image.resizable().aspectRatio(contentMode: .fit)
   } placeholder: {
       ProgressView()
   }
   ```

3. **Database Indexing**:
   - Index all foreign keys
   - Index commonly queried fields (user_id, created_at)

4. **Caching**:
   - Cache OCR results locally
   - Cache quiz data
   - Cache images with expiry

5. **Background Processing**:
   ```swift
   // Process OCR in background
   Task.detached(priority: .userInitiated) {
       let text = try await processOCR(image)
       await MainActor.run {
           viewModel.ocrText = text
       }
   }
   ```

### Network Optimization

- Compress images before upload
- Use gzip compression for API responses
- Implement request timeouts (30 seconds)
- Retry failed requests (max 3 attempts)

---

## Testing Strategy

### Unit Testing

**Framework**: XCTest

**Coverage Target**: 70%+ for business logic

**Test Areas**:
- ViewModels (business logic)
- Services (API interactions, OCR)
- Models (data transformations)
- Utilities (helpers, extensions)

```swift
import XCTest
@testable import cheater

class OCRServiceTests: XCTestCase {
    var sut: OCRService!

    override func setUp() {
        super.setUp()
        sut = OCRService()
    }

    func testExtractTextFromImage() async throws {
        let testImage = UIImage(named: "test_homework")!
        let text = try await sut.extractText(from: testImage)
        XCTAssertFalse(text.isEmpty)
        XCTAssertTrue(text.contains("expected content"))
    }
}
```

### UI Testing

**Framework**: XCUITest

**Test Scenarios**:
- Onboarding flow
- Login/signup
- Capture homework
- Play quiz
- View progress

```swift
import XCTest

class HomeworkCaptureUITests: XCTestCase {
    func testCaptureHomeworkFlow() {
        let app = XCUIApplication()
        app.launch()

        // Tap add button
        app.buttons["addHomeworkButton"].tap()

        // Select camera option
        app.buttons["Take Photo"].tap()

        // Verify camera interface appears
        XCTAssertTrue(app.otherElements["cameraView"].exists)
    }
}
```

### Integration Testing

**Test Areas**:
- Supabase authentication
- Database CRUD operations
- File upload/download
- Edge function calls

### Manual Testing Checklist

- [ ] Test on iPhone 11 (iOS 16)
- [ ] Test on iPhone 15 Pro (iOS 26)
- [ ] Test with poor quality images
- [ ] Test with handwritten homework
- [ ] Test offline behavior
- [ ] Test with slow network (Network Link Conditioner)
- [ ] Test error scenarios (invalid credentials, API failures)

---

## Deployment

### App Store Submission

1. **Prerequisites**:
   - Apple Developer Account ($99/year)
   - App Store Connect account
   - App icons (all required sizes)
   - Screenshots (iPhone, iPad if supported)
   - Privacy policy URL
   - App description, keywords

2. **Build Configuration**:
   ```swift
   // Release configuration
   - Optimization: -O (optimize for speed)
   - Strip debug symbols: Yes
   - Bitcode: No (deprecated in Xcode 14)
   ```

3. **Version Numbers**:
   - MVP: 1.0.0
   - Format: Major.Minor.Patch
   - Increment for each release

4. **Provisioning**:
   - App Store distribution profile
   - Push notification certificate (future)

### TestFlight (Beta Testing)

1. **Internal Testing**:
   - Add up to 100 internal testers
   - No review required
   - Instant distribution

2. **External Testing**:
   - Up to 10,000 external testers
   - Beta App Review required
   - Public link or email invites

3. **Beta Testing Plan**:
   - Week 1: Internal testing (developer, family)
   - Week 2-3: Extended testing (friends, target users)
   - Week 4: Final fixes and polish
   - Week 5: App Store submission

### CI/CD (Future Enhancement)

**Tool**: Xcode Cloud or GitHub Actions

**Pipeline**:
```yaml
# Example GitHub Actions workflow
name: iOS CI

on: [push, pull_request]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: xcodebuild -scheme cheater -sdk iphonesimulator
      - name: Test
        run: xcodebuild test -scheme cheater -destination 'platform=iOS Simulator,name=iPhone 15'
```

---

## Monitoring & Analytics

### MVP: Minimal Monitoring

**Crash Reporting**: Use Xcode Organizer (built-in)
- Automatic crash reports from TestFlight and App Store
- No third-party SDK needed

**Basic Metrics** (manual tracking):
- Daily active users
- Homework items created
- Quizzes completed
- Average quiz scores

### Post-MVP: Enhanced Analytics

**Tools to Consider**:
- **Firebase Analytics** (free, comprehensive)
- **Mixpanel** (user behavior, funnels)
- **Sentry** (error tracking)

**Events to Track**:
- User sign up / login
- Homework captured
- Quiz started / completed
- Quiz score
- App crashes
- API failures

---

## Environment Configuration

### Development
```swift
// Config.Development.plist
SUPABASE_URL: https://dev-project.supabase.co
SUPABASE_ANON_KEY: dev-anon-key
ANTHROPIC_API_KEY: (stored in Supabase Edge Function env)
DEBUG_MODE: true
```

### Production
```swift
// Config.Production.plist
SUPABASE_URL: https://prod-project.supabase.co
SUPABASE_ANON_KEY: prod-anon-key
ANTHROPIC_API_KEY: (stored in Supabase Edge Function env)
DEBUG_MODE: false
```

### Build Schemes
- **Debug**: Development config, verbose logging
- **Release**: Production config, optimized build

---

## Cost Estimation (Monthly)

### Supabase Free Tier
- Database: 500MB (sufficient for MVP)
- Storage: 1GB (5,000 images)
- Bandwidth: 2GB
- Edge Functions: 500K invocations
- **Cost**: $0

### Claude API (Pay-as-you-go)
- Average quiz generation: ~3,000 tokens
- Cost per quiz: ~$0.01-0.02
- 100 quizzes/month: ~$1-2
- 1,000 quizzes/month: ~$10-20
- **Estimated MVP cost**: $5-10/month

### Total MVP Running Cost: ~$5-10/month

**Scaling Costs**:
- Supabase Pro: $25/month (2x resources)
- 10,000 quizzes/month: ~$100-150 (Claude API)

---

## Appendix

### Related Documents
- [PRD.md](./PRD.md) - Product requirements
- [UX_FLOW.md](./UX_FLOW.md) - User experience flows

### Useful Resources
- [Apple Vision Framework](https://developer.apple.com/documentation/vision)
- [VisionKit](https://developer.apple.com/documentation/visionkit)
- [Supabase Swift Documentation](https://supabase.com/docs/reference/swift/introduction)
- [Claude API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)

---

**Document Status**: Draft v1.0
**Last Updated**: November 4, 2025
**Owner**: Technical Lead / Developer
**Next Review**: After MVP development begins
