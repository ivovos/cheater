//
//  Quiz.swift
//  Cheater-iOS
//
//  Domain model for quizzes
//

import Foundation

struct Quiz: Identifiable, Codable, Sendable {
    let id: UUID
    let homeworkId: UUID
    let questions: [Question]
    let createdAt: Date

    // Classification metadata
    let topic: String?
    let subtopic: String?
    let classificationConfidence: Double?

    init(
        id: UUID = UUID(),
        homeworkId: UUID,
        questions: [Question],
        createdAt: Date = Date(),
        topic: String? = nil,
        subtopic: String? = nil,
        classificationConfidence: Double? = nil
    ) {
        self.id = id
        self.homeworkId = homeworkId
        self.questions = questions
        self.createdAt = createdAt
        self.topic = topic
        self.subtopic = subtopic
        self.classificationConfidence = classificationConfidence
    }

    // Computed properties
    var totalQuestions: Int {
        questions.count
    }

    var isValid: Bool {
        totalQuestions == 10 && questions.allSatisfy { $0.isValid }
    }

    var topicDisplay: String {
        topic?.capitalized ?? "General"
    }
}

// MARK: - Core Data Conversion
extension Quiz {
    /// Convert Core Data entity to domain model
    init?(from entity: QuizEntity) {
        guard
            let id = entity.id,
            let questionsData = entity.questionsJSON,
            let createdAt = entity.createdAt,
            let homeworkId = entity.homework?.id
        else {
            return nil
        }

        self.id = id
        self.homeworkId = homeworkId
        self.createdAt = createdAt

        // Decode questions from JSON
        do {
            let decoder = JSONDecoder()
            self.questions = try decoder.decode([Question].self, from: questionsData)
        } catch {
            print("Failed to decode questions: \(error)")
            return nil
        }
    }

    /// Update Core Data entity from domain model
    func update(entity: QuizEntity) throws {
        entity.id = self.id
        entity.createdAt = self.createdAt

        // Encode questions to JSON
        let encoder = JSONEncoder()
        entity.questionsJSON = try encoder.encode(questions)
    }

    /// Get questions JSON data for saving
    func questionsData() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(questions)
    }
}

// MARK: - Claude API Response
extension Quiz {
    /// Structure for Claude API response (v2 with classification and multiple question types)
    struct ClaudeResponse: Codable, Sendable {
        let topic: String?
        let subtopic: String?
        let confidence: Double?
        let questions: [ClaudeQuestion]

        struct ClaudeQuestion: Codable, Sendable {
            let type: String?                // "mcq", "fillBlank", "shortAnswer"
            let question: String
            let options: [String]?           // Only for MCQ
            let correctIndex: Int?           // Only for MCQ
            let correctAnswer: String?       // For fillBlank and shortAnswer
            let explanation: String
        }
    }

    /// Create Quiz from Claude API response
    nonisolated init(from response: ClaudeResponse, homeworkId: UUID) {
        self.id = UUID()
        self.homeworkId = homeworkId
        self.createdAt = Date()
        self.topic = response.topic
        self.subtopic = response.subtopic
        self.classificationConfidence = response.confidence

        self.questions = response.questions.map { claudeQ in
            // Determine question type
            let questionType: QuestionType
            if let typeString = claudeQ.type {
                questionType = QuestionType(rawValue: typeString) ?? .mcq
            } else {
                // Fallback: if has options, it's MCQ
                questionType = claudeQ.options != nil ? .mcq : .fillBlank
            }

            return Question(
                type: questionType,
                question: claudeQ.question,
                options: claudeQ.options,
                correctIndex: claudeQ.correctIndex,
                correctAnswer: claudeQ.correctAnswer,
                explanation: claudeQ.explanation
            )
        }
    }
}

// MARK: - Quiz Attempt
struct QuizAttempt: Identifiable, Codable {
    let id: UUID
    let quizId: UUID
    let homeworkId: UUID
    let score: Int
    let totalQuestions: Int
    let timeTakenSeconds: Int?
    let answers: [QuestionAnswer]
    let completedAt: Date

    init(
        id: UUID = UUID(),
        quizId: UUID,
        homeworkId: UUID,
        score: Int,
        totalQuestions: Int,
        timeTakenSeconds: Int? = nil,
        answers: [QuestionAnswer],
        completedAt: Date = Date()
    ) {
        self.id = id
        self.quizId = quizId
        self.homeworkId = homeworkId
        self.score = score
        self.totalQuestions = totalQuestions
        self.timeTakenSeconds = timeTakenSeconds
        self.answers = answers
        self.completedAt = completedAt
    }

    // Computed properties
    var percentage: Int {
        guard totalQuestions > 0 else { return 0 }
        return Int((Double(score) / Double(totalQuestions)) * 100)
    }

    var passed: Bool {
        percentage >= 70
    }

    var gradeMessage: String {
        switch percentage {
        case 90...100:
            return "🎉 Excellent!"
        case 70..<90:
            return "👍 Great Job!"
        case 50..<70:
            return "👌 Good Effort!"
        default:
            return "💪 Keep Practicing!"
        }
    }
}

// MARK: - Question Answer
struct QuestionAnswer: Codable, Hashable {
    let questionId: UUID
    let questionIndex: Int
    let selectedIndex: Int?
    let correctIndex: Int
    let isCorrect: Bool
    let timeSpentSeconds: Int?

    init(
        questionId: UUID,
        questionIndex: Int,
        selectedIndex: Int?,
        correctIndex: Int,
        timeSpentSeconds: Int? = nil
    ) {
        self.questionId = questionId
        self.questionIndex = questionIndex
        self.selectedIndex = selectedIndex
        self.correctIndex = correctIndex
        self.isCorrect = selectedIndex == correctIndex
        self.timeSpentSeconds = timeSpentSeconds
    }
}

// MARK: - Sample Data
extension Quiz {
    static let sample = Quiz(
        homeworkId: UUID(),
        questions: Question.sampleList
    )
}

extension QuizAttempt {
    static let sample = QuizAttempt(
        quizId: UUID(),
        homeworkId: UUID(),
        score: 8,
        totalQuestions: 10,
        timeTakenSeconds: 154,
        answers: [
            QuestionAnswer(questionId: UUID(), questionIndex: 0, selectedIndex: 1, correctIndex: 1),
            QuestionAnswer(questionId: UUID(), questionIndex: 1, selectedIndex: 1, correctIndex: 1),
            QuestionAnswer(questionId: UUID(), questionIndex: 2, selectedIndex: 0, correctIndex: 0),
            QuestionAnswer(questionId: UUID(), questionIndex: 3, selectedIndex: 2, correctIndex: 2),
            QuestionAnswer(questionId: UUID(), questionIndex: 4, selectedIndex: 1, correctIndex: 2),
            QuestionAnswer(questionId: UUID(), questionIndex: 5, selectedIndex: 1, correctIndex: 1),
            QuestionAnswer(questionId: UUID(), questionIndex: 6, selectedIndex: 1, correctIndex: 1),
            QuestionAnswer(questionId: UUID(), questionIndex: 7, selectedIndex: 2, correctIndex: 2),
            QuestionAnswer(questionId: UUID(), questionIndex: 8, selectedIndex: 3, correctIndex: 2),
            QuestionAnswer(questionId: UUID(), questionIndex: 9, selectedIndex: 1, correctIndex: 1)
        ]
    )
}
