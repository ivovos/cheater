//
//  QuizView.swift
//  Cheater-iOS
//
//  Main quiz gameplay screen
//

import SwiftUI

struct QuizView: View {
    @StateObject var viewModel: QuizViewModel
    @Environment(\.dismiss) var dismiss

    init(quiz: Quiz, homework: Homework) {
        _viewModel = StateObject(wrappedValue: QuizViewModel(quiz: quiz, homework: homework))
    }

    var body: some View {
        VStack(spacing: 0) {
            // Progress bar
            progressBar

            ScrollView {
                VStack(spacing: AppSpacing.large) {
                    // Question counter
                    questionCounter

                    // Question text
                    questionText

                    // Answer options
                    answerOptions

                    // Feedback
                    if viewModel.showFeedback {
                        feedbackSection
                    }

                    Spacer(minLength: AppSpacing.xxLarge)
                }
                .padding(AppSpacing.screenPadding)
            }

            // Bottom buttons
            bottomButtons
        }
        .navigationTitle("Quiz")
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button {
                    // Show confirmation dialog
                    dismiss()
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "chevron.left")
                        Text("Exit")
                    }
                }
            }
        }
        .fullScreenCover(isPresented: $viewModel.quizCompleted) {
            QuizResultsView(attempt: viewModel.getQuizAttempt(), homework: viewModel.homework)
        }
    }

    // MARK: - Components

    private var progressBar: some View {
        VStack(spacing: 0) {
            ProgressView(value: viewModel.progress, total: 1.0)
                .tint(.appPrimary)
                .animation(.easeInOut, value: viewModel.progress)

            Divider()
        }
    }

    private var questionCounter: some View {
        HStack {
            Text("Question \(viewModel.currentQuestionIndex + 1) of \(viewModel.quiz.totalQuestions)")
                .font(AppTypography.subheadline)
                .foregroundColor(.appTextSecondary)
            Spacer()
        }
    }

    private var questionText: some View {
        Text(viewModel.currentQuestion.question)
            .font(AppTypography.title)
            .foregroundColor(.appTextPrimary)
            .multilineTextAlignment(.leading)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.vertical, AppSpacing.small)
    }

    private var answerOptions: some View {
        VStack(spacing: AppSpacing.medium) {
            ForEach(Array(viewModel.currentQuestion.options.enumerated()), id: \.offset) { index, option in
                AnswerButton(
                    text: option,
                    label: viewModel.currentQuestion.optionLabels[index],
                    isSelected: viewModel.selectedAnswer == index,
                    isCorrect: viewModel.showFeedback && index == viewModel.currentQuestion.correctIndex,
                    isWrong: viewModel.showFeedback && viewModel.selectedAnswer == index && index != viewModel.currentQuestion.correctIndex,
                    showFeedback: viewModel.showFeedback,
                    action: {
                        viewModel.selectAnswer(index)
                    }
                )
            }
        }
    }

    private var feedbackSection: some View {
        VStack(spacing: AppSpacing.medium) {
            FeedbackView(
                isCorrect: viewModel.selectedAnswer == viewModel.currentQuestion.correctIndex,
                explanation: viewModel.currentQuestion.explanation
            )
            .transition(.opacity.combined(with: .move(edge: .top)))
        }
    }

    private var bottomButtons: some View {
        VStack(spacing: 0) {
            Divider()

            if viewModel.showFeedback {
                // Next button
                Button {
                    viewModel.nextQuestion()
                } label: {
                    Text(viewModel.isLastQuestion ? "Finish Quiz" : "Next Question")
                        .font(AppTypography.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.appPrimary)
                        .cornerRadius(AppRadius.button)
                }
                .padding()
            } else {
                // Skip button
                Button {
                    viewModel.skipQuestion()
                } label: {
                    Text("Skip Question")
                        .font(AppTypography.body)
                        .foregroundColor(.appTextSecondary)
                }
                .padding()
            }
        }
        .background(Color.appBackground)
    }
}

#Preview {
    NavigationStack {
        QuizView(quiz: Quiz.sample, homework: Homework.sample)
    }
}
