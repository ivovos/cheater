# UI Components

Comprehensive component library documentation for both iOS and React Native implementations.

## Component Inventory

### Core Components
1. **HomeworkCard** - List item showing homework summary
2. **AnswerButton** - Interactive quiz answer option
3. **FeedbackView** - Correct/incorrect feedback display
4. **ProcessingView** - AI processing overlay
5. **ProgressBar** - Quiz progress indicator
6. **QuizResultsCircle** - Circular score display

### Screen Components
7. **HomeworkListView** - Main list of homework
8. **HomeworkDetailView** - Individual homework detail
9. **CaptureFlowView** - Camera/library picker
10. **QuizView** - Quiz gameplay screen
11. **QuizResultsView** - Score summary screen

### Utility Components
12. **ImagePicker** - Camera/library interface
13. **EmptyState** - No content placeholder
14. **ErrorAlert** - Error message display

---

## 1. HomeworkCard

### Purpose
Display homework item in list with title, subject, progress, and scores.

### Props (TypeScript)

```typescript
interface HomeworkCardProps {
  homework: Homework;
  onPress?: () => void;
  onDelete?: () => void;
}
```

### Layout Structure

```
HStack (horizontal)
├── Thumbnail Icon (60×60)
│   └── book.fill icon (32pt, primary color)
│       Background: primary 10% opacity
│       Corner radius: 12px
└── Content VStack
    ├── Header HStack
    │   ├── Title (headline, bold)
    │   └── Star Rating (if bestScore exists)
    ├── Subject (callout, primary color)
    ├── Date (footnote, secondary)
    └── Progress Section
        ├── ProgressBar (0-100%)
        └── Stats HStack
            ├── "Progress: 80%"
            └── "3 attempts"
```

### Styling

```typescript
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Spacing.medium,
    backgroundColor: Colors.cardBackground,
    borderRadius: Radius.card,
    marginBottom: Spacing.medium,
    ...Shadow.card
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: Radius.medium,
    backgroundColor: Colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    marginLeft: Spacing.medium,
    justifyContent: 'space-between'
  },
  title: {
    ...Typography.headline,
    color: Colors.textPrimary
  },
  subject: {
    ...Typography.callout,
    color: Colors.primary,
    marginTop: Spacing.tiny
  }
});
```

### Interactions

- **Tap**: Navigate to homework detail
- **Long press**: Show context menu (delete option)
- **Swipe**: iOS swipe-to-delete (optional)

### Animations

- **Appear**: Fade in + slide up (0.3s)
- **Press**: Scale 0.98 with spring
- **Delete**: Slide out + fade (0.3s)

---

## 2. AnswerButton

### Purpose
Interactive button for quiz answers with multiple states (normal, selected, correct, wrong).

### Props (TypeScript)

```typescript
interface AnswerButtonProps {
  text: string;
  label: 'A' | 'B' | 'C' | 'D';
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  showFeedback: boolean;
  onPress: () => void;
  disabled?: boolean;
}
```

### Layout Structure

```
Pressable
└── HStack
    ├── Label Circle (40×40)
    │   └── Text: A/B/C/D
    ├── Answer Text (flex: 1)
    └── Feedback Icon (if showFeedback)
        └── checkmark or xmark (24pt)
```

### State Styling

```typescript
function getButtonStyle(state: ButtonState) {
  if (showFeedback) {
    if (isCorrect) {
      return {
        backgroundColor: Colors.successTint,
        borderColor: Colors.success,
        borderWidth: 2
      };
    }
    if (isWrong) {
      return {
        backgroundColor: Colors.errorTint,
        borderColor: Colors.error,
        borderWidth: 2
      };
    }
  }
  
  if (isSelected) {
    return {
      backgroundColor: Colors.background,
      borderColor: Colors.primary,
      borderWidth: 2
    };
  }
  
  return {
    backgroundColor: Colors.background,
    borderColor: Colors.separator,
    borderWidth: 1
  };
}
```

### Animations

**Press Animation:**
```typescript
const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: withSpring(isPressed ? 0.95 : 1.0, Spring.default) }
  ]
}));
```

**Selection Animation:**
```typescript
const borderAnimation = useAnimatedStyle(() => ({
  borderColor: withTiming(
    isSelected ? Colors.primary : Colors.separator,
    { duration: 200 }
  )
}));
```

**Feedback Animation:**
```typescript
const feedbackAnimation = useAnimatedStyle(() => ({
  opacity: withTiming(showFeedback ? 1 : 0, { duration: 300 }),
  transform: [
    { scale: withSpring(showFeedback ? 1 : 0.8) }
  ]
}));
```

### Haptics

```typescript
function handlePress() {
  if (disabled || showFeedback) return;
  
  // Light impact on press
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  
  // Animate press
  setIsPressed(true);
  
  setTimeout(() => {
    setIsPressed(false);
    onPress();
    
    // Success/error haptic after selection
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, 100);
}
```

---

## 3. FeedbackView

### Purpose
Show explanation after answering with visual indicator.

### Props

```typescript
interface FeedbackViewProps {
  isCorrect: boolean;
  explanation: string;
}
```

### Layout

```
VStack (left-aligned)
├── Header HStack
│   ├── Icon (checkmark/xmark, 24pt)
│   └── "Correct!" / "Incorrect" (headline)
└── Explanation Text (body, secondary)
```

### Styling

```typescript
const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
    borderRadius: Radius.medium,
    borderWidth: 1,
    marginTop: Spacing.medium
  },
  correct: {
    backgroundColor: Colors.successTint,
    borderColor: Colors.success
  },
  incorrect: {
    backgroundColor: Colors.errorTint,
    borderColor: Colors.error
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.small
  },
  explanation: {
    ...Typography.body,
    color: Colors.textSecondary
  }
});
```

### Transition

```typescript
<Animated.View
  entering={FadeInDown.duration(300).springify()}
  exiting={FadeOutUp.duration(200)}
>
  {/* Content */}
</Animated.View>
```

---

## 4. ProcessingView

### Purpose
Full-screen overlay showing AI processing status.

### Props

```typescript
interface ProcessingViewProps {
  state: 'generatingQuiz' | 'saving' | 'completed' | 'failed';
  errorMessage?: string;
  onCancel?: () => void;
}
```

### Layout

```
ZStack (full screen)
├── Backdrop (black 40% opacity, blur)
└── Card (centered)
    ├── ProgressView (spinner or checkmark)
    ├── State Icon (brain, save, check, error)
    ├── Title (headline)
    ├── Message (body)
    └── Cancel Button (if processing)
```

### State Icons

```typescript
const icons = {
  generatingQuiz: 'brain',
  saving: 'square.and.arrow.down',
  completed: 'checkmark.circle.fill',
  failed: 'xmark.circle.fill'
};

const colors = {
  generatingQuiz: Colors.primary,
  saving: Colors.primary,
  completed: Colors.success,
  failed: Colors.error
};
```

### Messages

```typescript
const messages = {
  generatingQuiz: {
    title: 'Analyzing Homework',
    message: 'Claude is reading your homework and creating questions...'
  },
  saving: {
    title: 'Saving Quiz',
    message: 'Almost done...'
  },
  completed: {
    title: 'Quiz Ready!',
    message: 'Your quiz is ready to play'
  },
  failed: {
    title: 'Generation Failed',
    message: errorMessage || 'Something went wrong'
  }
};
```

### Animations

```typescript
// Backdrop fade in
<Animated.View
  entering={FadeIn.duration(200)}
  exiting={FadeOut.duration(200)}
  style={styles.backdrop}
/>

// Card scale in
<Animated.View
  entering={ZoomIn.duration(300).springify()}
  exiting={ZoomOut.duration(200)}
  style={styles.card}
/>

// Spinner rotation
const rotation = useSharedValue(0);

useEffect(() => {
  rotation.value = withRepeat(
    withTiming(360, { duration: 1000, easing: Easing.linear }),
    -1
  );
}, []);
```

---

## 5. ProgressBar

### Purpose
Show quiz completion progress (X of 10 questions).

### Props

```typescript
interface ProgressBarProps {
  current: number;    // 0-10
  total: number;      // Always 10
  color?: string;
}
```

### Layout

```
VStack
├── ProgressView (0-1.0)
└── Text: "Question 3 of 10"
```

### Implementation

```typescript
const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color = Colors.primary
}) => {
  const progress = current / total;
  
  const animatedProgress = useSharedValue(0);
  
  useEffect(() => {
    animatedProgress.value = withSpring(progress, Spring.gentle);
  }, [progress]);
  
  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`
  }));
  
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { backgroundColor: color }, progressStyle]}
        />
      </View>
      <Text style={styles.label}>
        Question {current} of {total}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: Colors.separator,
    borderRadius: 2,
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: 2
  },
  label: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    marginTop: Spacing.tiny,
    textAlign: 'center'
  }
});
```

---

## 6. QuizResultsCircle

### Purpose
Circular progress indicator showing final score.

### Props

```typescript
interface QuizResultsCircleProps {
  score: number;        // 0-10
  totalQuestions: number; // 10
  size?: number;        // 200
}
```

### Implementation

```typescript
const QuizResultsCircle: React.FC<QuizResultsCircleProps> = ({
  score,
  totalQuestions,
  size = 200
}) => {
  const percentage = (score / totalQuestions) * 100;
  const progress = useSharedValue(0);
  
  const strokeColor = percentage >= 90 ? Colors.success :
                      percentage >= 70 ? Colors.primary :
                      percentage >= 50 ? Colors.warning :
                      Colors.error;
  
  useEffect(() => {
    progress.value = withTiming(percentage / 100, {
      duration: 1000,
      easing: Easing.bezier(0.42, 0, 0.58, 1)
    });
  }, []);
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 20) / 2}
          stroke={Colors.separator}
          strokeWidth={20}
          fill="none"
        />
        
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={(size - 20) / 2}
          stroke={strokeColor}
          strokeWidth={20}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={2 * Math.PI * ((size - 20) / 2)}
          strokeDashoffset={animatedDashOffset}
        />
      </Svg>
      
      {/* Center text */}
      <View style={styles.centerText}>
        <Text style={styles.score}>{score}/{totalQuestions}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
    </View>
  );
};
```

---

## 7. Screen Components

### HomeworkListView

**Key Features:**
- NavigationStack with large title
- LazyVStack with HomeworkCard items
- Floating action button (bottom-right)
- Pull-to-refresh
- Empty state when no homework
- Sheet modal for capture flow

**Layout:**
```
NavigationStack
├── ScrollView (with refresh control)
│   └── VStack
│       ├── ForEach(homework) → HomeworkCard
│       └── EmptyState (if empty)
└── FloatingActionButton (overlay)
```

### QuizView

**Key Features:**
- Progress bar at top
- Question counter
- Dynamic answer input (MCQ/fill-blank/short-answer)
- Feedback section (after answer)
- Next/Skip buttons
- Exit confirmation dialog

**Layout:**
```
VStack
├── ProgressBar
├── ScrollView
│   └── VStack
│       ├── "Question X of 10"
│       ├── Question text
│       ├── Answer input (type-specific)
│       └── FeedbackView (if answered)
└── Bottom actions
    ├── Next button (if answered)
    └── Skip button (if not answered)
```

### QuizResultsView

**Key Features:**
- Emoji grade indicator
- Circular progress ring
- Stats breakdown
- Action buttons (play again, done)
- Confetti animation (90%+)

**Layout:**
```
ScrollView
└── VStack
    ├── Emoji (80pt) + Grade message
    ├── QuizResultsCircle
    ├── Stats Card
    │   ├── Correct: 8 ✓
    │   ├── Wrong: 2 ✗
    │   └── Time: 2:34 ⏱
    └── Actions
        ├── "Play Again" (primary)
        └── "Done" (secondary)
```

---

## Component Implementation Checklist

For each component:

- [ ] TypeScript interface defined
- [ ] Props documented
- [ ] Layout structure documented
- [ ] Styling tokens used (no hardcoded values)
- [ ] Animations implemented with spring physics
- [ ] Haptic feedback on interactions
- [ ] Dark mode support (semantic colors)
- [ ] Accessibility labels added
- [ ] Minimum 44pt touch targets
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Empty states handled
- [ ] iOS-native feel (bounce, blur, shadows)

---

## Next Steps

- [User Flows](./06-USER-FLOWS.md) - See components in action
- [Design System](./04-DESIGN-SYSTEM.md) - Styling reference
- [Migration Guide](./08-MIGRATION-GUIDE.md) - React Native conversion
