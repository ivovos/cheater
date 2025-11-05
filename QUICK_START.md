# Quick Start Guide 🚀

**Everything you need to get going tomorrow morning.**

---

## ⚡ 60-Second Setup

```bash
# 1. Open Xcode
cd /Users/ivovos/Projects/cheater/Cheater-iOS
open Cheater-iOS.xcodeproj

# 2. Build & Run (⌘R)
# 3. Enjoy! Sample data loads automatically
```

That's it! The app works right now.

---

## 📱 What to Expect

1. **Homework list** with 3 sample items
2. **Tap any card** → see details
3. **Tap "Start Quiz"** → play quiz
4. **Complete 10 questions** → see results
5. **Everything works!** (except adding new homework)

---

## 🎯 Today's Mission

**Implement camera capture so users can add homework.**

### Priority Order:
1. **Camera permissions** (5 min)
2. **Camera view** (30 min)
3. **Image preview** (20 min)
4. **Capture flow** (45 min)
5. **Wire OCR + AI** (30 min)
6. **Test end-to-end** (20 min)

**Total:** ~2.5 hours to complete MVP

---

## 📂 Key Files to Work With Today

### Add Camera Permissions
```
Cheater-iOS/Cheater-iOS/Info.plist
```
Add:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture your homework.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to upload homework images.</string>
```

### Create Camera View
```
Cheater-iOS/Cheater-iOS/Views/Camera/CameraView.swift
```

### Create Capture Flow
```
Cheater-iOS/Cheater-iOS/ViewModels/CaptureFlowViewModel.swift
```

### Wire to List View
Update the + button in:
```
Cheater-iOS/Cheater-iOS/Views/Homework/HomeworkListView.swift
```

---

## 🧪 Testing Without API Key

You can test without a Claude API key:

```swift
// In CaptureFlowViewModel, use MockAIService instead:
let aiService = MockAIService() // Returns sample quiz immediately
```

This lets you test the full flow without API costs.

---

## 📚 Documentation

- [PROGRESS_REPORT.md](PROGRESS_REPORT.md) - Detailed status
- [WHATS_WORKING.md](WHATS_WORKING.md) - What works now
- [MVP_PROJECT_PLAN.md](MVP_PROJECT_PLAN.md) - Full project plan
- [README.md](README.md) - Setup instructions

---

## ✅ Pre-Flight Checklist

Before starting work:
- [ ] Xcode opens without errors
- [ ] App builds successfully (⌘B)
- [ ] App runs in simulator (⌘R)
- [ ] Can navigate through sample homework
- [ ] Can play and complete a quiz
- [ ] Results screen displays correctly

If all ✅, you're ready to add the camera!

---

## 🎬 Quick Demo Video Script

Record this to show progress:

1. "This is Homework Helper, an iOS app that turns homework into quizzes"
2. Show homework list
3. Tap a homework item
4. Show detail view with stats
5. Start a quiz
6. Answer a few questions
7. Show immediate feedback
8. Complete quiz and show results
9. "Next: Adding camera to capture real homework!"

---

## 💡 If You Get Stuck

### Build Errors
```bash
# Clean everything
⌘⇧K
rm -rf ~/Library/Developer/Xcode/DerivedData/Cheater-iOS-*
```

### Need to See Sample Data
Use the preview:
```swift
#Preview {
    HomeworkListView()
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}
```

### Camera Not Working in Simulator
- Camera requires real device
- Use PhotoPicker for simulator testing
- Or use mock image for testing

---

## 🔥 Quick Wins to Feel Good

Before diving into camera, try these 5-minute improvements:

1. **Change app title**
   - In Info.plist: Change `CFBundleDisplayName`

2. **Customize colors**
   - In DesignTokens.swift: Try different Color.appPrimary

3. **Add more sample data**
   - In Homework.swift: Add to sampleList

4. **Try different quiz questions**
   - In Question.swift: Edit sampleList

5. **Test dark mode**
   - Settings → Display → Dark

---

## 📞 Quick Reference

### Run Commands
- **Build:** ⌘B
- **Run:** ⌘R
- **Stop:** ⌘.
- **Clean:** ⌘⇧K

### Navigation
- Files: ⌘1
- Build Issues: ⌘9
- Console: ⌘⇧Y

### Testing
- Select device: Click device name in toolbar
- Run on device: Need developer account
- Debug: Set breakpoints, click line numbers

---

## 🎯 Success Criteria for Today

By end of day, you should have:
- [x] App runs with sample data (DONE)
- [ ] Camera captures homework image
- [ ] OCR extracts text
- [ ] AI generates quiz
- [ ] Can play generated quiz
- [ ] Full flow works end-to-end

---

## ⏱️ Time Estimates

- **Camera UI:** 30-45 min
- **Capture Flow:** 45-60 min
- **Testing & Polish:** 30-45 min
- **Total:** 2-3 hours

---

## 🎉 Celebration Checklist

When you complete the MVP:
- [ ] Record a demo video
- [ ] Take screenshots
- [ ] Try it on real device
- [ ] Show someone!
- [ ] Update PROGRESS_REPORT.md to 100%

---

**You've got this! The hard part is done. Now we just connect the pieces.** 💪

**Current Progress: 60% ✅**
**Today's Goal: 100% 🎯**
