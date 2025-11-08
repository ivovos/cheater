/**
 * PromptManager - Loads and builds prompts for Claude Vision API
 * Ported from Cheater-iOS/Services/PromptManager.swift
 * Based on docs/03-PROMPTS-SYSTEM.md
 */

const PromptsJSON = require('../config/Prompts.json');
const TrainingDataJSON = require('../config/TrainingData.json');

// Types for the configuration files
interface PromptConfig {
  version: string;
  description: string;
  prompts: {
    vision: {
      [key: string]: {
        system: string;
        user: {
          prefix: string;
          instructions: string[];
          requirements: string[];
          format: {
            description: string;
            example: any;
          };
          suffix: string;
        };
      };
    };
  };
  settings: {
    questionCount: number;
    optionCount: number;
    questionTypeDistribution: {
      [key: string]: {
        mcq: number;
        fillBlank: number;
        shortAnswer: number;
      };
    };
    classificationThreshold: number;
    topics: string[];
  };
}

interface TrainingExample {
  id: string;
  name: string;
  description: string;
  indicators: string[];
  recommendedDistribution: {
    mcq: number;
    fillBlank: number;
    shortAnswer: number;
  };
  questionStrategy: {
    mcq: string;
    fillBlank: string;
    shortAnswer: string;
  };
  exampleHomework: string;
  exampleQuestions: any[];
}

interface TrainingData {
  version: string;
  description: string;
  examples: TrainingExample[];
}

export class PromptManager {
  private static prompts: PromptConfig = PromptsJSON as PromptConfig;
  private static trainingData: TrainingData = TrainingDataJSON as TrainingData;

  /**
   * Initialize the PromptManager (called once on app start)
   */
  static initialize() {
    console.log(`📝 Loaded prompts v${this.prompts.version}`);
    console.log(`📚 Loaded ${this.trainingData.examples.length} training examples`);
  }

  /**
   * Build a vision prompt for Claude
   * @param subject Optional subject hint (e.g., "Mathematics")
   * @param topic Topic type ("generic", "maths", "english", "science", "history")
   */
  static buildVisionPrompt(subject?: string, topic: string = 'generic'): string {
    const topicPrompt = this.prompts.prompts.vision[topic] ||
                        this.prompts.prompts.vision.generic;

    const subjectHint = subject ? ` about ${subject}` : '';

    let prompt = topicPrompt.system + '\n\n';
    prompt += topicPrompt.user.prefix.replace('{subjectHint}', subjectHint) + '\n\n';

    // Add instructions
    prompt += topicPrompt.user.instructions.join('\n') + '\n\n';

    // Add training examples (up to 3 most relevant)
    const examples = this.selectRelevantExamples(topic);
    if (examples.length > 0) {
      prompt += this.buildTrainingExamplesSection(examples) + '\n\n';
    }

    // Add requirements
    prompt += 'Requirements:\n';
    prompt += topicPrompt.user.requirements.map(r => `- ${r}`).join('\n') + '\n\n';

    // Add format description and example
    prompt += topicPrompt.user.format.description + '\n';
    prompt += JSON.stringify(topicPrompt.user.format.example, null, 2) + '\n\n';

    // Add suffix
    prompt += topicPrompt.user.suffix;

    return prompt;
  }

  /**
   * Select relevant training examples based on topic
   */
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

  /**
   * Build the training examples section of the prompt
   */
  private static buildTrainingExamplesSection(examples: TrainingExample[]): string {
    let section = 'Here are some examples of different homework types:\n\n';

    examples.forEach((example, index) => {
      section += `Example ${index + 1}: ${example.name}\n`;
      section += `Description: ${example.description}\n`;
      section += `Indicators:\n`;
      example.indicators.forEach(indicator => {
        section += `  - ${indicator}\n`;
      });
      section += `\nRecommended distribution:\n`;
      section += `  - MCQ: ${Math.round(example.recommendedDistribution.mcq * 100)}%\n`;
      section += `  - Fill-in-blank: ${Math.round(example.recommendedDistribution.fillBlank * 100)}%\n`;
      section += `  - Short answer: ${Math.round(example.recommendedDistribution.shortAnswer * 100)}%\n`;
      section += `\n`;
    });

    return section;
  }

  /**
   * Get question type distribution for a topic
   */
  static getQuestionTypeDistribution(topic: string): {
    mcq: number;
    fillBlank: number;
    shortAnswer: number;
  } {
    return this.prompts.settings.questionTypeDistribution[topic] ||
           this.prompts.settings.questionTypeDistribution.generic;
  }

  /**
   * Get all available topics
   */
  static getAvailableTopics(): string[] {
    return this.prompts.settings.topics;
  }

  /**
   * Get classification threshold
   */
  static getClassificationThreshold(): number {
    return this.prompts.settings.classificationThreshold;
  }

  /**
   * Get training example by ID
   */
  static getTrainingExample(id: string): TrainingExample | undefined {
    return this.trainingData.examples.find(ex => ex.id === id);
  }

  /**
   * Get all training examples
   */
  static getAllTrainingExamples(): TrainingExample[] {
    return this.trainingData.examples;
  }
}

// Initialize on module load
PromptManager.initialize();
