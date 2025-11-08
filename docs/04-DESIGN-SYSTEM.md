# Design System

Complete design tokens, patterns, and iOS-native styling guidelines for Cheater app.

## Design Philosophy

**Goal**: Create a native iOS experience that feels like a first-party Apple app.

**Principles**:
1. **Clarity**: Content is paramount
2. **Deference**: UI should defer to content
3. **Depth**: Visual layers convey hierarchy
4. **Consistency**: Familiar patterns throughout
5. **Performance**: 60fps animations always

## Color Tokens

### iOS Semantic Colors

```typescript
export const Colors = {
  // Primary
  primary: '#007AFF',           // iOS Blue
  primaryTint: '#007AFF1A',     // 10% opacity
  
  // Semantic
  success: '#34C759',           // iOS Green
  successTint: '#34C75926',     // 15% opacity
  error: '#FF3B30',             // iOS Red
  errorTint: '#FF3B3026',       // 15% opacity
  warning: '#FF9500',           // iOS Orange
  warningTint: '#FF950026',     // 15% opacity
  
  // Neutral (Light/Dark adaptive)
  background: {
    light: '#FFFFFF',
    dark: '#000000'
  },
  secondaryBackground: {
    light: '#F2F2F7',
    dark: '#1C1C1E'
  },
  tertiaryBackground: {
    light: '#FFFFFF',
    dark: '#2C2C2E'
  },
  
  // Card/Surface
  cardBackground: {
    light: '#FFFFFF',
    dark: '#1C1C1E'
  },
  
  // Text
  textPrimary: {
    light: '#000000',
    dark: '#FFFFFF'
  },
  textSecondary: {
    light: '#8E8E93',   // iOS Gray
    dark: '#8E8E93'
  },
  textTertiary: {
    light: '#C7C7CC',
    dark: '#48484A'
  },
  
  // Separators
  separator: {
    light: '#C6C6C8',
    dark: '#38383A'
  },
  
  // Gradients
  gradientStart: '#007AFF1A',  // Blue 10%
  gradientEnd: '#34C7591A',    // Green 10%
};
```

### SwiftUI Implementation

```swift
extension Color {
    static let appPrimary = Color.blue
    static let appSuccess = Color.green
    static let appError = Color.red
    static let appWarning = Color.orange
    
    static let appBackground = Color(uiColor: .systemBackground)
    static let appSecondaryBackground = Color(uiColor: .secondarySystemBackground)
    static let appCardBackground = Color(uiColor: .systemBackground)
    
    static let appTextPrimary = Color.primary
    static let appTextSecondary = Color.secondary
}
```

### React Native Implementation

```typescript
import { useColorScheme } from 'react-native';

export function useColors() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  
  return {
    primary: Colors.primary,
    success: Colors.success,
    error: Colors.error,
    warning: Colors.warning,
    background: isDark ? Colors.background.dark : Colors.background.light,
    secondaryBackground: isDark ? Colors.secondaryBackground.dark : Colors.secondaryBackground.light,
    cardBackground: isDark ? Colors.cardBackground.dark : Colors.cardBackground.light,
    textPrimary: isDark ? Colors.textPrimary.dark : Colors.textPrimary.light,
    textSecondary: Colors.textSecondary.light, // Same for both
    separator: isDark ? Colors.separator.dark : Colors.separator.light,
  };
}
```

## Typography

### Scale

```typescript
export const Typography = {
  // Display
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,  // Bold
    letterSpacing: 0.37
  },
  
  // Titles
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '400' as const,  // Regular
    letterSpacing: 0.36
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400' as const,
    letterSpacing: 0.35
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600' as const,  // Semibold
    letterSpacing: 0.38
  },
  
  // Body
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.41
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as const,
    letterSpacing: -0.41
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400' as const,
    letterSpacing: -0.32
  },
  subheadline: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: -0.24
  },
  
  // Small
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
    letterSpacing: -0.08
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.07
  }
};
```

### Font Family

**iOS**: SF Pro (System font)
**React Native**: System default or closest equivalent

```typescript
// React Native
const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
});
```

## Spacing

### Scale (8px base)

```typescript
export const Spacing = {
  tiny: 4,      // 0.5 × base
  small: 8,     // 1 × base
  medium: 16,   // 2 × base
  large: 24,    // 3 × base
  xLarge: 32,   // 4 × base
  xxLarge: 48,  // 6 × base
  xxxLarge: 64, // 8 × base
  
  // Specific use cases
  cardSpacing: 16,
  listSpacing: 12,
  buttonPadding: 16,
  screenPadding: 16,
  sectionSpacing: 24
};
```

### Usage

```typescript
// Padding
padding: Spacing.medium  // 16px

// Margin
marginTop: Spacing.large  // 24px

// Gap (Flexbox)
gap: Spacing.small  // 8px
```

## Corner Radius

```typescript
export const Radius = {
  small: 8,
  medium: 12,
  large: 16,
  xLarge: 20,
  
  // Specific use cases
  button: 12,
  card: 16,
  modal: 20,
  image: 12,
  input: 10,
  
  // Special
  circle: 999  // For circular elements
};
```

## Shadows

### iOS Native Shadows

```typescript
export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4  // Android
  },
  
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6
  },
  
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10
  },
  
  // Pressed state (reduced shadow)
  pressed: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  }
};
```

### SwiftUI Shadows

```swift
.shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 2)
```

## Icon Sizes

```typescript
export const IconSize = {
  tiny: 12,
  small: 16,
  medium: 20,
  large: 24,
  xLarge: 32,
  xxLarge: 48,
  xxxLarge: 64,
  
  // Specific
  tabBar: 28,
  navBar: 22,
  button: 20,
  listItem: 24
};
```

## Touch Targets

```typescript
export const TouchTarget = {
  minimum: 44,      // iOS minimum recommended
  button: 56,       // Comfortable button height
  listItem: 60,     // List row height
  icon: 44,         // Icon button size
  fab: 56           // Floating action button
};
```

## Animation Timings

### Duration

```typescript
export const Duration = {
  instant: 0,
  fast: 200,        // 0.2s
  medium: 300,      // 0.3s
  slow: 500,        // 0.5s
  xSlow: 800        // 0.8s
};
```

### iOS Spring Configuration

```typescript
export const Spring = {
  // Default iOS spring
  default: {
    damping: 0.7,
    stiffness: 300,
    mass: 1,
    response: 0.3
  },
  
  // Bouncy (more playful)
  bouncy: {
    damping: 0.5,
    stiffness: 400,
    mass: 1,
    response: 0.25
  },
  
  // Gentle (more subtle)
  gentle: {
    damping: 0.85,
    stiffness: 200,
    mass: 1,
    response: 0.4
  },
  
  // Snappy (quick response)
  snappy: {
    damping: 0.6,
    stiffness: 500,
    mass: 0.8,
    response: 0.2
  }
};
```

### Easing Curves

```typescript
export const Easing = {
  // iOS native curves
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
  easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
  linear: 'cubic-bezier(0, 0, 1, 1)'
};
```

### React Native Reanimated

```typescript
import { withSpring, withTiming } from 'react-native-reanimated';

// Spring animation (iOS-like)
const animatedValue = withSpring(toValue, {
  damping: 15,
  stiffness: 150,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2
});

// Timing animation
const animatedValue = withTiming(toValue, {
  duration: 300,
  easing: Easing.bezier(0.42, 0, 0.58, 1)
});
```

## iOS-Specific Patterns

### Liquid Glass / Frosted Blur

```typescript
// React Native (expo-blur)
import { BlurView } from 'expo-blur';

<BlurView
  intensity={40}
  tint="light"  // or "dark"
  style={styles.blurContainer}
>
  {/* Content */}
</BlurView>
```

```swift
// SwiftUI
.background(.ultraThinMaterial)
.background(.thinMaterial)
.background(.regularMaterial)
.background(.thickMaterial)
```

### Bounce Scroll

```typescript
// React Native ScrollView
<ScrollView
  bounces={true}
  bouncesZoom={true}
  alwaysBounceVertical={true}
  decelerationRate="fast"
>
```

### Pull-to-Refresh

```typescript
import { RefreshControl } from 'react-native';

<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={Colors.primary}
    />
  }
>
```

### Haptic Feedback

```typescript
import * as Haptics from 'expo-haptics';

// Light impact (button press)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium impact (selection)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Heavy impact (significant action)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// Success notification
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Error notification
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// Warning notification
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

// Selection change (picker)
Haptics.selectionAsync();
```

### Modal Presentation

```typescript
// Sheet-style modal (slides from bottom)
<Modal
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={onClose}
>
```

### Navigation Transitions

```typescript
// iOS-style push animation
import { CardStyleInterpolators } from '@react-navigation/stack';

<Stack.Screen
  name="Detail"
  component={DetailScreen}
  options={{
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    gestureDirection: 'horizontal',
    gestureEnabled: true
  }}
/>
```

## Component Styling Examples

### iOS-Style Button

```typescript
const styles = StyleSheet.create({
  button: {
    height: TouchTarget.button,
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.button
  },
  
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    ...Shadow.pressed
  },
  
  buttonText: {
    ...Typography.headline,
    color: '#FFFFFF'
  }
});
```

### iOS-Style Card

```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground.light,
    borderRadius: Radius.card,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    ...Shadow.card
  }
});
```

### iOS-Style Input

```typescript
const styles = StyleSheet.create({
  input: {
    height: 44,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.secondaryBackground.light,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.separator.light,
    ...Typography.body,
    color: Colors.textPrimary.light
  },
  
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background.light
  }
});
```

### iOS-Style List Row

```typescript
const styles = StyleSheet.create({
  listRow: {
    height: TouchTarget.listItem,
    paddingHorizontal: Spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator.light
  },
  
  listRowPressed: {
    backgroundColor: Colors.secondaryBackground.light
  }
});
```

## Accessibility

### Text Scaling

Support iOS Dynamic Type:

```typescript
import { useAccessibilityScale } from 'react-native';

const scale = useAccessibilityScale();
const fontSize = Typography.body.fontSize * scale;
```

### Contrast Ratios

- **Normal text**: 4.5:1 minimum
- **Large text** (18pt+): 3:1 minimum
- **Interactive elements**: 3:1 minimum

### Touch Targets

Minimum 44×44 pt for all interactive elements.

## Dark Mode Support

All colors automatically adapt using semantic tokens:

```typescript
const colors = useColors();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.textPrimary }}>
    Content
  </Text>
</View>
```

## Performance Guidelines

1. **Use hardware acceleration** for animations
2. **Avoid layout changes** during animations
3. **Use native driver** for animations when possible
4. **Debounce** expensive operations
5. **Memoize** components with React.memo
6. **Virtualize** long lists with FlatList

## Design Checklist

- [ ] All colors use semantic tokens
- [ ] Dark mode tested and working
- [ ] Typography follows iOS scale
- [ ] Spacing uses 8px base scale
- [ ] Corner radius consistent
- [ ] Shadows match iOS style
- [ ] Animations use spring physics
- [ ] Haptic feedback on interactions
- [ ] Touch targets minimum 44pt
- [ ] Blur effects where appropriate
- [ ] Bounce scroll enabled
- [ ] Pull-to-refresh implemented
- [ ] 60fps maintained
- [ ] Accessibility labels added
- [ ] Dynamic Type supported

## Next Steps

- [UI Components](./05-UI-COMPONENTS.md) - Component implementations
- [User Flows](./06-USER-FLOWS.md) - Animation sequences
- [Migration Guide](./08-MIGRATION-GUIDE.md) - React Native conversion
