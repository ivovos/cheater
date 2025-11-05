//
//  FeedbackView.swift
//  Cheater-iOS
//
//  Feedback component showing answer explanation
//

import SwiftUI

struct FeedbackView: View {
    let isCorrect: Bool
    let explanation: String

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.small) {
            HStack(spacing: AppSpacing.small) {
                Image(systemName: isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill")
                    .font(.title2)
                    .foregroundColor(isCorrect ? .appSuccess : .appError)

                Text(isCorrect ? "Correct!" : "Incorrect")
                    .font(AppTypography.headline)
                    .foregroundColor(isCorrect ? .appSuccess : .appError)
            }

            Text(explanation)
                .font(AppTypography.body)
                .foregroundColor(.appTextSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(AppSpacing.medium)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            (isCorrect ? Color.appSuccess : Color.appError)
                .opacity(0.1)
        )
        .cornerRadius(AppRadius.medium)
        .overlay(
            RoundedRectangle(cornerRadius: AppRadius.medium)
                .stroke(isCorrect ? Color.appSuccess : Color.appError, lineWidth: 1)
        )
    }
}

#Preview {
    VStack(spacing: AppSpacing.large) {
        FeedbackView(
            isCorrect: true,
            explanation: "5 × 6 = 30. Multiplication is repeated addition: 5 + 5 + 5 + 5 + 5 + 5 = 30."
        )

        FeedbackView(
            isCorrect: false,
            explanation: "The correct answer is 30. Remember that 5 × 6 means adding 5 six times."
        )
    }
    .padding()
}
