# Migration Guide: iOS to React Native

Complete guide for porting Cheater from SwiftUI/iOS to React Native/Expo with native iOS feel.

## Migration Overview

### Goals
1. **Functional Parity**: All iOS features in React Native
2. **Native Feel**: iOS animations, haptics, and interactions
3. **Cross-Platform**: iOS, Android, and Web support
4. **Better DX**: Hot reload, faster iteration
5. **Easy Distribution**: Web via Vercel, native via EAS Build

### Technology Mapping

| iOS | React Native | Notes |
|-----|--------------|-------|
| **SwiftUI** | React Native | Declarative UI |
| **@Published** | useState/Zustand | State management |
| **Actor** | async functions | Concurrency |
| **Core Data** | Supabase | Database |
| **URLSession** | axios/fetch | HTTP |
| **Vision** | Not needed | Claude Vision handles OCR |
| **UIImagePicker** | expo-image-picker | Camera/gallery |
| **UIKit** | expo-image-manipulator | Image processing |
| **SF Symbols** | react-native-vector-icons | Icons |
| **SwiftUI Animations** | reanimated | Animations |
| **UIFeedbackGenerator** | expo-haptics | Haptics |

---

## Phase 1: Setup & Configuration

### Step 1: Initialize Expo Project

```bash
# Create new Expo app with TypeScript
npx create-expo-app@latest Cheater-React --template blank-typescript

cd Cheater-React

# Install core dependencies
npx expo install expo-router react-native-safe-area-context react-native-screens

# Install UI/Animation libraries
npm install framer-motion react-native-reanimated react-native-gesture-handler
npx expo install expo-blur expo-haptics

# Install camera/image libraries
npx expo install expo-camera expo-image-picker expo-image-manipulator expo-file-system

# Install backend
npm install @supabase/supabase-js

# Install state management
npm install zustand

# Install utilities
npm install axios uuid date-fns

# Install dev dependencies
npm install --save-dev @types/uuid
```

### Step 2: Configure app.json

```json
{
  "expo": {
    "name": "Cheater",
    "slug": "cheater-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#007AFF"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.cheater.app",
      "infoPlist": {
        "NSCameraUsageDescription": "Cheater needs camera access to photograph your homework.",
        "NSPhotoLibraryUsageDescription": "Cheater needs photo library access to select homework images."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#007AFF"
      },
      "package": "com.cheater.app"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow Cheater to access your camera to capture homework."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow Cheater to access your photos to select homework images."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Step 3: Setup Supabase

```bash
# Create Supabase project at supabase.com

# Install Supabase CLI (optional)
npm install -g supabase

# Initialize Supabase
supabase init
```

**Create .env file:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-api03-your-key
```

### Step 4: Folder Structure

```
Cheater-React/
├── app/                    # Expo Router pages
│   ├── (tabs)/
│   │   └── index.tsx       # Homework list
│   ├── homework/
│   │   └── [id].tsx        # Homework detail
│   ├── quiz/
│   │   ├── [id].tsx        # Quiz gameplay
│   │   └── results.tsx     # Quiz results
│   └── capture/
│       └── index.tsx       # Camera capture
├── components/             # Reusable UI
│   ├── HomeworkCard.tsx
│   ├── AnswerButton.tsx
│   ├── FeedbackView.tsx
│   ├── ProcessingView.tsx
│   ├── ProgressBar.tsx
│   └── QuizResultsCircle.tsx
├── services/              # Business logic
│   ├── aiService.ts
│   ├── promptManager.ts
│   ├── supabase.ts
│   └── storage.ts
├── stores/                # Zustand state
│   ├── homeworkStore.ts
│   └── quizStore.ts
├── theme/                 # Design tokens
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── animations.ts
├── types/                 # TypeScript interfaces
│   ├── homework.ts
│   ├── quiz.ts
│   └── question.ts
├── config/                # Symlink to /shared/config
│   ├── Prompts.json
│   └── TrainingData.json
├── .env                   # Environment variables
└── package.json
```

---

## Phase 2: Core Services Migration

### AIService Conversion

**iOS (Swift):**
```swift
actor AIService {
    func generateQuiz(from image: UIImage) async throws -> Quiz {
        let base64 = try convertImageToBase64(image)
        let prompt = PromptManager.shared.buildVisionPrompt()
        // ... API call
        return quiz
    }
}
```

**React Native (TypeScript):**
```typescript
export class AIService {
  async generateQuiz(imageUri: string, subject?: string): Promise<Quiz> {
    const base64 = await convertImageToBase64(imageUri);
    const prompt = PromptManager.buildVisionPrompt(subject);
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
            { type: 'text', text: prompt }
          ]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        timeout: 60000
      }
    );
    
    return this.parseQuizResponse(response.data);
  }
  
  private async convertImageToBase64(uri: string): Promise<string> {
    const resized = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1280 } }],
      { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    return await FileSystem.readAsStringAsync(resized.uri, {
      encoding: FileSystem.EncodingType.Base64
    });
  }
}
```

### PromptManager Conversion

**iOS (Swift):**
```swift
struct PromptManager {
    static let shared = PromptManager()
    private let config: PromptConfig
    
    func buildVisionPrompt(subject: String?, topic: String) -> String {
        // Load from Prompts.json
        // Build prompt string
    }
}
```

**React Native (TypeScript):**
```typescript
import PromptsJSON from '../config/Prompts.json';
import TrainingDataJSON from '../config/TrainingData.json';

export class PromptManager {
  static buildVisionPrompt(subject?: string, topic: string = 'generic'): string {
    const topicPrompt = PromptsJSON.prompts.vision[topic] || PromptsJSON.prompts.vision.generic;
    const subjectHint = subject ? ` about ${subject}` : '';
    
    let prompt = topicPrompt.system + '\n\n';
    prompt += topicPrompt.user.prefix.replace('{subjectHint}', subjectHint) + '\n\n';
    prompt += topicPrompt.user.instructions.join('\n') + '\n\n';
    
    // Add training examples
    const examples = this.selectRelevantExamples(topic);
    prompt += this.buildTrainingExamplesSection(examples) + '\n\n';
    
    prompt += 'Requirements:\n';
    prompt += topicPrompt.user.requirements.map(r => `- ${r}`).join('\n') + '\n\n';
    prompt += topicPrompt.user.format.description + '\n';
    prompt += JSON.stringify(topicPrompt.user.format.example, null, 2) + '\n\n';
    prompt += topicPrompt.user.suffix;
    
    return prompt;
  }
  
  private static selectRelevantExamples(topic: string): TrainingExample[] {
    const priorities: Record<string, string[]> = {
      maths: ['maths-worksheet'],
      english: ['spelling-list', 'grammar-exercises'],
      science: ['science-diagram'],
      history: ['history-timeline'],
      generic: ['spelling-list', 'maths-worksheet', 'reading-comprehension']
    };
    
    const priorityIds = priorities[topic] || priorities.generic;
    return TrainingDataJSON.examples.filter(ex => priorityIds.includes(ex.id)).slice(0, 3);
  }
}
```

### Database Migration (Core Data → Supabase)

**iOS (Core Data):**
```swift
let context = PersistenceController.shared.container.viewContext
let homework = HomeworkEntity(context: context)
homework.id = UUID()
homework.title = title
try context.save()
```

**React Native (Supabase):**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export const HomeworkDB = {
  async create(homework: Omit<Homework, 'id' | 'createdAt'>): Promise<Homework> {
    const { data, error } = await supabase
      .from('homework')
      .insert(homework)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getAll(): Promise<Homework[]> {
    const { data, error } = await supabase
      .from('homework')
      .select('*, quiz(*), progress(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('homework')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
```

---

## Phase 3: State Management

### Converting @Published to Zustand

**iOS (ObservableObject):**
```swift
@MainActor
class HomeworkListViewModel: ObservableObject {
    @Published var homework: [Homework] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    func loadHomework() async {
        isLoading = true
        homework = await fetchHomework()
        isLoading = false
    }
}
```

**React Native (Zustand):**
```typescript
import create from 'zustand';

interface HomeworkState {
  homework: Homework[];
  isLoading: boolean;
  error: string | null;
  loadHomework: () => Promise<void>;
  addHomework: (hw: Homework, quiz: Quiz) => Promise<void>;
  deleteHomework: (id: string) => Promise<void>;
}

export const useHomeworkStore = create<HomeworkState>((set, get) => ({
  homework: [],
  isLoading: false,
  error: null,
  
  loadHomework: async () => {
    set({ isLoading: true, error: null });
    try {
      const homework = await HomeworkDB.getAll();
      set({ homework, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  addHomework: async (hw, quiz) => {
    try {
      await HomeworkDB.create(hw);
      await QuizDB.create(quiz);
      await get().loadHomework();
    } catch (error) {
      set({ error: error.message });
    }
  },
  
  deleteHomework: async (id) => {
    try {
      await HomeworkDB.delete(id);
      set(state => ({
        homework: state.homework.filter(h => h.id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  }
}));
```

**Usage in Component:**
```typescript
export default function HomeworkListScreen() {
  const { homework, isLoading, loadHomework } = useHomeworkStore();
  
  useEffect(() => {
    loadHomework();
  }, []);
  
  return (
    <FlatList
      data={homework}
      renderItem={({ item }) => <HomeworkCard homework={item} />}
      refreshing={isLoading}
      onRefresh={loadHomework}
    />
  );
}
```

---

## Phase 4: UI Component Conversion

### HomeworkCard

**iOS (SwiftUI):**
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
        .shadow(color: .black.opacity(0.1), radius: 8, y: 2)
    }
}
```

**React Native:**
```typescript
export const HomeworkCard: React.FC<{ homework: Homework }> = ({ homework }) => {
  const colors = useColors();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <View style={[styles.thumbnail, { backgroundColor: colors.primaryTint }]}>
        <Icon name="book" size={32} color={colors.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {homework.title}
        </Text>
        {homework.subject && (
          <Text style={[styles.subject, { color: colors.primary }]}>
            {homework.subject}
          </Text>
        )}
        <ProgressBar progress={homework.completionPercentage / 100} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Spacing.medium,
    borderRadius: Radius.card,
    marginBottom: Spacing.medium,
    ...Shadow.card
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: Radius.medium,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    marginLeft: Spacing.medium
  },
  title: {
    ...Typography.headline
  },
  subject: {
    ...Typography.callout,
    marginTop: Spacing.tiny
  }
});
```

### Animation Conversion

**iOS (SwiftUI):**
```swift
Button(action: {}) {
    Text("Answer")
}
.scaleEffect(isPressed ? 0.95 : 1.0)
.animation(.spring(response: 0.3, dampingFraction: 0.7), value: isPressed)
```

**React Native (Reanimated):**
```typescript
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnswerButton = () => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150
    });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1.0);
  };
  
  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Text>Answer</Text>
      </Pressable>
    </Animated.View>
  );
};
```

---

## Phase 5: Navigation

### Expo Router Setup

**app/(tabs)/index.tsx:**
```typescript
import { HomeworkListScreen } from '@/screens/HomeworkListScreen';

export default function HomeScreen() {
  return <HomeworkListScreen />;
}
```

**app/homework/[id].tsx:**
```typescript
import { useLocalSearchParams } from 'expo-router';
import { HomeworkDetailScreen } from '@/screens/HomeworkDetailScreen';

export default function HomeworkDetail() {
  const { id } = useLocalSearchParams();
  return <HomeworkDetailScreen homeworkId={id as string} />;
}
```

**Navigation:**
```typescript
import { router } from 'expo-router';

// Navigate to detail
router.push(`/homework/${homework.id}`);

// Navigate to quiz
router.push(`/quiz/${quiz.id}`);

// Go back
router.back();

// Replace (no back)
router.replace('/');
```

---

## Phase 6: iOS-Native Feel

### Spring Animations

```typescript
export const Spring = {
  default: {
    damping: 15,
    stiffness: 150,
    mass: 1
  },
  bouncy: {
    damping: 10,
    stiffness: 200
  },
  gentle: {
    damping: 20,
    stiffness: 100
  }
};

// Usage
const animated = withSpring(toValue, Spring.default);
```

### Haptic Feedback

```typescript
import * as Haptics from 'expo-haptics';

// Button press
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Correct answer
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Wrong answer
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

### Blur Effects

```typescript
import { BlurView } from 'expo-blur';

<BlurView intensity={40} tint="light" style={styles.blur}>
  {/* Content */}
</BlurView>
```

### Bounce Scroll

```typescript
<ScrollView
  bounces={true}
  alwaysBounceVertical={true}
  showsVerticalScrollIndicator={false}
>
  {/* Content */}
</ScrollView>
```

---

## Migration Checklist

### Setup
- [ ] Initialize Expo project
- [ ] Install all dependencies
- [ ] Configure app.json
- [ ] Set up Supabase project
- [ ] Create .env file
- [ ] Set up folder structure
- [ ] Link to /shared/config

### Models & Types
- [ ] Create TypeScript interfaces
- [ ] Add validation functions
- [ ] Create type guards
- [ ] Add helper functions

### Services
- [ ] Migrate AIService
- [ ] Migrate PromptManager
- [ ] Create Supabase client
- [ ] Create database functions
- [ ] Implement image storage

### State Management
- [ ] Create Zustand stores
- [ ] Migrate ViewModels to hooks
- [ ] Set up React Query (optional)

### UI Components
- [ ] Create design tokens
- [ ] Build component library
- [ ] Add animations
- [ ] Implement haptics
- [ ] Test dark mode

### Screens
- [ ] Homework list
- [ ] Homework detail
- [ ] Camera capture
- [ ] Quiz gameplay
- [ ] Quiz results

### Navigation
- [ ] Set up Expo Router
- [ ] Configure transitions
- [ ] Add deep linking

### Polish
- [ ] iOS animations
- [ ] Haptic feedback
- [ ] Blur effects
- [ ] Pull-to-refresh
- [ ] Loading states
- [ ] Error handling

### Testing
- [ ] Unit tests
- [ ] Component tests
- [ ] E2E tests
- [ ] iOS device testing

### Deployment
- [ ] Configure Vercel
- [ ] Set up EAS Build
- [ ] Configure environment variables
- [ ] Create build profiles

---

## Common Patterns

### Pattern 1: Async Data Fetching

**iOS:**
```swift
Task {
    await viewModel.loadData()
}
```

**React Native:**
```typescript
useEffect(() => {
  loadData();
}, []);
```

### Pattern 2: Conditional Rendering

**iOS:**
```swift
if isLoading {
    ProgressView()
} else {
    ContentView()
}
```

**React Native:**
```typescript
{isLoading ? (
  <ActivityIndicator />
) : (
  <ContentView />
)}
```

### Pattern 3: Lists

**iOS:**
```swift
List(homework) { hw in
    HomeworkCard(homework: hw)
}
```

**React Native:**
```typescript
<FlatList
  data={homework}
  renderItem={({ item }) => <HomeworkCard homework={item} />}
  keyExtractor={(item) => item.id}
/>
```

---

## Next Steps

1. Review all documentation
2. Set up development environment
3. Start with Phase 1 (Setup)
4. Migrate services first (Phase 2)
5. Build UI components (Phase 4)
6. Implement screens
7. Add navigation
8. Polish with animations
9. Test thoroughly
10. Deploy

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Supabase Docs](https://supabase.com/docs)
- [Expo Router](https://expo.github.io/router)
- [React Navigation](https://reactnavigation.org)

## Support

For questions or issues:
- Check documentation first
- Review iOS implementation for reference
- Test on iOS device for native feel
- Iterate quickly with hot reload
