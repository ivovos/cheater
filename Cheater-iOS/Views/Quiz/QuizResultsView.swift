//
//  QuizResultsView.swift
//  Cheater-iOS
//
//  Quiz results screen with score and celebration
//

import SwiftUI

struct QuizResultsView: View {
    let attempt: QuizAttempt
    let homework: Homework
    @Environment(\.dismiss) var dismiss

    @State private var progressAnimation: CGFloat = 0
    @State private var showConfetti = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: AppSpacing.xLarge) {
                    Spacer(minLength: AppSpacing.large)

                    // Grade emoji and message
                    gradeHeader

                    // Circular progress ring
                    circularProgress

                    // Stats
                    statsSection

                    // Actions
                    actionsSection

                    Spacer(minLength: AppSpacing.large)
                }
                .padding(AppSpacing.screenPadding)
            }
            .background(backgroundColor)
            .navigationTitle("Results")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.appTextSecondary)
                    }
                }
            }
            .onAppear {
                animateProgress()
                if attempt.percentage >= 90 {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        showConfetti = true
                    }
                }
            }
        }
    }

    // MARK: - Components

    private var gradeHeader: some View {
        VStack(spacing: AppSpacing.small) {
            Text(gradeEmoji)
                .font(.system(size: 80))

            Text(attempt.gradeMessage)
                .font(AppTypography.largeTitle)
                .foregroundColor(.appTextPrimary)
        }
    }

    private var circularProgress: some View {
        ZStack {
            // Background circle
            Circle()
                .stroke(Color.gray.opacity(0.2), lineWidth: 20)
                .frame(width: 200, height: 200)

            // Progress circle
            Circle()
                .trim(from: 0, to: progressAnimation)
                .stroke(
                    progressColor,
                    style: StrokeStyle(lineWidth: 20, lineCap: .round)
                )
                .frame(width: 200, height: 200)
                .rotationEffect(.degrees(-90))
                .animation(.spring(response: 1.0, dampingFraction: 0.7), value: progressAnimation)

            // Score text
            VStack(spacing: 4) {
                Text("\(attempt.score)/\(attempt.totalQuestions)")
                    .font(.system(size: 48, weight: .bold))
                    .foregroundColor(.appTextPrimary)

                Text("\(attempt.percentage)%")
                    .font(AppTypography.title)
                    .foregroundColor(.appTextSecondary)
            }
        }
    }

    private var statsSection: some View {
        VStack(spacing: AppSpacing.medium) {
            StatRow(
                icon: "checkmark.circle.fill",
                iconColor: .appSuccess,
                label: "Correct",
                value: "\(attempt.score)"
            )

            StatRow(
                icon: "xmark.circle.fill",
                iconColor: .appError,
                label: "Wrong",
                value: "\(attempt.totalQuestions - attempt.score)"
            )

            if let timeTaken = attempt.timeTakenSeconds {
                StatRow(
                    icon: "clock.fill",
                    iconColor: .appPrimary,
                    label: "Time",
                    value: formatTime(timeTaken)
                )
            }
        }
        .padding(AppSpacing.medium)
        .background(Color.appCardBackground)
        .cornerRadius(AppRadius.card)
        .shadow(
            color: AppShadow.card.color,
            radius: AppShadow.card.radius,
            x: AppShadow.card.x,
            y: AppShadow.card.y
        )
    }

    private var actionsSection: some View {
        VStack(spacing: AppSpacing.medium) {
            // Play Again button
            Button {
                dismiss()
                // Future: Start new quiz
            } label: {
                HStack {
                    Image(systemName: "arrow.clockwise")
                    Text("Play Again")
                }
                .font(AppTypography.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.appPrimary)
                .cornerRadius(AppRadius.button)
            }

            // Back to Homework button
            Button {
                dismiss()
            } label: {
                HStack {
                    Image(systemName: "house")
                    Text("Back to Homework")
                }
                .font(AppTypography.headline)
                .foregroundColor(.appPrimary)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.appCardBackground)
                .cornerRadius(AppRadius.button)
                .overlay(
                    RoundedRectangle(cornerRadius: AppRadius.button)
                        .stroke(Color.appPrimary, lineWidth: 2)
                )
            }
        }
    }

    // MARK: - Helpers

    private var backgroundColor: Color {
        if attempt.percentage >= 90 {
            return Color.appSuccess.opacity(0.05)
        } else if attempt.percentage >= 70 {
            return Color.appPrimary.opacity(0.05)
        } else {
            return Color.appBackground
        }
    }

    private var progressColor: Color {
        if attempt.percentage >= 90 {
            return Color.appSuccess
        } else if attempt.percentage >= 70 {
            return Color.appPrimary
        } else if attempt.percentage >= 50 {
            return Color.appWarning
        } else {
            return Color.appError
        }
    }

    private var gradeEmoji: String {
        switch attempt.percentage {
        case 90...100:
            return "🎉"
        case 70..<90:
            return "👍"
        case 50..<70:
            return "👌"
        default:
            return "💪"
        }
    }

    private func animateProgress() {
        withAnimation(.easeOut(duration: 1.0)) {
            progressAnimation = CGFloat(attempt.percentage) / 100.0
        }
    }

    private func formatTime(_ seconds: Int) -> String {
        let minutes = seconds / 60
        let remainingSeconds = seconds % 60
        return String(format: "%d:%02d", minutes, remainingSeconds)
    }
}

// MARK: - Stat Row Component
struct StatRow: View {
    let icon: String
    let iconColor: Color
    let label: String
    let value: String

    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(iconColor)
                .frame(width: 40)

            Text(label)
                .font(AppTypography.body)
                .foregroundColor(.appTextSecondary)

            Spacer()

            Text(value)
                .font(AppTypography.headline)
                .foregroundColor(.appTextPrimary)
        }
    }
}

#Preview {
    QuizResultsView(attempt: QuizAttempt.sample, homework: Homework.sample)
}
