//
//  CaptureFlowViewModel.swift
//  Cheater-iOS
//
//  ViewModel for orchestrating homework capture flow
//  Flow: Camera → OCR → AI → Save
//

import Foundation
import SwiftUI
import Combine
import CoreData

@MainActor
class CaptureFlowViewModel: ObservableObject {
    // MARK: - Published Properties

    @Published var flowState: FlowState = .idle
    @Published var capturedImage: UIImage?
    @Published var extractedText: String?
    @Published var errorMessage: String?
    @Published var showError = false

    // MARK: - Flow State

    enum FlowState: Equatable {
        case idle
        case capturingImage
        case generatingQuiz
        case saving
        case completed
        case failed(String)

        var isProcessing: Bool {
            switch self {
            case .generatingQuiz, .saving:
                return true
            default:
                return false
            }
        }

        var description: String {
            switch self {
            case .idle:
                return "Ready"
            case .capturingImage:
                return "Capturing image..."
            case .generatingQuiz:
                return "Generating quiz with AI..."
            case .saving:
                return "Saving..."
            case .completed:
                return "Complete!"
            case .failed(let message):
                return "Error: \(message)"
            }
        }
    }

    // MARK: - Dependencies

    private let persistenceController: PersistenceController
    private var aiServiceActor: AIService?
    private var useMockAI = false

    // MARK: - Initialization

    init(persistenceController: PersistenceController = .shared) {
        self.persistenceController = persistenceController

        // Try to create AI service
        // If no API key, we'll use mock data in debug mode
        if let service = try? AIService() {
            self.aiServiceActor = service
            self.useMockAI = false
        } else {
            #if DEBUG
            self.useMockAI = true
            print("⚠️ No API key configured. Using mock quiz generation.")
            #endif
        }
    }

    // MARK: - Public Methods

    /// Start the capture flow with a selected image
    func processImage(_ image: UIImage, title: String = "Homework", subject: String? = nil) async {
        capturedImage = image
        flowState = .generatingQuiz
        print("🚀 Starting Claude Vision quiz generation...")

        do {
            // Step 1: Generate quiz directly from image using Claude Vision
            let quiz: Quiz

            #if DEBUG
            if useMockAI {
                // Use mock quiz for testing without API key
                print("🧪 Using mock AI service")
                try await Task.sleep(nanoseconds: 2_000_000_000) // Simulate 2s delay
                quiz = Quiz(homeworkId: UUID(), questions: Question.sampleList)
            } else if let aiService = aiServiceActor {
                // Use Claude Vision to generate quiz from image
                quiz = try await aiService.generateQuiz(from: image, subject: subject)
            } else {
                throw CaptureError.aiFailed("AI service not available")
            }
            #else
            guard let aiService = aiServiceActor else {
                throw CaptureError.aiFailed("AI service not configured")
            }
            // Use Claude Vision to generate quiz from image
            quiz = try await aiService.generateQuiz(from: image, subject: subject)
            #endif

            // Step 2: Save to Core Data
            flowState = .saving
            try await saveHomework(
                image: image,
                ocrText: nil,  // No OCR text since we used vision directly
                quiz: quiz,
                title: title,
                subject: subject
            )
            print("✅ Homework saved successfully")

            // Step 3: Complete
            flowState = .completed
            print("✅ Capture flow completed")

        } catch let error as CaptureError {
            handleError(error)
        } catch let error as AIError {
            handleError(.aiFailed(error.localizedDescription))
        } catch {
            handleError(.unknown(error.localizedDescription))
        }
    }

    /// Reset the flow to start over
    func reset() {
        flowState = .idle
        capturedImage = nil
        extractedText = nil
        errorMessage = nil
        showError = false
    }

    // MARK: - Private Methods

    private func saveHomework(
        image: UIImage,
        ocrText: String?,
        quiz: Quiz,
        title: String,
        subject: String?
    ) async throws {
        let context = persistenceController.container.viewContext

        // Create homework entity
        let homeworkEntity = HomeworkEntity(context: context)
        let homeworkId = UUID()
        homeworkEntity.id = homeworkId
        homeworkEntity.title = title
        homeworkEntity.subject = subject
        homeworkEntity.ocrText = ocrText
        homeworkEntity.createdAt = Date()
        print("📝 Creating homework: \(title) (\(homeworkId))")

        // Save image (for now, just store a placeholder)
        // In a real app, you'd save to file system or cloud storage
        homeworkEntity.imageURL = "captured_\(homeworkId.uuidString)"

        // Create quiz entity
        let quizEntity = QuizEntity(context: context)
        quizEntity.id = quiz.id
        quizEntity.createdAt = quiz.createdAt
        quizEntity.homework = homeworkEntity
        print("📝 Creating quiz with \(quiz.questions.count) questions")

        // Save questions as JSON
        let questionsData = try JSONEncoder().encode(quiz.questions)
        quizEntity.questionsJSON = questionsData

        // Create progress entity
        let progressEntity = ProgressEntity(context: context)
        progressEntity.id = UUID()
        progressEntity.completionPercentage = 0
        progressEntity.bestScore = 0
        progressEntity.totalAttempts = 0
        progressEntity.homework = homeworkEntity
        print("📝 Creating progress entity")

        // Save context
        try context.save()
        print("💾 Core Data context saved successfully")
    }

    private func handleError(_ error: CaptureError) {
        print("❌ Capture error: \(error.localizedDescription)")
        flowState = .failed(error.localizedDescription)
        errorMessage = error.localizedDescription
        showError = true
    }
}

// MARK: - Capture Errors

enum CaptureError: LocalizedError {
    case noTextFound
    case ocrFailed(String)
    case aiFailed(String)
    case saveFailed
    case unknown(String)

    var errorDescription: String? {
        switch self {
        case .noTextFound:
            return "No text found in image"
        case .ocrFailed(let message):
            return "OCR failed: \(message)"
        case .aiFailed(let message):
            return "Quiz generation failed: \(message)"
        case .saveFailed:
            return "Failed to save homework"
        case .unknown(let message):
            return "Unknown error: \(message)"
        }
    }

    var recoverySuggestion: String? {
        switch self {
        case .noTextFound:
            return "Try capturing an image with clearer text"
        case .ocrFailed:
            return "Please ensure the image has readable text and try again"
        case .aiFailed:
            return "Check your API key and internet connection"
        case .saveFailed:
            return "Please try again"
        case .unknown:
            return "Please try again or contact support"
        }
    }
}
