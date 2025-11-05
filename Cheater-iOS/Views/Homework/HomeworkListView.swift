//
//  HomeworkListView.swift
//  Cheater-iOS
//
//  Main homework list screen
//

import SwiftUI
import CoreData

struct HomeworkListView: View {
    @StateObject private var viewModel = HomeworkListViewModel()

    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottomTrailing) {
                // Main content
                Group {
                    if viewModel.homework.isEmpty {
                        EmptyHomeworkView(onAddTapped: viewModel.addNewHomework)
                    } else {
                        homeworkList
                    }
                }

                // Floating action button
                floatingAddButton
            }
            .navigationTitle("Homework")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        // Future: Navigate to profile/settings
                    } label: {
                        Image(systemName: AppIcons.person)
                    }
                }
            }
            .sheet(isPresented: $viewModel.showingCaptureSheet) {
                CaptureFlowView()
            }
            .onAppear {
                viewModel.loadHomework()
            }
            .alert("Error", isPresented: $viewModel.showError) {
                Button("OK", role: .cancel) {}
            } message: {
                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                }
            }
        }
    }

    private var homeworkList: some View {
        ScrollView {
            LazyVStack(spacing: AppSpacing.medium) {
                ForEach(viewModel.homework) { homework in
                    NavigationLink(destination: HomeworkDetailView(homework: homework)) {
                        HomeworkCardView(homework: homework)
                    }
                    .buttonStyle(PlainButtonStyle())
                    .contextMenu {
                        Button(role: .destructive) {
                            viewModel.deleteHomework(homework)
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }
                    }
                }
            }
            .padding(AppSpacing.screenPadding)
            .padding(.bottom, 80) // Space for floating button
        }
        .refreshable {
            viewModel.loadHomework()
        }
    }

    private var floatingAddButton: some View {
        Button {
            viewModel.addNewHomework()
        } label: {
            Image(systemName: AppIcons.add)
                .font(.system(size: 28, weight: .semibold))
                .foregroundColor(.white)
                .frame(width: AppSize.floatingActionButton, height: AppSize.floatingActionButton)
                .background(Color.appPrimary)
                .clipShape(Circle())
                .shadow(
                    color: Color.black.opacity(0.2),
                    radius: 8,
                    x: 0,
                    y: 4
                )
        }
        .padding(AppSpacing.large)
    }
}

// MARK: - Empty State View
struct EmptyHomeworkView: View {
    let onAddTapped: () -> Void

    var body: some View {
        VStack(spacing: AppSpacing.large) {
            Spacer()

            Image(systemName: "book.closed")
                .font(.system(size: 80))
                .foregroundStyle(Color.appTextSecondary.opacity(0.5))

            VStack(spacing: AppSpacing.small) {
                Text("No homework yet!")
                    .font(AppTypography.title)
                    .foregroundColor(.appTextPrimary)

                Text("Tap the + button below to add your first homework and start learning")
                    .font(AppTypography.body)
                    .foregroundColor(.appTextSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, AppSpacing.xLarge)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.appBackground)
    }
}

#Preview("With Homework") {
    HomeworkListView()
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}

#Preview("Empty State") {
    NavigationStack {
        EmptyHomeworkView(onAddTapped: {})
    }
}
