# Prompts System

Complete documentation of the intelligent prompting system that powers quiz generation.

## Overview

The prompts system consists of two key files:
1. **Prompts.json** - Topic-specific prompt templates
2. **TrainingData.json** - Example homework types with recommended quiz strategies

## Prompts.json Structure

Located at: `shared/config/Prompts.json` (2.0.0)

### Top-Level Schema

```json
{
  "version": "2.0.0",
  "description": "Claude AI prompts for smart quiz generation...",
  "prompts": {
    "vision": {
      "generic": {...},
      "maths": {...},
      "english": {...},
      "science": {...},
      "history": {...}
    },
    "text": {...}
  },
  "settings": {
    "questionCount": 10,
    "optionCount": 4,
    "questionTypeDistribution": {...},
    "classificationThreshold": 0.7,
    "topics": ["generic", "maths", "english", "science", "history"]
  }
}
```

### Vision Prompt Structure

Each topic has:

```json
{
  "system": "You are an expert [subject] quiz generator...",
  "user": {
    "prefix": "Analyze this homework image...",
    "instructions": [
      "READ THE CONTENT CAREFULLY:",
      "- Extract all text...",
      "- DETECT SPELLING LISTS: If you see lists of words..."
    ],
    "requirements": [
      "Exactly 10 questions",
      "Mix of question formats...",
      "SPELLING LISTS: Generate MCQ with spelling variations..."
    ],
    "format": {
      "description": "Return ONLY a valid JSON object...",
      "example": {
        "topic": "maths",
        "confidence": 0.95,
        "questions": [...]
      }
    },
    "suffix": "IMPORTANT: Return ONLY the JSON object..."
  }
}
```

### Topic-Specific Prompts

#### Maths Prompt
- Focus: Mathematical reasoning, problem-solving, calculations
- Distribution: 60% MCQ, 30% fill-blank, 10% short-answer
- Special instructions: Include common misconceptions as distractors
- Sample subtopics: algebra, geometry, calculus, statistics

#### English Prompt  
- Focus: Grammar, vocabulary, comprehension, literary analysis
- Distribution: 40% MCQ, 40% fill-blank, 20% short-answer
- **Special feature**: Spelling list detection
  - Detects: statutory words, vocabulary lists, spelling lists
  - Generates: MCQ with correct spelling + 3 plausible misspellings
- Sample subtopics: grammar, spelling, vocabulary, literature

#### Science Prompt
- Focus: Scientific concepts, experiments, terminology
- Distribution: 50% MCQ, 30% fill-blank, 20% short-answer
- Special instructions: Test conceptual understanding
- Sample subtopics: biology, chemistry, physics, earth_science

#### History Prompt
- Focus: Events, causes/effects, significance, chronology
- Distribution: 50% MCQ, 20% fill-blank, 30% short-answer
- Special instructions: Emphasize "why" not just "what"
- Sample subtopics: world_war_2, ancient_rome, victorian_era

#### Generic Prompt
- Focus: General educational content
- Distribution: 60% MCQ, 25% fill-blank, 15% short-answer
- Fallback for unclassified content

## TrainingData.json Structure

Located at: `shared/config/TrainingData.json` (1.0.0)

### Purpose

Provides Claude with concrete examples of different homework types to improve detection and quiz format selection.

### Example Structure

```json
{
  "id": "spelling-list",
  "name": "Spelling/Vocabulary List",
  "description": "Lists of words for spelling memorization",
  "indicators": [
    "Vertical or horizontal list of words",
    "Header like 'Spelling Words', 'Statutory Words'",
    "Words numbered or bulleted",
    "Little to no context or sentences"
  ],
  "recommendedDistribution": {
    "mcq": 0.9,
    "fillBlank": 0.1,
    "shortAnswer": 0.0
  },
  "questionStrategy": {
    "mcq": "Ask 'Which is the correct spelling of [word]?' with 3 plausible misspellings",
    "fillBlank": "Provide sentence with word blanked out",
    "shortAnswer": "Not recommended for spelling lists"
  },
  "exampleHomework": "Spelling Words:\n1. necessary\n2. separate\n3. definitely...",
  "exampleQuestions": [...]
}
```

### All Training Examples

1. **spelling-list** - 90% MCQ (spelling tests)
2. **maths-worksheet** - 50/40/10 mix (calculations)
3. **reading-comprehension** - 40/20/40 mix (analysis)
4. **grammar-exercises** - 50/40/10 mix (language rules)
5. **science-diagram** - 50/30/20 mix (processes)
6. **history-timeline** - 50/20/30 mix (events)
7. **vocabulary-context** - 60/30/10 mix (definitions)

### Selection Criteria

Priority-based rules for matching homework to examples:

```json
{
  "priority": 1,
  "condition": "Image contains list of words with 'Spelling'",
  "action": "Use spelling-list example",
  "confidence": 0.95
}
```

## Smart Title Generation

Based on Claude's topic/subtopic classification:

```typescript
function generateTitle(quiz: Quiz): string {
  // Special cases
  if (subtopic?.includes('spelling')) return 'Spelling Practice';
  if (subtopic?.includes('vocabulary')) return 'Vocabulary';
  
  // Topic mapping
  const topicMap = {
    maths: 'Maths',
    english: 'English',
    science: 'Science',
    history: 'History'
  };
  
  let title = topicMap[quiz.topic] || 'Homework';
  
  // Add formatted subtopic
  if (quiz.subtopic) {
    title += ' - ' + formatSubtopic(quiz.subtopic);
    // "world_war_2" → "World War 2"
  }
  
  return title;
}
```

### Title Examples

- `"Maths - Algebra"`
- `"Maths - Fractions"`
- `"English - Grammar"`
- `"Spelling Practice"`
- `"Science - Biology"`
- `"History - World War 2"`

## PromptManager Implementation

### Loading Configuration

```typescript
export class PromptManager {
  private static prompts: PromptConfig;
  private static trainingData: TrainingData;

  static initialize() {
    // Load from JSON files
    this.prompts = require('../config/Prompts.json');
    this.trainingData = require('../config/TrainingData.json');
    
    console.log(`📝 Loaded prompts v${this.prompts.version}`);
    console.log(`📚 Loaded ${this.trainingData.examples.length} training examples`);
  }
}
```

### Building Vision Prompts

```typescript
static buildVisionPrompt(subject?: string, topic: string = 'generic'): string {
  const topicPrompt = this.prompts.prompts.vision[topic] || 
                      this.prompts.prompts.vision.generic;
  
  const subjectHint = subject ? ` about ${subject}` : '';
  
  let prompt = topicPrompt.system + '\n\n';
  prompt += topicPrompt.user.prefix.replace('{subjectHint}', subjectHint) + '\n\n';
  prompt += topicPrompt.user.instructions.join('\n') + '\n\n';
  
  // Add training examples (up to 3 most relevant)
  const examples = this.selectRelevantExamples(topic);
  prompt += this.buildTrainingExamplesSection(examples) + '\n\n';
  
  prompt += 'Requirements:\n';
  prompt += topicPrompt.user.requirements.map(r => `- ${r}`).join('\n') + '\n\n';
  prompt += topicPrompt.user.format.description + '\n';
  prompt += JSON.stringify(topicPrompt.user.format.example, null, 2) + '\n\n';
  prompt += topicPrompt.user.suffix;
  
  return prompt;
}
```

### Selecting Relevant Examples

```typescript
private static selectRelevantExamples(topic: string): TrainingExample[] {
  const priorities: Record<string, string[]> = {
    maths: ['maths-worksheet'],
    english: ['spelling-list', 'grammar-exercises', 'vocabulary-context'],
    science: ['science-diagram'],
    history: ['history-timeline'],
    generic: ['spelling-list', 'maths-worksheet', 'reading-comprehension']
  };
  
  const priorityIds = priorities[topic] || priorities.generic;
  
  return this.trainingData.examples
    .filter(ex => priorityIds.includes(ex.id))
    .slice(0, 3);
}
```

## Usage Example

```typescript
// Generate quiz for a maths homework image
const prompt = PromptManager.buildVisionPrompt('Mathematics', 'maths');

// Send to Claude with image
const quiz = await aiService.generateQuiz(imageUri, prompt);

// Result: Quiz with 60% MCQ, 30% fill-blank, 10% short-answer
// Title: "Maths - Algebra" (if subtopic detected)
```

## Customization

### Adding New Topics

1. Add topic to `prompts.vision` in Prompts.json
2. Define system message, instructions, requirements
3. Set question type distribution in settings
4. Update topic list in settings array

### Adding Training Examples

1. Add new example object to TrainingData.json `examples` array
2. Define indicators (how to detect this type)
3. Set recommended distribution
4. Provide question strategies
5. Add example homework and questions
6. Update selection criteria rules

### Modifying Distributions

Edit `settings.questionTypeDistribution` in Prompts.json:

```json
{
  "maths": {
    "mcq": 0.7,      // Increase MCQ from 60% to 70%
    "fillBlank": 0.2, // Decrease fill-blank from 30% to 20%
    "shortAnswer": 0.1
  }
}
```

## Best Practices

1. **Keep prompts concise** - Avoid redundancy to save tokens
2. **Provide clear examples** - Show expected JSON format
3. **Be specific about requirements** - "Exactly 10 questions", not "around 10"
4. **Include edge cases** - Spelling list detection, diagram handling
5. **Test with real homework** - Validate prompts with actual images
6. **Version prompts** - Track changes and their impact
7. **Monitor quality** - Check Claude's topic detection accuracy

## See Also

- [API Integration](./02-API-INTEGRATION.md) - How prompts are sent to Claude
- [Data Models](./01-DATA-MODELS.md) - Quiz and Question structures
- [User Flows](./06-USER-FLOWS.md) - End-to-end quiz generation flow
