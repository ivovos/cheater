//
//  PromptManager.swift
//  Cheater-iOS
//
//  Manages AI prompts loaded from configuration file
//

import Foundation

/// Manages loading and formatting of AI prompts
struct PromptManager {
    // MARK: - Singleton

    static let shared = PromptManager()

    // MARK: - Properties

    private let config: PromptConfig

    // MARK: - Initialization

    private init() {
        // Load prompts from JSON file
        guard let url = Bundle.main.url(forResource: "Prompts", withExtension: "json", subdirectory: "Config"),
              let data = try? Data(contentsOf: url),
              let config = try? JSONDecoder().decode(PromptConfig.self, from: data) else {
            fatalError("Failed to load Prompts.json. Ensure the file exists in Config folder.")
        }

        self.config = config
        print("📝 Loaded prompts version \(config.version)")
    }

    // MARK: - Public Methods

    /// Build vision prompt for image-based quiz generation
    /// - Parameters:
    ///   - subject: Optional subject hint
    ///   - topic: Topic for specialized prompts (maths, english, science, history, generic)
    /// - Returns: Formatted prompt string
    func buildVisionPrompt(subject: String? = nil, topic: String = "generic") -> String {
        // Get topic-specific prompt, fallback to generic
        guard let topicPrompt = config.prompts.vision[topic] ?? config.prompts.vision["generic"] else {
            print("⚠️ No prompt found for topic '\(topic)', using generic")
            return buildFallbackPrompt(subject: subject)
        }

        let subjectHint = subject.map { " about \($0)" } ?? ""

        var prompt = topicPrompt.system + "\n\n"

        // Add prefix
        prompt += topicPrompt.user.prefix.replacingOccurrences(of: "{subjectHint}", with: subjectHint) + "\n\n"

        // Add instructions
        prompt += topicPrompt.user.instructions.joined(separator: "\n") + "\n\n"

        // Add requirements
        prompt += "Requirements:\n"
        prompt += topicPrompt.user.requirements.map { "- \($0)" }.joined(separator: "\n") + "\n\n"

        // Add format
        prompt += topicPrompt.user.format.description + "\n"

        // Add example (as JSON)
        if let exampleDict = topicPrompt.user.format.example.value as? [String: Any],
           let jsonData = try? JSONSerialization.data(withJSONObject: exampleDict, options: [.prettyPrinted]),
           let exampleString = String(data: jsonData, encoding: .utf8) {
            prompt += exampleString + "\n\n"
        }

        // Add suffix
        prompt += topicPrompt.user.suffix

        return prompt
    }

    /// Get available topics
    var availableTopics: [String] {
        config.settings.topics
    }

    /// Get classification threshold
    var classificationThreshold: Double {
        config.settings.classificationThreshold
    }

    /// Get question type distribution for a topic
    func questionTypeDistribution(for topic: String) -> QuestionTypeDistribution? {
        config.settings.questionTypeDistribution[topic]
    }

    // MARK: - Private Methods

    private func buildFallbackPrompt(subject: String?) -> String {
        let subjectHint = subject.map { " about \($0)" } ?? ""
        return """
        You are an educational quiz generator for secondary school students.

        Analyze this homework image and generate a 10-question multiple choice quiz from its content\(subjectHint).

        Requirements:
        - Exactly 10 questions
        - Each question has exactly 4 options (labeled A, B, C, D)
        - One correct answer per question
        - Questions test understanding, not just memorization
        - Include brief explanations for correct answers

        Return ONLY a valid JSON object in this format:
        {
          "topic": "generic",
          "confidence": 0.5,
          "questions": [
            {
              "type": "mcq",
              "question": "...",
              "options": ["A", "B", "C", "D"],
              "correctIndex": 0,
              "explanation": "..."
            }
          ]
        }
        """
    }

    /// Build text prompt for text-based quiz generation
    func buildTextPrompt(text: String, subject: String? = nil) -> String {
        let textPrompt = config.prompts.text
        let subjectHint = subject.map { " about \($0)" } ?? ""

        var prompt = textPrompt.system + "\n\n"

        // Add prefix
        prompt += textPrompt.user.prefix.replacingOccurrences(of: "{subjectHint}", with: subjectHint) + "\n\n"

        // Add actual homework text
        prompt += text + "\n\n"

        // Add requirements
        prompt += "Requirements:\n"
        prompt += textPrompt.user.requirements.map { "- \($0)" }.joined(separator: "\n") + "\n\n"

        // Add format
        prompt += textPrompt.user.format.description + "\n"

        // Add example (as JSON)
        if let exampleData = try? JSONEncoder().encode(textPrompt.user.format.example),
           let exampleString = String(data: exampleData, encoding: .utf8) {
            prompt += exampleString + "\n\n"
        }

        // Add suffix
        prompt += textPrompt.user.suffix

        return prompt
    }

    /// Get settings
    var settings: PromptSettings {
        config.settings
    }
}

// MARK: - Models

struct PromptConfig: Codable {
    let version: String
    let description: String
    let prompts: Prompts
    let settings: PromptSettings
}

struct Prompts: Codable {
    let vision: [String: TopicPrompt]  // Changed to dictionary of topics
    let text: TextPrompt
}

struct TopicPrompt: Codable {
    let system: String
    let user: VisionUserPrompt
}

struct VisionUserPrompt: Codable {
    let prefix: String
    let instructions: [String]
    let requirements: [String]
    let format: FormatSpec
    let suffix: String
}

struct TextPrompt: Codable {
    let system: String
    let user: TextUserPrompt
}

struct TextUserPrompt: Codable {
    let prefix: String
    let requirements: [String]
    let format: FormatSpec
    let suffix: String
}

struct FormatSpec: Codable {
    let description: String
    let example: AnyCodable  // Changed to support flexible format examples
}

struct ExampleQuestion: Codable {
    let question: String
    let options: [String]?
    let correctIndex: Int?
    let correctAnswer: String?
    let explanation: String
    let type: String?
}

struct PromptSettings: Codable {
    let questionCount: Int
    let optionCount: Int
    let minExplanationLength: Int
    let maxExplanationLength: Int
    let questionTypeDistribution: [String: QuestionTypeDistribution]
    let classificationThreshold: Double
    let topics: [String]
}

struct QuestionTypeDistribution: Codable {
    let mcq: Double
    let fillBlank: Double
    let shortAnswer: Double
}

// Helper for flexible JSON encoding/decoding
struct AnyCodable: Codable {
    let value: Any

    init(_ value: Any) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()

        if let dict = try? container.decode([String: AnyCodable].self) {
            self.value = dict.mapValues { $0.value }
        } else if let array = try? container.decode([AnyCodable].self) {
            self.value = array.map { $0.value }
        } else if let string = try? container.decode(String.self) {
            self.value = string
        } else if let int = try? container.decode(Int.self) {
            self.value = int
        } else if let double = try? container.decode(Double.self) {
            self.value = double
        } else if let bool = try? container.decode(Bool.self) {
            self.value = bool
        } else {
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Unsupported type")
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()

        switch value {
        case let dict as [String: Any]:
            try container.encode(dict.mapValues { AnyCodable($0) })
        case let array as [Any]:
            try container.encode(array.map { AnyCodable($0) })
        case let string as String:
            try container.encode(string)
        case let int as Int:
            try container.encode(int)
        case let double as Double:
            try container.encode(double)
        case let bool as Bool:
            try container.encode(bool)
        default:
            throw EncodingError.invalidValue(value, EncodingError.Context(codingPath: container.codingPath, debugDescription: "Unsupported type"))
        }
    }
}
