//
//  OCRService.swift
//  Cheater-iOS
//
//  Optical Character Recognition service using Apple Vision framework
//

import Foundation
import Vision
import UIKit

// MARK: - OCR Errors
enum OCRError: LocalizedError {
    case invalidImage
    case noTextFound
    case lowConfidence
    case processingFailed(String)

    var errorDescription: String? {
        switch self {
        case .invalidImage:
            return "Invalid image provided"
        case .noTextFound:
            return "No text detected in image. Please ensure your homework has clear, readable text."
        case .lowConfidence:
            return "Text quality is too low. Try taking a clearer photo with better lighting."
        case .processingFailed(let message):
            return "OCR processing failed: \(message)"
        }
    }

    var recoverySuggestion: String? {
        switch self {
        case .invalidImage:
            return "Please capture or select a valid image."
        case .noTextFound:
            return "Make sure your homework contains text and try again."
        case .lowConfidence:
            return "Tips for better results:\n• Use good lighting\n• Hold camera steady\n• Ensure text is in focus"
        case .processingFailed:
            return "Please try again or contact support if the problem persists."
        }
    }
}

// MARK: - OCR Service
actor OCRService {
    // MARK: - Properties

    private let minimumConfidence: Float = 0.5
    private let recognitionLevel: VNRequestTextRecognitionLevel = .accurate

    // MARK: - Public Methods

    /// Extract text from image using Vision framework
    /// - Parameter image: UIImage to extract text from
    /// - Returns: Extracted text as a string
    /// - Throws: OCRError if extraction fails
    func extractText(from image: UIImage) async throws -> String {
        // Validate image
        guard let cgImage = image.cgImage else {
            throw OCRError.invalidImage
        }

        // Create text recognition request
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = recognitionLevel
        request.recognitionLanguages = ["en-GB", "en-US"] // Support both UK and US English
        request.usesLanguageCorrection = true

        // Perform OCR
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

        do {
            try handler.perform([request])
        } catch {
            throw OCRError.processingFailed(error.localizedDescription)
        }

        // Extract results
        guard let observations = request.results, !observations.isEmpty else {
            throw OCRError.noTextFound
        }

        // Build text from observations
        var extractedText = ""
        var totalConfidence: Float = 0
        var lineCount = 0

        for observation in observations {
            guard let topCandidate = observation.topCandidates(1).first else {
                continue
            }

            // Track confidence
            totalConfidence += topCandidate.confidence
            lineCount += 1

            // Add text with newline
            extractedText += topCandidate.string + "\n"
        }

        // Validate results
        guard !extractedText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            throw OCRError.noTextFound
        }

        // Check average confidence
        let averageConfidence = totalConfidence / Float(lineCount)
        guard averageConfidence >= minimumConfidence else {
            throw OCRError.lowConfidence
        }

        return extractedText.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Validate image quality before OCR
    /// - Parameter image: UIImage to validate
    /// - Returns: Quality assessment with suggestions
    func validateImageQuality(_ image: UIImage) -> ImageQuality {
        var issues: [String] = []

        // Check image size
        let minSize: CGFloat = 300
        if image.size.width < minSize || image.size.height < minSize {
            issues.append("Image resolution is too low")
        }

        // Check if image is too large (might indicate blur/zoom issues)
        let maxSize: CGFloat = 4000
        if image.size.width > maxSize || image.size.height > maxSize {
            issues.append("Image is very large, which might affect processing speed")
        }

        // Determine quality level
        let quality: ImageQuality.Level
        if issues.isEmpty {
            quality = .good
        } else if issues.count == 1 {
            quality = .fair
        } else {
            quality = .poor
        }

        return ImageQuality(level: quality, issues: issues)
    }
}

// MARK: - Image Quality
struct ImageQuality {
    enum Level {
        case good
        case fair
        case poor

        var message: String {
            switch self {
            case .good:
                return "Image quality looks good"
            case .fair:
                return "Image quality is acceptable"
            case .poor:
                return "Image quality might affect results"
            }
        }
    }

    let level: Level
    let issues: [String]

    var isAcceptable: Bool {
        level != .poor
    }

    var suggestionMessage: String? {
        guard !issues.isEmpty else { return nil }
        return issues.joined(separator: "\n")
    }
}

// MARK: - Mock Service for Testing
#if DEBUG
actor MockOCRService {
    func extractText(from image: UIImage) async throws -> String {
        // Simulate processing delay
        try await Task.sleep(nanoseconds: 1_000_000_000) // 1 second

        // Return sample homework text
        return """
        Mathematics Homework - Chapter 5

        1. Solve for x: 3x + 7 = 22
        2. Calculate the area of a rectangle with length 12cm and width 8cm
        3. What is 15% of 200?
        4. Simplify: (2x + 3)(x - 4)
        5. Find the perimeter of a triangle with sides 5cm, 7cm, and 9cm

        Science Questions:
        - What is photosynthesis?
        - Name three types of rocks
        - Explain the water cycle

        History:
        - When did World War II begin?
        - Who was the first president of the United States?
        """
    }

    func validateImageQuality(_ image: UIImage) -> ImageQuality {
        return ImageQuality(level: .good, issues: [])
    }
}
#endif
