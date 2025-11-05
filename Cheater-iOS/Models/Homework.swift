//
//  Homework.swift
//  Cheater-iOS
//
//  Domain model for homework items
//

import Foundation

struct Homework: Identifiable, Codable {
    let id: UUID
    var title: String
    var subject: String?
    var imageURL: String
    var ocrText: String?
    let createdAt: Date

    // Progress info (denormalized for convenience)
    var bestScore: Int?
    var totalAttempts: Int
    var completionPercentage: Int
    var lastPlayedAt: Date?

    init(
        id: UUID = UUID(),
        title: String,
        subject: String? = nil,
        imageURL: String,
        ocrText: String? = nil,
        createdAt: Date = Date(),
        bestScore: Int? = nil,
        totalAttempts: Int = 0,
        completionPercentage: Int = 0,
        lastPlayedAt: Date? = nil
    ) {
        self.id = id
        self.title = title
        self.subject = subject
        self.imageURL = imageURL
        self.ocrText = ocrText
        self.createdAt = createdAt
        self.bestScore = bestScore
        self.totalAttempts = totalAttempts
        self.completionPercentage = completionPercentage
        self.lastPlayedAt = lastPlayedAt
    }

    // Computed property for progress (0.0 - 1.0)
    var progress: Double {
        Double(completionPercentage) / 100.0
    }

    // Helper to generate auto title from subject and date
    static func generateTitle(subject: String?, date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium

        if let subject = subject {
            return "\(subject) - \(formatter.string(from: date))"
        } else {
            return "Homework - \(formatter.string(from: date))"
        }
    }
}

// MARK: - Core Data Conversion
extension Homework {
    /// Convert Core Data entity to domain model
    init(from entity: HomeworkEntity) {
        self.id = entity.id ?? UUID()
        self.title = entity.title ?? "Untitled"
        self.subject = entity.subject
        self.imageURL = entity.imageURL ?? ""
        self.ocrText = entity.ocrText
        self.createdAt = entity.createdAt ?? Date()

        // Load progress if available
        if let progress = entity.progress {
            // Core Data scalar types default to 0 when nil, so we check for that
            let scoreValue = Int(progress.bestScore)
            self.bestScore = scoreValue > 0 ? scoreValue : nil
            self.totalAttempts = Int(progress.totalAttempts)
            self.completionPercentage = Int(progress.completionPercentage)
            self.lastPlayedAt = progress.lastPlayedAt
        } else {
            self.bestScore = nil
            self.totalAttempts = 0
            self.completionPercentage = 0
            self.lastPlayedAt = nil
        }
    }

    /// Update Core Data entity from domain model
    func update(entity: HomeworkEntity) {
        entity.id = self.id
        entity.title = self.title
        entity.subject = self.subject
        entity.imageURL = self.imageURL
        entity.ocrText = self.ocrText
        entity.createdAt = self.createdAt
    }
}

// MARK: - Sample Data
extension Homework {
    static let sample = Homework(
        title: "Math Homework",
        subject: "Mathematics",
        imageURL: "https://example.com/homework.jpg",
        ocrText: "Solve the following equations...",
        bestScore: 8,
        totalAttempts: 3,
        completionPercentage: 80,
        lastPlayedAt: Date()
    )

    static let sampleList: [Homework] = [
        Homework(
            title: "Math Homework",
            subject: "Mathematics",
            imageURL: "math",
            bestScore: 8,
            totalAttempts: 2,
            completionPercentage: 80
        ),
        Homework(
            title: "Science Notes",
            subject: "Science",
            imageURL: "science",
            bestScore: 9,
            totalAttempts: 1,
            completionPercentage: 90
        ),
        Homework(
            title: "History Essay",
            subject: "History",
            imageURL: "history",
            bestScore: 10,
            totalAttempts: 1,
            completionPercentage: 100
        )
    ]
}
