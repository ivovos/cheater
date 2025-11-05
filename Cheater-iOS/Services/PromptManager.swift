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
    func buildVisionPrompt(subject: String? = nil) -> String {
        let vision = config.prompts.vision
        let subjectHint = subject.map { " about \($0)" } ?? ""

        var prompt = vision.system + "\n\n"

        // Add prefix
        prompt += vision.user.prefix.replacingOccurrences(of: "{subjectHint}", with: subjectHint) + "\n\n"

        // Add instructions
        prompt += vision.user.instructions.joined(separator: "\n") + "\n\n"

        // Add requirements
        prompt += "Requirements:\n"
        prompt += vision.user.requirements.map { "- \($0)" }.joined(separator: "\n") + "\n\n"

        // Add format
        prompt += vision.user.format.description + "\n"

        // Add example (as JSON)
        if let exampleData = try? JSONEncoder().encode(vision.user.format.example),
           let exampleString = String(data: exampleData, encoding: .utf8) {
            prompt += exampleString + "\n\n"
        }

        // Add suffix
        prompt += vision.user.suffix

        return prompt
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
    let vision: VisionPrompt
    let text: TextPrompt
}

struct VisionPrompt: Codable {
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
    let example: FormatExample
}

struct FormatExample: Codable {
    let questions: [ExampleQuestion]
}

struct ExampleQuestion: Codable {
    let question: String
    let options: [String]
    let correctIndex: Int
    let explanation: String
}

struct PromptSettings: Codable {
    let questionCount: Int
    let optionCount: Int
    let minExplanationLength: Int
    let maxExplanationLength: Int
}
