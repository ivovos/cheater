//
//  HomeworkDetailView.swift
//  Cheater-iOS
//
//  Detail view for a single homework item
//

import SwiftUI
import CoreData

struct HomeworkDetailView: View {
    let homework: Homework
    @State private var quiz: Quiz?
    @State private var isLoading = false
    @State private var showQuiz = false
    @State private var errorMessage: String?
    @State private var showError = false
    @State private var expandedSections: Set<String> = []

    private let persistenceController = PersistenceController.shared

    var body: some View {
        ScrollView {
            VStack(spacing: AppSpacing.large) {
                // Image preview
                imagePreview

                // Metadata card
                metadataCard

                // Progress stats
                progressCard

                // Start Quiz button
                if quiz != nil {
                    startQuizButton
                }

                // OCR Text (collapsible)
                if let ocrText = homework.ocrText {
                    ocrTextSection(ocrText)
                }

                Spacer(minLength: AppSpacing.large)
            }
            .padding(AppSpacing.screenPadding)
        }
        .background(Color.appSecondaryBackground)
        .navigationTitle(homework.title)
        .navigationBarTitleDisplayMode(.inline)
        .fullScreenCover(isPresented: $showQuiz) {
            if let quiz = quiz {
                NavigationStack {
                    QuizView(quiz: quiz, homework: homework)
                }
            }
        }
        .alert("Error", isPresented: $showError) {
            Button("OK", role: .cancel) {}
        } message: {
            if let errorMessage = errorMessage {
                Text(errorMessage)
            }
        }
        .task {
            loadQuiz()
        }
    }

    // MARK: - Components

    private var imagePreview: some View {
        Image(systemName: "doc.text.image")
            .font(.system(size: 100))
            .foregroundStyle(Color.appPrimary.opacity(0.5))
            .frame(maxWidth: .infinity)
            .frame(height: 200)
            .background(Color.appPrimary.opacity(0.1))
            .cornerRadius(AppRadius.large)
    }

    private var metadataCard: some View {
        VStack(alignment: .leading, spacing: AppSpacing.small) {
            if let subject = homework.subject {
                HStack {
                    Image(systemName: "book.fill")
                        .foregroundColor(.appPrimary)
                    Text(subject)
                        .font(AppTypography.body)
                        .foregroundColor(.appTextSecondary)
                }
            }

            HStack {
                Image(systemName: "calendar")
                    .foregroundColor(.appTextSecondary)
                Text("Added \(homework.createdAt, style: .date)")
                    .font(AppTypography.body)
                    .foregroundColor(.appTextSecondary)
            }

            if let lastPlayed = homework.lastPlayedAt {
                HStack {
                    Image(systemName: "clock")
                        .foregroundColor(.appTextSecondary)
                    Text("Last played \(lastPlayed, style: .relative)")
                        .font(AppTypography.body)
                        .foregroundColor(.appTextSecondary)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
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

    private var progressCard: some View {
        VStack(spacing: AppSpacing.medium) {
            Text("Progress")
                .font(AppTypography.headline)
                .frame(maxWidth: .infinity, alignment: .leading)

            VStack(spacing: AppSpacing.small) {
                ProgressView(value: homework.progress, total: 1.0)
                    .tint(.appPrimary)

                HStack {
                    Text("\(homework.completionPercentage)% Complete")
                        .font(AppTypography.body)
                        .foregroundColor(.appTextSecondary)
                    Spacer()
                }
            }

            Divider()

            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Best Score")
                        .font(AppTypography.caption)
                        .foregroundColor(.appTextSecondary)
                    if let bestScore = homework.bestScore {
                        Text("\(bestScore)/10")
                            .font(AppTypography.title)
                            .foregroundColor(.appPrimary)
                    } else {
                        Text("Not played yet")
                            .font(AppTypography.body)
                            .foregroundColor(.appTextSecondary)
                    }
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 4) {
                    Text("Attempts")
                        .font(AppTypography.caption)
                        .foregroundColor(.appTextSecondary)
                    Text("\(homework.totalAttempts)")
                        .font(AppTypography.title)
                        .foregroundColor(.appPrimary)
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

    private var startQuizButton: some View {
        Button {
            showQuiz = true
        } label: {
            HStack {
                Image(systemName: "play.circle.fill")
                Text(homework.totalAttempts > 0 ? "Play Again" : "Start Quiz")
            }
            .font(AppTypography.headline)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color.appPrimary)
            .cornerRadius(AppRadius.button)
            .shadow(color: Color.black.opacity(0.2), radius: 8, x: 0, y: 4)
        }
    }

    private func ocrTextSection(_ text: String) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.small) {
            Button {
                toggleSection("ocr")
            } label: {
                HStack {
                    Text("Extracted Text")
                        .font(AppTypography.headline)
                        .foregroundColor(.appTextPrimary)

                    Spacer()

                    Image(systemName: isExpanded("ocr") ? "chevron.up" : "chevron.down")
                        .foregroundColor(.appTextSecondary)
                }
            }

            if isExpanded("ocr") {
                Text(text)
                    .font(AppTypography.body)
                    .foregroundColor(.appTextSecondary)
                    .padding(.top, AppSpacing.small)
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

    // MARK: - Helpers

    private func loadQuiz() {
        isLoading = true

        if let quizEntity = persistenceController.fetchQuiz(for: homework.id) {
            quiz = Quiz(from: quizEntity)
        }

        isLoading = false
    }

    private func isExpanded(_ section: String) -> Bool {
        expandedSections.contains(section)
    }

    private func toggleSection(_ section: String) {
        withAnimation {
            if expandedSections.contains(section) {
                expandedSections.remove(section)
            } else {
                expandedSections.insert(section)
            }
        }
    }
}

#Preview {
    NavigationStack {
        HomeworkDetailView(homework: Homework.sample)
            .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
    }
}
