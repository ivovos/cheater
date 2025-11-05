//
//  HomeworkCardView.swift
//  Cheater-iOS
//
//  Card component for displaying homework items
//

import SwiftUI

struct HomeworkCardView: View {
    let homework: Homework

    var body: some View {
        HStack(spacing: AppSpacing.medium) {
            // Thumbnail
            Image(systemName: AppIcons.book)
                .font(.system(size: AppSize.iconLarge))
                .foregroundStyle(Color.appPrimary)
                .frame(width: AppSize.thumbnailSize, height: AppSize.thumbnailSize)
                .background(Color.appPrimary.opacity(0.1))
                .cornerRadius(AppRadius.medium)

            // Info
            VStack(alignment: .leading, spacing: AppSpacing.small) {
                HStack {
                    Text(homework.title)
                        .font(AppTypography.headline)
                        .foregroundColor(.appTextPrimary)
                    Spacer()
                    if let bestScore = homework.bestScore {
                        HStack(spacing: 4) {
                            Image(systemName: "star.fill")
                                .font(.caption)
                                .foregroundColor(.appWarning)
                            Text("\(bestScore)/10")
                                .font(AppTypography.caption)
                                .foregroundColor(.appTextSecondary)
                        }
                    }
                }

                if let subject = homework.subject {
                    Text(subject)
                        .font(AppTypography.callout)
                        .foregroundColor(.appPrimary)
                }

                Text(homework.createdAt, style: .date)
                    .font(AppTypography.footnote)
                    .foregroundColor(.appTextSecondary)

                // Progress bar
                VStack(alignment: .leading, spacing: 4) {
                    ProgressView(value: homework.progress, total: 1.0)
                        .tint(.appPrimary)
                    HStack {
                        Text("Progress: \(homework.completionPercentage)%")
                            .font(AppTypography.caption)
                            .foregroundColor(.appTextSecondary)
                        Spacer()
                        if homework.totalAttempts > 0 {
                            Text("\(homework.totalAttempts) attempt\(homework.totalAttempts == 1 ? "" : "s")")
                                .font(AppTypography.caption)
                                .foregroundColor(.appTextSecondary)
                        }
                    }
                }
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
}

#Preview {
    VStack(spacing: AppSpacing.medium) {
        HomeworkCardView(homework: Homework.sampleList[0])
        HomeworkCardView(homework: Homework.sampleList[1])
        HomeworkCardView(homework: Homework.sampleList[2])
    }
    .padding()
    .background(Color.appSecondaryBackground)
}
