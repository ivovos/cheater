//
//  DesignTokens.swift
//  Cheater-iOS
//
//  Design system tokens for consistent theming
//  Future-proof: Allows easy theming implementation later
//

import SwiftUI

// MARK: - Colors
extension Color {
    // Primary Colors (Semantic naming for future theming)
    static let appPrimary = Color.blue
    static let appSuccess = Color.green
    static let appError = Color.red
    static let appWarning = Color.orange

    // Neutral Colors
    static let appBackground = Color(uiColor: .systemBackground)
    static let appSecondaryBackground = Color(uiColor: .secondarySystemBackground)
    static let appCardBackground = Color(uiColor: .systemBackground)
    static let appTextPrimary = Color.primary
    static let appTextSecondary = Color.secondary

    // Gradients
    static let appGradientStart = Color.blue.opacity(0.1)
    static let appGradientEnd = Color.green.opacity(0.1)
}

// MARK: - Typography
struct AppTypography {
    // Text Styles
    static let largeTitle = Font.largeTitle.weight(.bold)
    static let title = Font.title3.weight(.semibold)
    static let headline = Font.headline
    static let body = Font.body
    static let callout = Font.callout
    static let subheadline = Font.subheadline
    static let footnote = Font.footnote
    static let caption = Font.caption
}

// MARK: - Spacing
struct AppSpacing {
    static let tiny: CGFloat = 4
    static let small: CGFloat = 8
    static let medium: CGFloat = 16
    static let large: CGFloat = 24
    static let xLarge: CGFloat = 32
    static let xxLarge: CGFloat = 48

    // Specific spacing
    static let cardSpacing: CGFloat = 16
    static let buttonPadding: CGFloat = 16
    static let screenPadding: CGFloat = 16
}

// MARK: - Corner Radius
struct AppRadius {
    static let small: CGFloat = 8
    static let medium: CGFloat = 12
    static let large: CGFloat = 16
    static let xLarge: CGFloat = 20

    // Specific radii
    static let button: CGFloat = 12
    static let card: CGFloat = 16
    static let modal: CGFloat = 20
    static let image: CGFloat = 12
}

// MARK: - Shadows
struct AppShadow {
    static let card = Shadow(
        color: Color.black.opacity(0.1),
        radius: 8,
        x: 0,
        y: 2
    )

    static let buttonPressed = Shadow(
        color: Color.black.opacity(0.15),
        radius: 12,
        x: 0,
        y: 4
    )

    struct Shadow {
        let color: Color
        let radius: CGFloat
        let x: CGFloat
        let y: CGFloat
    }
}

// MARK: - Animation Durations
struct AppAnimation {
    static let fast: Double = 0.2
    static let medium: Double = 0.3
    static let slow: Double = 0.5

    // Spring animation
    static func spring(response: Double = 0.3, dampingFraction: Double = 0.7) -> Animation {
        .spring(response: response, dampingFraction: dampingFraction)
    }
}

// MARK: - Icons
struct AppIcons {
    // SF Symbols
    static let add = "plus.circle.fill"
    static let camera = "camera.fill"
    static let photo = "photo.on.rectangle.angled"
    static let document = "doc.text.viewfinder"
    static let edit = "square.and.pencil"
    static let checkmark = "checkmark.circle.fill"
    static let xmark = "xmark.circle.fill"
    static let chart = "chart.bar.fill"
    static let person = "person.circle.fill"
    static let list = "list.bullet"
    static let book = "book.fill"
}

// MARK: - Sizes
struct AppSize {
    // Button sizes
    static let buttonHeight: CGFloat = 56
    static let floatingActionButton: CGFloat = 56

    // Icon sizes
    static let iconSmall: CGFloat = 20
    static let iconMedium: CGFloat = 24
    static let iconLarge: CGFloat = 32
    static let iconXLarge: CGFloat = 80

    // Image sizes
    static let thumbnailSize: CGFloat = 60
    static let cardImageHeight: CGFloat = 120

    // Minimum tap target
    static let minTapTarget: CGFloat = 44
}
