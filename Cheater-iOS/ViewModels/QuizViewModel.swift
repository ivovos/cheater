//
//  QuizViewModel.swift
//  Cheater-iOS
//
//  ViewModel for quiz gameplay
//

import Foundation
import SwiftUI
import Combine

@MainActor
class QuizViewModel: ObservableObject {
    // MARK: - Published Properties

    @Published var currentQuestionIndex = 0
    @Published var selectedAnswer: Int?           // For MCQ questions
    @Published var textAnswer: String = ""        // For fill-blank and short-answer
    @Published var showFeedback = false
    @Published var answers: [QuestionAnswer] = []
    @Published var quizCompleted = false
    @Published var startTime: Date?

    // MARK: - Properties

    let quiz: Quiz
    let homework: Homework
    private let persistenceController: PersistenceController

    var currentQuestion: Question {
        quiz.questions[currentQuestionIndex]
    }

    var progress: Double {
        Double(currentQuestionIndex + 1) / Double(quiz.totalQuestions)
    }

    var isLastQuestion: Bool {
        currentQuestionIndex == quiz.questions.count - 1
    }

    var score: Int {
        answers.filter { $0.isCorrect }.count
    }

    var timeTaken: Int? {
        guard let startTime = startTime else { return nil }
        return Int(Date().timeIntervalSince(startTime))
    }

    // MARK: - Initialization

    init(quiz: Quiz, homework: Homework, persistenceController: PersistenceController = .shared) {
        self.quiz = quiz
        self.homework = homework
        self.persistenceController = persistenceController
        self.startTime = Date()
    }

    // MARK: - Public Methods

    /// Select answer for MCQ questions
    func selectAnswer(_ index: Int) {
        guard !showFeedback, currentQuestion.type == .mcq else { return }

        selectedAnswer = index
        withAnimation {
            showFeedback = true
        }

        // Record answer
        let answer = QuestionAnswer(
            questionId: currentQuestion.id,
            questionIndex: currentQuestionIndex,
            selectedIndex: index,
            correctIndex: currentQuestion.correctIndex
        )
        answers.append(answer)

        // Haptic feedback
        if answer.isCorrect {
            HapticManager.success()
        } else {
            HapticManager.error()
        }
    }

    /// Submit text answer for fill-blank or short-answer questions
    func submitTextAnswer() {
        guard !showFeedback else { return }
        guard currentQuestion.type == .fillBlank || currentQuestion.type == .shortAnswer else { return }

        withAnimation {
            showFeedback = true
        }

        // Check if answer is correct (case-insensitive, trimmed)
        let userAnswer = textAnswer.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        let correctAnswer = (currentQuestion.correctAnswer ?? "").lowercased()

        // For short answers, be more lenient - check if key words are present
        let isCorrect: Bool
        if currentQuestion.type == .shortAnswer {
            // Consider correct if answer contains key concepts (this is simplified logic)
            isCorrect = !userAnswer.isEmpty && (userAnswer == correctAnswer || userAnswer.contains(correctAnswer))
        } else {
            // For fill-blank, must be exact match
            isCorrect = userAnswer == correctAnswer
        }

        // Record answer with custom correctIndex encoding
        // For text answers, store isCorrect in a special way:
        // correctIndex = actual correctIndex, selectedIndex = isCorrect ? 0 : -1
        let answer = QuestionAnswer(
            questionId: currentQuestion.id,
            questionIndex: currentQuestionIndex,
            selectedIndex: isCorrect ? 0 : nil,
            correctIndex: currentQuestion.correctIndex ?? 0
        )
        answers.append(answer)

        // Haptic feedback
        if isCorrect {
            HapticManager.success()
        } else {
            HapticManager.error()
        }
    }

    func nextQuestion() {
        if isLastQuestion {
            completeQuiz()
        } else {
            // Move to next question
            withAnimation {
                currentQuestionIndex += 1
                selectedAnswer = nil
                textAnswer = ""
                showFeedback = false
            }
        }
    }

    func skipQuestion() {
        // Record as skipped (no answer selected)
        let answer = QuestionAnswer(
            questionId: currentQuestion.id,
            questionIndex: currentQuestionIndex,
            selectedIndex: nil,
            correctIndex: currentQuestion.correctIndex ?? 0
        )
        answers.append(answer)

        // Move to next
        if isLastQuestion {
            completeQuiz()
        } else {
            withAnimation {
                currentQuestionIndex += 1
                selectedAnswer = nil
                textAnswer = ""
                showFeedback = false
            }
        }
    }

    /// Check if current answer is valid for submission
    var canSubmitAnswer: Bool {
        switch currentQuestion.type {
        case .mcq:
            return selectedAnswer != nil
        case .fillBlank, .shortAnswer:
            return !textAnswer.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        }
    }

    private func completeQuiz() {
        quizCompleted = true

        // Save progress
        persistenceController.updateProgress(
            for: homework.id,
            score: score,
            totalQuestions: quiz.totalQuestions
        )

        // Haptic feedback
        if score >= 9 {
            HapticManager.success()
        } else {
            HapticManager.notification()
        }
    }

    func getQuizAttempt() -> QuizAttempt {
        QuizAttempt(
            quizId: quiz.id,
            homeworkId: homework.id,
            score: score,
            totalQuestions: quiz.totalQuestions,
            timeTakenSeconds: timeTaken,
            answers: answers
        )
    }
}

// MARK: - Haptic Manager
struct HapticManager {
    static func success() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
    }

    static func error() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.error)
    }

    static func notification() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.warning)
    }

    static func impact(style: UIImpactFeedbackGenerator.FeedbackStyle = .medium) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.impactOccurred()
    }
}
