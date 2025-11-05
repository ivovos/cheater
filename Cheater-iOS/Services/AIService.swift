//
//  AIService.swift
//  Cheater-iOS
//
//  AI service for quiz generation using Claude API
//

import Foundation
import UIKit

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
        // Try to get API key from parameter or Config.plist
        if let key = apiKey {
            self.apiKey = key
        } else if let configPath = Bundle.main.path(forResource: "Config", ofType: "plist"),
                  let config = NSDictionary(contentsOfFile: configPath),
                  let key = config["ANTHROPIC_API_KEY"] as? String,
                  !key.isEmpty,
                  key != "your-api-key-here" {
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

    /// Generate quiz from homework image using Claude Vision with smart classification
    /// - Parameters:
    ///   - image: UIImage of homework
    ///   - subject: Optional subject hint
    /// - Returns: Generated Quiz
    /// - Throws: AIError if generation fails
    func generateQuiz(from image: UIImage, subject: String? = nil) async throws -> Quiz {
        print("🖼️ Using Claude Vision with smart classification to generate quiz")

        // Step 1: Perform local classification for topic hint
        let classifier = ContentClassifier()
        var detectedTopic = "generic"
        var classificationConfidence = 0.5

        do {
            let classification = try await classifier.classifyImage(image)
            detectedTopic = classification.topic
            classificationConfidence = classification.confidence

            print("🔍 Local classification: \(detectedTopic) (confidence: \(String(format: "%.2f", classificationConfidence)))")

            // Only use detected topic if confidence is above threshold
            if classificationConfidence < PromptManager.shared.classificationThreshold {
                print("⚠️ Classification confidence below threshold, using generic prompt")
                detectedTopic = "generic"
            }
        } catch {
            print("⚠️ Classification failed, using generic prompt: \(error.localizedDescription)")
            detectedTopic = "generic"
        }

        // Step 2: Convert image to base64
        let base64Image = try convertImageToBase64(image)

        // Step 3: Build topic-specific vision prompt
        let promptText = buildVisionPrompt(subject: subject, topic: detectedTopic)

        // Step 4: Create request
        var request = URLRequest(url: apiURL)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
        request.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")

        // Build multimodal request body
        let requestBody: [String: Any] = [
            "model": model,
            "max_tokens": maxTokens,
            "messages": [
                [
                    "role": "user",
                    "content": [
                        [
                            "type": "image",
                            "source": [
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": base64Image
                            ]
                        ],
                        [
                            "type": "text",
                            "text": promptText
                        ]
                    ]
                ]
            ]
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)

        // Step 5: Make request
        print("📡 Sending image to Claude Vision API with \(detectedTopic) prompt...")
        let (data, response) = try await URLSession.shared.data(for: request)

        // Validate response
        guard let httpResponse = response as? HTTPURLResponse else {
            throw AIError.invalidResponse
        }

        switch httpResponse.statusCode {
        case 200:
            print("✅ Claude Vision API returned successfully")
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

        // Step 6: Parse response (now includes topic validation from Claude)
        let quiz = try parseQuizResponse(data: data)
        print("✅ Successfully generated \(quiz.questions.count) questions for topic: \(detectedTopic)")

        return quiz
    }

    // MARK: - Private Methods

    private func buildPrompt(text: String, subject: String?) -> String {
        return PromptManager.shared.buildTextPrompt(text: text, subject: subject)
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

    private func buildVisionPrompt(subject: String?, topic: String = "generic") -> String {
        return PromptManager.shared.buildVisionPrompt(subject: subject, topic: topic)
    }

    private func convertImageToBase64(_ image: UIImage) throws -> String {
        // Resize image if too large to reduce API costs
        let maxDimension: CGFloat = 1568  // Claude recommended max
        let resizedImage = resizeImage(image, maxDimension: maxDimension)

        // Convert to JPEG with 80% quality for good balance of quality/size
        guard let imageData = resizedImage.jpegData(compressionQuality: 0.8) else {
            throw AIError.invalidRequest
        }

        print("📸 Image size: \(imageData.count / 1024)KB")

        return imageData.base64EncodedString()
    }

    private func resizeImage(_ image: UIImage, maxDimension: CGFloat) -> UIImage {
        let size = image.size

        // Check if resize needed
        guard size.width > maxDimension || size.height > maxDimension else {
            return image
        }

        // Calculate new size maintaining aspect ratio
        let ratio = size.width / size.height
        let newSize: CGSize

        if size.width > size.height {
            newSize = CGSize(width: maxDimension, height: maxDimension / ratio)
        } else {
            newSize = CGSize(width: maxDimension * ratio, height: maxDimension)
        }

        // Resize
        UIGraphicsBeginImageContextWithOptions(newSize, false, 1.0)
        defer { UIGraphicsEndImageContext() }

        image.draw(in: CGRect(origin: .zero, size: newSize))

        return UIGraphicsGetImageFromCurrentImageContext() ?? image
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

    func generateQuiz(from image: UIImage, subject: String? = nil) async throws -> Quiz {
        // Simulate API delay for vision processing
        try await Task.sleep(nanoseconds: 2_000_000_000) // 2 seconds

        print("🧪 Mock: Generating quiz from image")

        // Return sample quiz
        return Quiz(
            homeworkId: UUID(),
            questions: Question.sampleList
        )
    }
}
#endif
