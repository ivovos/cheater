//
//  Question.swift
//  Cheater-iOS
//
//  Domain model for quiz questions
//

import Foundation

// MARK: - Question Types

enum QuestionType: String, Codable, Sendable {
    case mcq = "mcq"                    // Multiple choice
    case fillBlank = "fillBlank"         // Fill in the blank
    case shortAnswer = "shortAnswer"     // Short answer
}

// MARK: - Question Model

struct Question: Identifiable, Codable, Hashable, Sendable {
    let id: UUID
    let type: QuestionType
    let question: String
    let options: [String]?              // Only for MCQ (4 options: A, B, C, D)
    let correctIndex: Int?              // Only for MCQ (0-3)
    let correctAnswer: String?          // For fillBlank and shortAnswer
    let explanation: String

    init(
        id: UUID = UUID(),
        type: QuestionType = .mcq,
        question: String,
        options: [String]? = nil,
        correctIndex: Int? = nil,
        correctAnswer: String? = nil,
        explanation: String
    ) {
        self.id = id
        self.type = type
        self.question = question
        self.options = options
        self.correctIndex = correctIndex
        self.correctAnswer = correctAnswer
        self.explanation = explanation
    }

    // Computed properties
    var answer: String {
        switch type {
        case .mcq:
            guard let options = options,
                  let correctIndex = correctIndex,
                  correctIndex >= 0 && correctIndex < options.count else {
                return ""
            }
            return options[correctIndex]
        case .fillBlank, .shortAnswer:
            return correctAnswer ?? ""
        }
    }

    var optionLabels: [String] {
        ["A", "B", "C", "D"]
    }

    // Validation
    var isValid: Bool {
        switch type {
        case .mcq:
            return options?.count == 4 &&
                   correctIndex != nil &&
                   correctIndex! >= 0 &&
                   correctIndex! < 4 &&
                   !question.isEmpty &&
                   !explanation.isEmpty
        case .fillBlank, .shortAnswer:
            return correctAnswer != nil &&
                   !correctAnswer!.isEmpty &&
                   !question.isEmpty &&
                   !explanation.isEmpty
        }
    }
}

// MARK: - Sample Data
extension Question {
    static let sample = Question(
        type: .mcq,
        question: "What is the result of 5 × 6?",
        options: ["25", "30", "35", "40"],
        correctIndex: 1,
        explanation: "5 × 6 = 30. Multiplication is repeated addition: 5 + 5 + 5 + 5 + 5 + 5 = 30."
    )

    static let sampleList: [Question] = [
        // MCQ questions
        Question(
            type: .mcq,
            question: "What is the result of 5 × 6?",
            options: ["25", "30", "35", "40"],
            correctIndex: 1,
            explanation: "5 × 6 = 30. Multiplication is repeated addition."
        ),
        Question(
            type: .mcq,
            question: "What is the capital of France?",
            options: ["London", "Paris", "Berlin", "Madrid"],
            correctIndex: 1,
            explanation: "Paris is the capital and largest city of France."
        ),
        // Fill-in-blank questions
        Question(
            type: .fillBlank,
            question: "The chemical symbol for water is ___.",
            correctAnswer: "H2O",
            explanation: "H2O represents water, with two hydrogen atoms and one oxygen atom."
        ),
        Question(
            type: .fillBlank,
            question: "A polygon with 6 sides is called a ___.",
            correctAnswer: "hexagon",
            explanation: "A hexagon is a polygon with 6 sides and 6 angles."
        ),
        // MCQ questions
        Question(
            type: .mcq,
            question: "What is 12 + 8?",
            options: ["18", "19", "20", "21"],
            correctIndex: 2,
            explanation: "12 + 8 = 20. Basic addition."
        ),
        Question(
            type: .mcq,
            question: "What planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctIndex: 1,
            explanation: "Mars is called the Red Planet due to its reddish appearance from iron oxide."
        ),
        // Fill-in-blank
        Question(
            type: .fillBlank,
            question: "100 ÷ 4 = ___",
            correctAnswer: "25",
            explanation: "100 ÷ 4 = 25. Division is the opposite of multiplication."
        ),
        // Short answer
        Question(
            type: .shortAnswer,
            question: "Explain why a leap year has an extra day.",
            correctAnswer: "A leap year has 366 days with an extra day added to February to account for the Earth's orbit taking approximately 365.25 days around the Sun.",
            explanation: "The extra day compensates for the quarter-day difference, keeping our calendar aligned with Earth's orbit."
        ),
        // MCQ questions
        Question(
            type: .mcq,
            question: "What is the square root of 64?",
            options: ["6", "7", "8", "9"],
            correctIndex: 2,
            explanation: "The square root of 64 is 8, because 8 × 8 = 64."
        ),
        Question(
            type: .mcq,
            question: "What is the freezing point of water in Celsius?",
            options: ["-10°C", "0°C", "10°C", "100°C"],
            correctIndex: 1,
            explanation: "Water freezes at 0°C (32°F) under standard conditions."
        )
    ]
}
