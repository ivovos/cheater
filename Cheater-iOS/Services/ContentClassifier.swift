//
//  ContentClassifier.swift
//  Cheater-iOS
//
//  Local content classifier for homework topic detection
//

import Foundation
import Vision
import UIKit

// MARK: - Classification Result

struct ClassificationResult {
    let topic: String
    let confidence: Double
    let subtopic: String?

    static let fallback = ClassificationResult(topic: "generic", confidence: 0.5, subtopic: nil)
}

// MARK: - Content Classifier

/// Performs lightweight local classification of homework content
/// to determine the topic before sending to Claude Vision API
actor ContentClassifier {

    // MARK: - Classification Patterns

    private let mathsPatterns = [
        // Mathematical operators and symbols
        "\\+", "−", "×", "÷", "=", "≠", "≈", "≤", "≥",
        // Common maths terms
        "equation", "solve", "calculate", "formula", "theorem",
        "algebra", "geometry", "calculus", "trigonometry",
        "integer", "fraction", "decimal", "percentage",
        "variable", "coefficient", "exponent", "logarithm",
        "derivative", "integral", "function", "graph",
        "angle", "triangle", "circle", "radius", "diameter",
        "area", "volume", "perimeter", "hypotenuse",
        "sine", "cosine", "tangent", "matrix", "vector"
    ]

    private let englishPatterns = [
        // Grammar terms
        "noun", "verb", "adjective", "adverb", "pronoun",
        "preposition", "conjunction", "interjection",
        "subject", "predicate", "clause", "phrase",
        "tense", "passive", "active", "gerund",
        "metaphor", "simile", "alliteration", "personification",
        // Literature terms
        "character", "plot", "theme", "setting", "conflict",
        "protagonist", "antagonist", "narrator", "dialogue",
        "stanza", "verse", "rhyme", "imagery", "symbolism",
        // Punctuation focus
        "comma", "semicolon", "apostrophe", "quotation",
        // Common phrases
        "write a paragraph", "essay", "comprehension",
        "vocabulary", "spelling", "grammar"
    ]

    private let sciencePatterns = [
        // Biology
        "cell", "mitochondria", "photosynthesis", "DNA", "RNA",
        "organism", "species", "evolution", "ecosystem",
        "protein", "enzyme", "respiration", "chromosome",
        // Chemistry
        "atom", "molecule", "element", "compound", "ion",
        "reaction", "chemical", "periodic table", "electron",
        "oxidation", "reduction", "acid", "base", "pH",
        "solution", "solvent", "catalyst", "bonding",
        // Physics
        "force", "energy", "velocity", "acceleration", "momentum",
        "gravity", "friction", "mass", "weight", "newton",
        "electricity", "magnetism", "circuit", "voltage",
        "wavelength", "frequency", "light", "sound",
        // General science
        "experiment", "hypothesis", "variable", "observation",
        "measurement", "data", "conclusion", "theory"
    ]

    private let historyPatterns = [
        // Time periods
        "century", "BCE", "CE", "AD", "BC", "era", "period",
        "ancient", "medieval", "renaissance", "industrial",
        "modern", "contemporary", "dynasty", "empire",
        // Historical concepts
        "war", "battle", "revolution", "treaty", "colony",
        "independence", "constitution", "government", "democracy",
        "monarchy", "republic", "feudalism", "capitalism",
        "communism", "invasion", "conquest", "rebellion",
        // Historical figures
        "king", "queen", "emperor", "president", "general",
        "leader", "dictator", "prime minister",
        // Events
        "world war", "civil war", "great depression",
        // Time references
        "reign", "ruled", "established", "founded", "declared"
    ]

    // MARK: - Public Methods

    /// Classify homework content from image using local OCR
    /// - Parameter image: The homework image
    /// - Returns: Classification result with topic and confidence
    func classifyImage(_ image: UIImage) async throws -> ClassificationResult {
        // Perform OCR to extract text
        let text = try await performOCR(on: image)

        // Classify based on text content
        return classifyText(text)
    }

    /// Classify homework content from text
    /// - Parameter text: Extracted text from homework
    /// - Returns: Classification result with topic and confidence
    func classifyText(_ text: String) -> ClassificationResult {
        let lowercased = text.lowercased()

        // Count matches for each topic
        let mathsScore = countMatches(in: lowercased, patterns: mathsPatterns)
        let englishScore = countMatches(in: lowercased, patterns: englishPatterns)
        let scienceScore = countMatches(in: lowercased, patterns: sciencePatterns)
        let historyScore = countMatches(in: lowercased, patterns: historyPatterns)

        // Additional heuristics
        let hasNumbers = text.range(of: "\\d+", options: .regularExpression) != nil
        let hasEquations = text.range(of: "[0-9]+\\s*[+\\-×÷=]\\s*[0-9]+", options: .regularExpression) != nil

        // Boost maths score if has equations
        let adjustedMathsScore = hasEquations ? mathsScore * 2.0 : (hasNumbers ? mathsScore * 1.5 : mathsScore)

        // Find highest score
        let scores: [(topic: String, score: Double)] = [
            ("maths", adjustedMathsScore),
            ("english", englishScore),
            ("science", scienceScore),
            ("history", historyScore)
        ]

        let sorted = scores.sorted { $0.score > $1.score }

        guard let best = sorted.first, best.score > 0 else {
            // No clear match, return generic
            return ClassificationResult(topic: "generic", confidence: 0.5, subtopic: nil)
        }

        // Calculate confidence based on relative score difference
        let totalScore = scores.reduce(0.0) { $0 + $1.score }
        let confidence = totalScore > 0 ? min(best.score / totalScore, 0.95) : 0.5

        // Only return topic if confidence is reasonable
        if confidence >= 0.4 {
            let subtopic = detectSubtopic(for: best.topic, in: lowercased)
            return ClassificationResult(topic: best.topic, confidence: confidence, subtopic: subtopic)
        } else {
            return ClassificationResult(topic: "generic", confidence: 0.5, subtopic: nil)
        }
    }

    // MARK: - Private Methods

    private func performOCR(on image: UIImage) async throws -> String {
        guard let cgImage = image.cgImage else {
            throw ClassificationError.invalidImage
        }

        return try await withCheckedThrowingContinuation { continuation in
            let request = VNRecognizeTextRequest { request, error in
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }

                guard let observations = request.results as? [VNRecognizedTextObservation] else {
                    continuation.resume(returning: "")
                    return
                }

                let text = observations.compactMap { observation in
                    observation.topCandidates(1).first?.string
                }.joined(separator: "\n")

                continuation.resume(returning: text)
            }

            // Configure for fast, accurate text recognition
            request.recognitionLevel = .accurate
            request.usesLanguageCorrection = true

            let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

            do {
                try handler.perform([request])
            } catch {
                continuation.resume(throwing: error)
            }
        }
    }

    private func countMatches(in text: String, patterns: [String]) -> Double {
        var score = 0.0

        for pattern in patterns {
            // Use word boundary matching for whole words
            let regexPattern = "\\b\(pattern)\\b"
            if let regex = try? NSRegularExpression(pattern: regexPattern, options: .caseInsensitive) {
                let range = NSRange(text.startIndex..., in: text)
                let matches = regex.numberOfMatches(in: text, options: [], range: range)
                score += Double(matches)
            }
        }

        return score
    }

    private func detectSubtopic(for topic: String, in text: String) -> String? {
        switch topic {
        case "maths":
            if text.contains("algebra") { return "algebra" }
            if text.contains("geometry") { return "geometry" }
            if text.contains("calculus") { return "calculus" }
            if text.contains("trigonometry") { return "trigonometry" }
            if text.contains("statistics") { return "statistics" }
            return nil

        case "english":
            if text.contains("grammar") { return "grammar" }
            if text.contains("literature") { return "literature" }
            if text.contains("vocabulary") { return "vocabulary" }
            if text.contains("comprehension") { return "comprehension" }
            if text.contains("essay") || text.contains("writing") { return "writing" }
            return nil

        case "science":
            if text.contains("biology") || text.contains("cell") || text.contains("organism") { return "biology" }
            if text.contains("chemistry") || text.contains("element") || text.contains("reaction") { return "chemistry" }
            if text.contains("physics") || text.contains("force") || text.contains("energy") { return "physics" }
            return nil

        case "history":
            if text.contains("war") { return "war" }
            if text.contains("ancient") { return "ancient_history" }
            if text.contains("modern") { return "modern_history" }
            if text.contains("world war") { return "world_war" }
            return nil

        default:
            return nil
        }
    }
}

// MARK: - Errors

enum ClassificationError: LocalizedError {
    case invalidImage
    case ocrFailed

    var errorDescription: String? {
        switch self {
        case .invalidImage:
            return "Invalid image format"
        case .ocrFailed:
            return "Failed to extract text from image"
        }
    }
}
