//
//  Persistence.swift
//  Cheater-iOS
//
//  Core Data persistence controller
//

import CoreData

struct PersistenceController {
    @MainActor
    static let shared = PersistenceController()

    @MainActor
    static let preview: PersistenceController = {
        let result = PersistenceController(inMemory: true)
        let viewContext = result.container.viewContext

        // Create sample homework for previews
        let homework = HomeworkEntity(context: viewContext)
        homework.id = UUID()
        homework.title = "Sample Math Homework"
        homework.subject = "Mathematics"
        homework.imageURL = "sample"
        homework.ocrText = "Solve the following equations: 1. 5 + 3 = ?"
        homework.createdAt = Date()

        // Create sample quiz
        let quiz = QuizEntity(context: viewContext)
        quiz.id = UUID()
        quiz.createdAt = Date()
        quiz.homework = homework

        // Create sample questions
        let questions = Question.sampleList
        if let questionsData = try? JSONEncoder().encode(questions) {
            quiz.questionsJSON = questionsData
        }

        // Create sample progress
        let progress = ProgressEntity(context: viewContext)
        progress.id = UUID()
        progress.completionPercentage = 80
        progress.bestScore = 8
        progress.totalAttempts = 3
        progress.lastPlayedAt = Date()
        progress.homework = homework

        do {
            try viewContext.save()
        } catch {
            let nsError = error as NSError
            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
        }
        return result
    }()

    let container: NSPersistentContainer

    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "Cheater_iOS")
        if inMemory {
            container.persistentStoreDescriptions.first!.url = URL(fileURLWithPath: "/dev/null")
        }
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
        container.viewContext.automaticallyMergesChangesFromParent = true
    }

    // MARK: - Helper Methods

    /// Save context if there are changes
    func save() {
        let context = container.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let nsError = error as NSError
                print("Error saving context: \(nsError), \(nsError.userInfo)")
            }
        }
    }

    /// Fetch all homework items
    func fetchHomework() -> [HomeworkEntity] {
        let request: NSFetchRequest<HomeworkEntity> = HomeworkEntity.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(keyPath: \HomeworkEntity.createdAt, ascending: false)]

        do {
            return try container.viewContext.fetch(request)
        } catch {
            print("Error fetching homework: \(error)")
            return []
        }
    }

    /// Fetch quiz for homework
    func fetchQuiz(for homeworkId: UUID) -> QuizEntity? {
        let request: NSFetchRequest<QuizEntity> = QuizEntity.fetchRequest()
        request.predicate = NSPredicate(format: "homework.id == %@", homeworkId as CVarArg)
        request.fetchLimit = 1

        do {
            return try container.viewContext.fetch(request).first
        } catch {
            print("Error fetching quiz: \(error)")
            return nil
        }
    }

    /// Delete homework (cascade deletes quiz and progress)
    func deleteHomework(_ homework: HomeworkEntity) {
        container.viewContext.delete(homework)
        save()
    }

    /// Create or update progress for homework
    func updateProgress(
        for homeworkId: UUID,
        score: Int,
        totalQuestions: Int
    ) {
        let context = container.viewContext

        // Fetch homework
        let homeworkRequest: NSFetchRequest<HomeworkEntity> = HomeworkEntity.fetchRequest()
        homeworkRequest.predicate = NSPredicate(format: "id == %@", homeworkId as CVarArg)

        guard let homework = try? context.fetch(homeworkRequest).first else {
            print("Homework not found for progress update")
            return
        }

        // Get or create progress
        let progress: ProgressEntity
        if let existingProgress = homework.progress {
            progress = existingProgress
        } else {
            progress = ProgressEntity(context: context)
            progress.id = UUID()
            progress.homework = homework
        }

        // Update progress
        progress.totalAttempts += 1
        progress.lastPlayedAt = Date()

        // Update best score if this is better
        let currentBest = Int(progress.bestScore)
        if currentBest == 0 || score > currentBest {
            progress.bestScore = Int16(score)
        }

        // Calculate completion percentage
        let percentage = Int((Double(score) / Double(totalQuestions)) * 100)
        if percentage > progress.completionPercentage {
            progress.completionPercentage = Int16(percentage)
        }

        save()
    }
}

// Note: fetchRequest() methods are auto-generated by Core Data
// because we set codeGenerationType="class" in the .xcdatamodeld file

