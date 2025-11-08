# Shared Configuration Files

This folder contains configuration files shared between iOS and React Native implementations.

## Files

### Prompts.json (v2.0.0)

**Purpose**: Topic-specific prompt templates for Claude Vision API.

**Structure**:
- `version`: Configuration version
- `prompts.vision`: Topic-specific vision prompts (maths, english, science, history, generic)
- `prompts.text`: Text-based prompts (legacy)
- `settings`: Question type distributions and thresholds

**Usage**:
```typescript
import PromptsJSON from '../shared/config/Prompts.json';

const prompt = PromptsJSON.prompts.vision.maths;
```

**Topics**:
- **generic**: Fallback for unclassified content
- **maths**: Mathematical reasoning and calculations
- **english**: Grammar, vocabulary, spelling, literature
- **science**: Biology, chemistry, physics
- **history**: Historical events and analysis

**Special Features**:
- Spelling list detection (English prompt)
- Question type distributions per topic
- Format specifications with examples

---

### TrainingData.json (v1.0.0)

**Purpose**: Example homework types to improve Claude's detection and quiz format selection.

**Structure**:
- `version`: Training data version
- `examples`: Array of 7 homework type examples
- `selectionCriteria`: Priority rules for matching
- `usage`: Instructions for Claude

**Examples**:
1. **spelling-list**: Spelling/vocabulary practice (90% MCQ)
2. **maths-worksheet**: Problem-solving calculations
3. **reading-comprehension**: Text analysis
4. **grammar-exercises**: Language rules
5. **science-diagram**: Labeled diagrams and processes
6. **history-timeline**: Events and chronology
7. **vocabulary-context**: Word definitions and usage

**Usage**:
```typescript
import TrainingDataJSON from '../shared/config/TrainingData.json';

const examples = TrainingDataJSON.examples;
const spellingExample = examples.find(ex => ex.id === 'spelling-list');
```

---

## Updating Configuration

### Adding a New Topic to Prompts.json

1. Add entry to `prompts.vision`:
```json
{
  "newTopic": {
    "system": "You are an expert ... quiz generator",
    "user": {
      "prefix": "Analyze this ... homework",
      "instructions": [...],
      "requirements": [...],
      "format": {...},
      "suffix": "..."
    }
  }
}
```

2. Add distribution to `settings.questionTypeDistribution`:
```json
{
  "newTopic": {
    "mcq": 0.5,
    "fillBlank": 0.3,
    "shortAnswer": 0.2
  }
}
```

3. Add to topics list:
```json
{
  "topics": ["generic", "maths", "english", "science", "history", "newTopic"]
}
```

### Adding a Training Example

1. Add to `examples` array in TrainingData.json:
```json
{
  "id": "new-example",
  "name": "Example Name",
  "description": "...",
  "indicators": ["...", "..."],
  "recommendedDistribution": {
    "mcq": 0.6,
    "fillBlank": 0.3,
    "shortAnswer": 0.1
  },
  "questionStrategy": {
    "mcq": "...",
    "fillBlank": "...",
    "shortAnswer": "..."
  },
  "exampleHomework": "...",
  "exampleQuestions": [...]
}
```

2. Add selection rule to `selectionCriteria.rules`:
```json
{
  "priority": 1,
  "condition": "Image contains ...",
  "action": "Use new-example",
  "confidence": 0.9
}
```

---

## Version History

### Prompts.json

**v2.0.0** (Current)
- Added spelling list detection
- Added training data examples section
- Topic-specific prompts for all subjects
- Multiple question type support

**v1.0.0**
- Initial version
- Generic prompts only
- MCQ questions only

### TrainingData.json

**v1.0.0** (Current)
- Initial release
- 7 homework type examples
- Selection criteria rules
- Usage instructions

---

## Best Practices

1. **Version Control**: Increment version number when making breaking changes
2. **Testing**: Test prompt changes with real homework images
3. **Documentation**: Update this README when adding features
4. **Consistency**: Match prompt style and format across topics
5. **Performance**: Keep prompts concise to minimize token usage

---

## Integration

### iOS (Swift)

```swift
// PromptManager loads from bundle
guard let url = Bundle.main.url(forResource: "Prompts", withExtension: "json"),
      let data = try? Data(contentsOf: url),
      let config = try? JSONDecoder().decode(PromptConfig.self, from: data) else {
    fatalError("Failed to load Prompts.json")
}
```

### React Native (TypeScript)

```typescript
// Import directly
import PromptsJSON from '../shared/config/Prompts.json';
import TrainingDataJSON from '../shared/config/TrainingData.json';

// Or link to this folder
ln -s ../../shared/config ./config
```

---

## See Also

- [API Integration Documentation](../../docs/02-API-INTEGRATION.md)
- [Prompts System Documentation](../../docs/03-PROMPTS-SYSTEM.md)
- [Migration Guide](../../docs/08-MIGRATION-GUIDE.md)
