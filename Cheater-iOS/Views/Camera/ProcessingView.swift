//
//  ProcessingView.swift
//  Cheater-iOS
//
//  View for showing processing/loading states during capture flow
//

import SwiftUI

struct ProcessingView: View {
    let state: CaptureFlowViewModel.FlowState
    let onCancel: () -> Void

    var body: some View {
        ZStack {
            // Background blur
            Color.black.opacity(0.4)
                .ignoresSafeArea()

            // Processing card
            VStack(spacing: AppSpacing.large) {
                // Progress indicator
                if state.isProcessing {
                    ProgressView()
                        .scaleEffect(1.5)
                        .tint(.appPrimary)
                }

                // State icon
                stateIcon

                // State message
                Text(state.description)
                    .font(AppTypography.headline)
                    .foregroundColor(.appTextPrimary)
                    .multilineTextAlignment(.center)

                // Detail message
                if let detailMessage = detailMessage {
                    Text(detailMessage)
                        .font(AppTypography.body)
                        .foregroundColor(.appTextSecondary)
                        .multilineTextAlignment(.center)
                }

                // Cancel button (only show during processing)
                if state.isProcessing {
                    Button("Cancel") {
                        onCancel()
                    }
                    .font(AppTypography.body)
                    .foregroundColor(.appError)
                    .padding(.top, AppSpacing.small)
                }
            }
            .padding(AppSpacing.large)
            .frame(maxWidth: 300)
            .background(Color.appCardBackground)
            .cornerRadius(AppRadius.large)
            .shadow(
                color: AppShadow.card.color,
                radius: AppShadow.card.radius * 2,
                x: AppShadow.card.x,
                y: AppShadow.card.y
            )
        }
    }

    // MARK: - Computed Properties

    @ViewBuilder
    private var stateIcon: some View {
        switch state {
        case .generatingQuiz:
            Image(systemName: "brain")
                .font(.system(size: 50))
                .foregroundColor(.appPrimary)

        case .saving:
            Image(systemName: "square.and.arrow.down")
                .font(.system(size: 50))
                .foregroundColor(.appPrimary)

        case .completed:
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 50))
                .foregroundColor(.appSuccess)

        case .failed:
            Image(systemName: "xmark.circle.fill")
                .font(.system(size: 50))
                .foregroundColor(.appError)

        default:
            EmptyView()
        }
    }

    private var detailMessage: String? {
        switch state {
        case .generatingQuiz:
            return "Analyzing your homework with AI..."
        case .saving:
            return "Almost done..."
        case .completed:
            return "Your quiz is ready!"
        case .failed:
            return nil
        default:
            return nil
        }
    }
}

#Preview {
    ProcessingView(
        state: .generatingQuiz,
        onCancel: {}
    )
}
