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
    @Published var selectedAnswer: Int?
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

    func selectAnswer(_ index: Int) {
        guard !showFeedback else { return }

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

    func nextQuestion() {
        if isLastQuestion {
            completeQuiz()
        } else {
            // Move to next question
            withAnimation {
                currentQuestionIndex += 1
                selectedAnswer = nil
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
            correctIndex: currentQuestion.correctIndex
        )
        answers.append(answer)

        // Move to next
        if isLastQuestion {
            completeQuiz()
        } else {
            withAnimation {
                currentQuestionIndex += 1
                selectedAnswer = nil
                showFeedback = false
            }
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
