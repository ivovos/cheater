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

                    // Answer input (varies by question type)
                    answerInput

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

    @ViewBuilder
    private var answerInput: some View {
        switch viewModel.currentQuestion.type {
        case .mcq:
            mcqOptions
        case .fillBlank:
            fillBlankInput
        case .shortAnswer:
            shortAnswerInput
        }
    }

    private var mcqOptions: some View {
        VStack(spacing: AppSpacing.medium) {
            ForEach(Array((viewModel.currentQuestion.options ?? []).enumerated()), id: \.offset) { index, option in
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

    private var fillBlankInput: some View {
        VStack(alignment: .leading, spacing: AppSpacing.medium) {
            TextField("Your answer", text: $viewModel.textAnswer)
                .textFieldStyle(.roundedBorder)
                .font(AppTypography.body)
                .disabled(viewModel.showFeedback)
                .autocorrectionDisabled()
                .textInputAutocapitalization(.never)
                .padding(.vertical, AppSpacing.small)

            if !viewModel.showFeedback {
                Button {
                    viewModel.submitTextAnswer()
                } label: {
                    Text("Submit Answer")
                        .font(AppTypography.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(viewModel.canSubmitAnswer ? Color.appPrimary : Color.gray)
                        .cornerRadius(AppRadius.button)
                }
                .disabled(!viewModel.canSubmitAnswer)
            } else {
                // Show user's answer and correct answer
                VStack(alignment: .leading, spacing: AppSpacing.small) {
                    HStack {
                        Text("Your answer:")
                            .font(AppTypography.caption)
                            .foregroundColor(.appTextSecondary)
                        Text(viewModel.textAnswer)
                            .font(AppTypography.body)
                            .foregroundColor(viewModel.textAnswer.lowercased() == (viewModel.currentQuestion.correctAnswer?.lowercased() ?? "") ? .appSuccess : .appError)
                    }
                    HStack {
                        Text("Correct answer:")
                            .font(AppTypography.caption)
                            .foregroundColor(.appTextSecondary)
                        Text(viewModel.currentQuestion.correctAnswer ?? "")
                            .font(AppTypography.body)
                            .foregroundColor(.appSuccess)
                    }
                }
                .padding()
                .background(Color.appCardBackground)
                .cornerRadius(AppRadius.medium)
            }
        }
    }

    private var shortAnswerInput: some View {
        VStack(alignment: .leading, spacing: AppSpacing.medium) {
            Text("Provide a detailed answer:")
                .font(AppTypography.caption)
                .foregroundColor(.appTextSecondary)

            TextEditor(text: $viewModel.textAnswer)
                .frame(minHeight: 120)
                .padding(8)
                .background(Color.appCardBackground)
                .cornerRadius(AppRadius.small)
                .overlay(
                    RoundedRectangle(cornerRadius: AppRadius.small)
                        .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                )
                .disabled(viewModel.showFeedback)
                .font(AppTypography.body)

            if !viewModel.showFeedback {
                Button {
                    viewModel.submitTextAnswer()
                } label: {
                    Text("Submit Answer")
                        .font(AppTypography.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(viewModel.canSubmitAnswer ? Color.appPrimary : Color.gray)
                        .cornerRadius(AppRadius.button)
                }
                .disabled(!viewModel.canSubmitAnswer)
            } else {
                // Show user's answer and model answer
                VStack(alignment: .leading, spacing: AppSpacing.small) {
                    Text("Your answer:")
                        .font(AppTypography.caption)
                        .foregroundColor(.appTextSecondary)
                    Text(viewModel.textAnswer)
                        .font(AppTypography.body)
                        .foregroundColor(.appTextPrimary)
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.appCardBackground)
                        .cornerRadius(AppRadius.small)

                    Text("Model answer:")
                        .font(AppTypography.caption)
                        .foregroundColor(.appTextSecondary)
                        .padding(.top, AppSpacing.small)
                    Text(viewModel.currentQuestion.correctAnswer ?? "")
                        .font(AppTypography.body)
                        .foregroundColor(.appSuccess)
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.appSuccess.opacity(0.1))
                        .cornerRadius(AppRadius.small)
                }
            }
        }
    }

    private var feedbackSection: some View {
        VStack(spacing: AppSpacing.medium) {
            let isCorrect: Bool = {
                switch viewModel.currentQuestion.type {
                case .mcq:
                    return viewModel.selectedAnswer == viewModel.currentQuestion.correctIndex
                case .fillBlank:
                    return viewModel.textAnswer.lowercased().trimmingCharacters(in: .whitespacesAndNewlines) == (viewModel.currentQuestion.correctAnswer?.lowercased() ?? "")
                case .shortAnswer:
                    // For short answer, be lenient
                    let userAnswer = viewModel.textAnswer.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
                    let correctAnswer = (viewModel.currentQuestion.correctAnswer?.lowercased() ?? "")
                    return !userAnswer.isEmpty && (userAnswer == correctAnswer || userAnswer.contains(correctAnswer))
                }
            }()

            FeedbackView(
                isCorrect: isCorrect,
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
