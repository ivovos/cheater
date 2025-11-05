//
//  AIService.swift
//  Cheater-iOS
//
//  AI service for quiz generation using Claude API
//

import Foundation

// MARK: - AI Errors
enum AIError: LocalizedError {
    case missingAPIKey
    case invalidRequest
    case networkError(Error)
    case invalidResponse
    case parsingError(String)
    case quotaExceeded
    case serverError(Int)

    var errorDescription: String? {
        switch self {
        case .missingAPIKey:
            return "API key not configured"
        case .invalidRequest:
            return "Invalid request parameters"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .invalidResponse:
            return "Invalid response from AI service"
        case .parsingError(let message):
            return "Failed to parse quiz: \(message)"
        case .quotaExceeded:
            return "API quota exceeded. Please try again later."
        case .serverError(let code):
            return "Server error (code: \(code))"
        }
    }

    var recoverySuggestion: String? {
        switch self {
        case .missingAPIKey:
            return "Please configure your Claude API key in Config.plist"
        case .networkError:
            return "Please check your internet connection and try again."
        case .quotaExceeded:
            return "You've reached your API limit. Please wait or upgrade your plan."
        default:
            return "Please try again. If the problem persists, contact support."
        }
    }
}

// MARK: - AI Service
actor AIService {
    // MARK: - Properties

    private let apiKey: String
    private let apiURL = URL(string: "https://api.anthropic.com/v1/messages")!
    private let model = "claude-sonnet-4-20250514"
    private let maxTokens = 4096

    // MARK: - Initialization

    init(apiKey: String? = nil) throws {
        // Try to get API key from Config.plist or parameter
        if let key = apiKey {
            self.apiKey = key
        } else if let key = Bundle.main.object(forInfoDictionaryKey: "ANTHROPIC_API_KEY") as? String, !key.isEmpty {
            self.apiKey = key
        } else {
            throw AIError.missingAPIKey
        }
    }

    // MARK: - Public Methods

    /// Generate quiz from OCR text
    /// - Parameters:
    ///   - text: Extracted text from homework
    ///   - subject: Optional subject hint
    /// - Returns: Generated Quiz
    /// - Throws: AIError if generation fails
    func generateQuiz(from text: String, subject: String? = nil) async throws -> Quiz {
        // Validate input
        guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            throw AIError.invalidRequest
        }

        // Build prompt
        let prompt = buildPrompt(text: text, subject: subject)

        // Create request
        var request = URLRequest(url: apiURL)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
        request.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")

        // Build request body
        let requestBody: [String: Any] = [
            "model": model,
            "max_tokens": maxTokens,
            "messages": [
                [
                    "role": "user",
                    "content": prompt
                ]
            ]
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)

        // Make request
        let (data, response) = try await URLSession.shared.data(for: request)

        // Validate response
        guard let httpResponse = response as? HTTPURLResponse else {
            throw AIError.invalidResponse
        }

        switch httpResponse.statusCode {
        case 200:
            break
        case 429:
            throw AIError.quotaExceeded
        case 400..<500:
            throw AIError.invalidRequest
        case 500..<600:
            throw AIError.serverError(httpResponse.statusCode)
        default:
            throw AIError.invalidResponse
        }

        // Parse response
        let quiz = try parseQuizResponse(data: data)

        return quiz
    }

    // MARK: - Private Methods

    private func buildPrompt(text: String, subject: String?) -> String {
        let subjectHint = subject.map { " about \($0)" } ?? ""

        return """
        You are an educational quiz generator for secondary school students.

        Generate a 10-question multiple choice quiz from this homework content\(subjectHint):

        \(text)

        Requirements:
        - Exactly 10 questions
        - Each question has exactly 4 options (labeled A, B, C, D)
        - One correct answer per question
        - Questions test understanding, not just memorization
        - Appropriate difficulty for secondary school students
        - Include a brief (1-2 sentence) explanation for each correct answer
        - Questions should cover different aspects of the content
        - Avoid trick questions

        Return ONLY a valid JSON object in this EXACT format (no markdown, no code blocks, just pure JSON):
        {
          "questions": [
            {
              "question": "What is...",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctIndex": 0,
              "explanation": "Brief explanation..."
            }
          ]
        }

        IMPORTANT: Return ONLY the JSON object, nothing else. No explanations, no markdown formatting.
        """
    }

    private func parseQuizResponse(data: Data) throws -> Quiz {
        // Parse Claude API response
        struct ClaudeResponse: Codable {
            struct Content: Codable {
                let text: String
            }
            let content: [Content]
        }

        let decoder = JSONDecoder()

        // Decode outer Claude response
        guard let claudeResponse = try? decoder.decode(ClaudeResponse.self, from: data),
              let contentText = claudeResponse.content.first?.text else {
            throw AIError.parsingError("Failed to decode Claude response")
        }

        // Extract JSON from response (remove any markdown formatting)
        let jsonText = extractJSON(from: contentText)

        guard let jsonData = jsonText.data(using: .utf8) else {
            throw AIError.parsingError("Failed to convert text to data")
        }

        // Parse quiz JSON
        let quizResponse = try decoder.decode(Quiz.ClaudeResponse.self, from: jsonData)

        // Validate quiz
        guard quizResponse.questions.count == 10 else {
            throw AIError.parsingError("Quiz must have exactly 10 questions, got \(quizResponse.questions.count)")
        }

        // Validate all questions
        for (index, question) in quizResponse.questions.enumerated() {
            guard question.options.count == 4 else {
                throw AIError.parsingError("Question \(index + 1) must have 4 options, got \(question.options.count)")
            }
            guard question.correctIndex >= 0 && question.correctIndex < 4 else {
                throw AIError.parsingError("Question \(index + 1) has invalid correctIndex: \(question.correctIndex)")
            }
        }

        // Create Quiz (with placeholder homework ID)
        let quiz = Quiz(from: quizResponse, homeworkId: UUID())

        return quiz
    }

    private func extractJSON(from text: String) -> String {
        // Remove markdown code blocks if present
        var cleaned = text.trimmingCharacters(in: .whitespacesAndNewlines)

        // Remove ```json and ``` if present
        if cleaned.hasPrefix("```json") {
            cleaned = cleaned.replacingOccurrences(of: "```json", with: "")
        }
        if cleaned.hasPrefix("```") {
            cleaned = cleaned.replacingOccurrences(of: "```", with: "")
        }
        if cleaned.hasSuffix("```") {
            cleaned = String(cleaned.dropLast(3))
        }

        // Try to find JSON object boundaries
        if let startIndex = cleaned.firstIndex(of: "{"),
           let endIndex = cleaned.lastIndex(of: "}") {
            cleaned = String(cleaned[startIndex...endIndex])
        }

        return cleaned.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}

// MARK: - Mock Service for Testing
#if DEBUG
actor MockAIService {
    func generateQuiz(from text: String, subject: String? = nil) async throws -> Quiz {
        // Simulate API delay
        try await Task.sleep(nanoseconds: 2_000_000_000) // 2 seconds

        // Return sample quiz
        return Quiz(
            homeworkId: UUID(),
            questions: Question.sampleList
        )
    }
}
#endif
