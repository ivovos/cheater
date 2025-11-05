//
//  AnswerButton.swift
//  Cheater-iOS
//
//  Button component for quiz answer options
//

import SwiftUI

struct AnswerButton: View {
    let text: String
    let label: String
    let isSelected: Bool
    let isCorrect: Bool
    let isWrong: Bool
    let showFeedback: Bool
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: {
            if !showFeedback {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                    isPressed = true
                }
                HapticManager.impact(style: .light)

                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    withAnimation {
                        isPressed = false
                    }
                    action()
                }
            }
        }) {
            HStack(spacing: AppSpacing.medium) {
                // Label circle
                Text(label)
                    .font(AppTypography.headline)
                    .foregroundColor(labelColor)
                    .frame(width: 40, height: 40)
                    .background(labelBackgroundColor)
                    .clipShape(Circle())

                // Answer text
                Text(text)
                    .font(AppTypography.body)
                    .foregroundColor(textColor)
                    .multilineTextAlignment(.leading)

                Spacer()

                // Feedback icon
                if showFeedback {
                    Image(systemName: feedbackIcon)
                        .font(.system(size: 24, weight: .semibold))
                        .foregroundColor(iconColor)
                        .transition(.scale.combined(with: .opacity))
                }
            }
            .padding(AppSpacing.medium)
            .frame(maxWidth: .infinity)
            .background(backgroundColor)
            .overlay(
                RoundedRectangle(cornerRadius: AppRadius.medium)
                    .stroke(borderColor, lineWidth: 2)
            )
            .cornerRadius(AppRadius.medium)
            .scaleEffect(isPressed ? 0.95 : 1.0)
            .shadow(color: shadowColor, radius: shadowRadius, x: 0, y: shadowY)
        }
        .buttonStyle(PlainButtonStyle())
        .disabled(showFeedback)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isSelected)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: showFeedback)
    }

    // MARK: - Colors

    private var backgroundColor: Color {
        if showFeedback {
            if isCorrect {
                return Color.appSuccess.opacity(0.15)
            } else if isWrong {
                return Color.appError.opacity(0.15)
            }
        }
        return Color.appCardBackground
    }

    private var borderColor: Color {
        if showFeedback {
            if isCorrect {
                return Color.appSuccess
            } else if isWrong {
                return Color.appError
            }
        }
        if isSelected {
            return Color.appPrimary
        }
        return Color.gray.opacity(0.3)
    }

    private var labelBackgroundColor: Color {
        if showFeedback {
            if isCorrect {
                return Color.appSuccess
            } else if isWrong {
                return Color.appError
            }
        }
        if isSelected {
            return Color.appPrimary
        }
        return Color.gray.opacity(0.2)
    }

    private var labelColor: Color {
        if showFeedback && (isCorrect || isWrong) {
            return .white
        }
        if isSelected {
            return .white
        }
        return Color.appTextSecondary
    }

    private var textColor: Color {
        if showFeedback && (isCorrect || isWrong) {
            return Color.appTextPrimary
        }
        return Color.appTextPrimary
    }

    private var iconColor: Color {
        if isCorrect {
            return Color.appSuccess
        } else if isWrong {
            return Color.appError
        }
        return Color.appTextSecondary
    }

    private var feedbackIcon: String {
        if isCorrect {
            return AppIcons.checkmark
        } else if isWrong {
            return AppIcons.xmark
        }
        return ""
    }

    private var shadowColor: Color {
        if isPressed {
            return .clear
        }
        return Color.black.opacity(0.1)
    }

    private var shadowRadius: CGFloat {
        isPressed ? 0 : 4
    }

    private var shadowY: CGFloat {
        isPressed ? 0 : 2
    }
}

#Preview {
    VStack(spacing: AppSpacing.medium) {
        // Normal state
        AnswerButton(
            text: "Paris",
            label: "A",
            isSelected: false,
            isCorrect: false,
            isWrong: false,
            showFeedback: false,
            action: {}
        )

        // Selected
        AnswerButton(
            text: "London",
            label: "B",
            isSelected: true,
            isCorrect: false,
            isWrong: false,
            showFeedback: false,
            action: {}
        )

        // Correct
        AnswerButton(
            text: "Paris",
            label: "A",
            isSelected: true,
            isCorrect: true,
            isWrong: false,
            showFeedback: true,
            action: {}
        )

        // Wrong
        AnswerButton(
            text: "Berlin",
            label: "C",
            isSelected: true,
            isCorrect: false,
            isWrong: true,
            showFeedback: true,
            action: {}
        )
    }
    .padding()
}
