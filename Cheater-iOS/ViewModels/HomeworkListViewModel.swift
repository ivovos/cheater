//
//  HomeworkListViewModel.swift
//  Cheater-iOS
//
//  ViewModel for homework list screen
//

import Foundation
import SwiftUI
import CoreData
import Combine

@MainActor
class HomeworkListViewModel: ObservableObject {
    // MARK: - Published Properties

    @Published var homework: [Homework] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var showError = false

    // Navigation
    @Published var selectedHomework: Homework?
    @Published var showingCaptureSheet = false

    // MARK: - Dependencies

    private let persistenceController: PersistenceController

    // MARK: - Initialization

    init(persistenceController: PersistenceController = .shared) {
        self.persistenceController = persistenceController
        loadHomework()
    }

    // MARK: - Public Methods

    func loadHomework() {
        isLoading = true

        let entities = persistenceController.fetchHomework()
        homework = entities.map { Homework(from: $0) }

        isLoading = false
    }

    func deleteHomework(at offsets: IndexSet) {
        for index in offsets {
            let homeworkToDelete = homework[index]

            // Find the entity in Core Data
            let entities = persistenceController.fetchHomework()
            if let entity = entities.first(where: { $0.id == homeworkToDelete.id }) {
                persistenceController.deleteHomework(entity)
            }
        }

        // Reload list
        loadHomework()
    }

    func deleteHomework(_ homework: Homework) {
        // Find the entity in Core Data
        let entities = persistenceController.fetchHomework()
        if let entity = entities.first(where: { $0.id == homework.id }) {
            persistenceController.deleteHomework(entity)
        }

        // Reload list
        loadHomework()
    }

    func addNewHomework() {
        showingCaptureSheet = true
    }

    func selectHomework(_ homework: Homework) {
        selectedHomework = homework
    }

    func handleError(_ error: Error) {
        errorMessage = error.localizedDescription
        showError = true
    }
}
