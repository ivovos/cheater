//
//  ContentView.swift
//  Cheater-iOS
//
//  Main app content view
//

import SwiftUI
import CoreData

struct ContentView: View {
    var body: some View {
        HomeworkListView()
    }
}

#Preview {
    ContentView()
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}
