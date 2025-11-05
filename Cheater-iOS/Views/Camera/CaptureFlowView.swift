//
//  CaptureFlowView.swift
//  Cheater-iOS
//
//  Main view for homework capture flow
//

import SwiftUI

struct CaptureFlowView: View {
    @Environment(\.dismiss) var dismiss
    @StateObject private var viewModel = CaptureFlowViewModel()

    @State private var showImagePicker = false
    @State private var showSourcePicker = true
    @State private var sourceType: UIImagePickerController.SourceType = .camera
    @State private var showImagePreview = false
    @State private var capturedImage: UIImage?

    var body: some View {
        NavigationStack {
            ZStack {
                // Background
                Color.appSecondaryBackground
                    .ignoresSafeArea()

                // Main content
                if showSourcePicker {
                    sourcePickerView
                } else if showImagePreview, let image = capturedImage {
                    imagePreviewView(image: image)
                }

                // Processing overlay
                if shouldShowProcessing {
                    ProcessingView(
                        state: viewModel.flowState,
                        onCancel: {
                            viewModel.reset()
                            dismiss()
                        }
                    )
                }
            }
            .navigationTitle("Add Homework")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
            .sheet(isPresented: $showImagePicker) {
                ImagePicker(sourceType: sourceType) { image in
                    capturedImage = image
                    showSourcePicker = false
                    showImagePreview = true
                }
            }
            .alert("Error", isPresented: $viewModel.showError) {
                Button("Try Again", role: .cancel) {
                    viewModel.reset()
                    showSourcePicker = true
                }
                Button("Cancel") {
                    dismiss()
                }
            } message: {
                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                }
            }
            .onChange(of: viewModel.flowState) { _, newState in
                if case .completed = newState {
                    // Wait a moment to show success, then dismiss
                    Task {
                        try? await Task.sleep(nanoseconds: 1_500_000_000) // 1.5 seconds
                        dismiss()
                    }
                }
            }
        }
    }

    // MARK: - Computed Properties

    private var shouldShowProcessing: Bool {
        switch viewModel.flowState {
        case .generatingQuiz, .saving, .completed:
            return true
        default:
            return false
        }
    }

    // MARK: - Source Picker View

    private var sourcePickerView: some View {
        VStack(spacing: AppSpacing.large) {
            Spacer()

            // Instructions
            VStack(spacing: AppSpacing.medium) {
                Image(systemName: "camera.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.appPrimary)

                Text("Capture Your Homework")
                    .font(AppTypography.title)
                    .foregroundColor(.appTextPrimary)

                Text("Take a photo or choose from your library")
                    .font(AppTypography.body)
                    .foregroundColor(.appTextSecondary)
                    .multilineTextAlignment(.center)
            }
            .padding(AppSpacing.large)

            Spacer()

            // Action buttons
            VStack(spacing: AppSpacing.medium) {
                // Camera button
                Button {
                    sourceType = .camera
                    showImagePicker = true
                } label: {
                    HStack {
                        Image(systemName: "camera.fill")
                        Text("Take Photo")
                    }
                    .font(AppTypography.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.appPrimary)
                    .cornerRadius(AppRadius.button)
                }

                // Photo library button
                Button {
                    sourceType = .photoLibrary
                    showImagePicker = true
                } label: {
                    HStack {
                        Image(systemName: "photo.fill")
                        Text("Choose from Library")
                    }
                    .font(AppTypography.headline)
                    .foregroundColor(.appPrimary)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.appPrimary.opacity(0.1))
                    .cornerRadius(AppRadius.button)
                    .overlay(
                        RoundedRectangle(cornerRadius: AppRadius.button)
                            .stroke(Color.appPrimary, lineWidth: 2)
                    )
                }
            }
            .padding(AppSpacing.large)
        }
    }

    // MARK: - Image Preview View

    private func imagePreviewView(image: UIImage) -> some View {
        VStack(spacing: 0) {
            // Image preview
            ScrollView {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .cornerRadius(AppRadius.card)
                    .padding(AppSpacing.medium)
            }

            // Actions
            VStack(spacing: AppSpacing.medium) {
                // Use button
                Button {
                    Task {
                        await viewModel.processImage(
                            image,
                            title: "Homework \(Date().formatted(date: .abbreviated, time: .omitted))",
                            subject: nil
                        )
                    }
                } label: {
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                        Text("Use This Photo")
                    }
                    .font(AppTypography.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.appPrimary)
                    .cornerRadius(AppRadius.button)
                }

                // Retake button
                Button {
                    capturedImage = nil
                    showImagePreview = false
                    showSourcePicker = true
                } label: {
                    HStack {
                        Image(systemName: "arrow.counterclockwise")
                        Text("Retake")
                    }
                    .font(AppTypography.headline)
                    .foregroundColor(.appPrimary)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.appPrimary.opacity(0.1))
                    .cornerRadius(AppRadius.button)
                }
            }
            .padding(AppSpacing.large)
            .background(Color.appCardBackground)
        }
    }
}

#Preview {
    CaptureFlowView()
}
