//
//  Cheater_iOSApp.swift
//  Cheater-iOS
//
//  Created by Ivo Vos on 04/11/2025.
//

import SwiftUI
import CoreData

@main
struct Cheater_iOSApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
