//
//  Question.swift
//  Cheater-iOS
//
//  Domain model for quiz questions
//

import Foundation

struct Question: Identifiable, Codable, Hashable, Sendable {
    let id: UUID
    let question: String
    let options: [String] // Always 4 options (A, B, C, D)
    let correctIndex: Int // Index of correct answer (0-3)
    let explanation: String

    init(
        id: UUID = UUID(),
        question: String,
        options: [String],
        correctIndex: Int,
        explanation: String
    ) {
        self.id = id
        self.question = question
        self.options = options
        self.correctIndex = correctIndex
        self.explanation = explanation
    }

    // Computed properties
    var correctAnswer: String {
        guard correctIndex >= 0 && correctIndex < options.count else {
            return ""
        }
        return options[correctIndex]
    }

    var optionLabels: [String] {
        ["A", "B", "C", "D"]
    }

    // Validation
    var isValid: Bool {
        options.count == 4 &&
        correctIndex >= 0 &&
        correctIndex < 4 &&
        !question.isEmpty &&
        !explanation.isEmpty
    }
}

// MARK: - Sample Data
extension Question {
    static let sample = Question(
        question: "What is the result of 5 × 6?",
        options: ["25", "30", "35", "40"],
        correctIndex: 1,
        explanation: "5 × 6 = 30. Multiplication is repeated addition: 5 + 5 + 5 + 5 + 5 + 5 = 30."
    )

    static let sampleList: [Question] = [
        Question(
            question: "What is the result of 5 × 6?",
            options: ["25", "30", "35", "40"],
            correctIndex: 1,
            explanation: "5 × 6 = 30. Multiplication is repeated addition."
        ),
        Question(
            question: "What is the capital of France?",
            options: ["London", "Paris", "Berlin", "Madrid"],
            correctIndex: 1,
            explanation: "Paris is the capital and largest city of France."
        ),
        Question(
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2", "NaCl"],
            correctIndex: 0,
            explanation: "H2O represents water, with two hydrogen atoms and one oxygen atom."
        ),
        Question(
            question: "How many sides does a hexagon have?",
            options: ["4", "5", "6", "7"],
            correctIndex: 2,
            explanation: "A hexagon is a polygon with 6 sides and 6 angles."
        ),
        Question(
            question: "What is 12 + 8?",
            options: ["18", "19", "20", "21"],
            correctIndex: 2,
            explanation: "12 + 8 = 20. Basic addition."
        ),
        Question(
            question: "What planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctIndex: 1,
            explanation: "Mars is called the Red Planet due to its reddish appearance from iron oxide."
        ),
        Question(
            question: "What is 100 ÷ 4?",
            options: ["20", "25", "30", "35"],
            correctIndex: 1,
            explanation: "100 ÷ 4 = 25. Division is the opposite of multiplication."
        ),
        Question(
            question: "How many days are in a leap year?",
            options: ["364", "365", "366", "367"],
            correctIndex: 2,
            explanation: "A leap year has 366 days, with an extra day in February."
        ),
        Question(
            question: "What is the square root of 64?",
            options: ["6", "7", "8", "9"],
            correctIndex: 2,
            explanation: "The square root of 64 is 8, because 8 × 8 = 64."
        ),
        Question(
            question: "What is the freezing point of water in Celsius?",
            options: ["-10°C", "0°C", "10°C", "100°C"],
            correctIndex: 1,
            explanation: "Water freezes at 0°C (32°F) under standard conditions."
        )
    ]
}
