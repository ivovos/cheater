# Configuration Files

This folder contains configuration files for the app.

## Prompts.json

**Centralized AI Prompt Management**

All Claude AI prompts are defined in `Prompts.json` for easy editing and version control.

### Structure

```json
{
  "version": "1.0.0",
  "prompts": {
    "vision": {
      "system": "System prompt (AI role/behavior)",
      "user": {
        "prefix": "Intro text with {subjectHint} placeholder",
        "instructions": ["List of instructions"],
        "requirements": ["List of requirements"],
        "format": {
          "description": "Format description",
          "example": { /* JSON example */ }
        },
        "suffix": "Closing instructions"
      }
    },
    "text": { /* Similar structure */ }
  },
  "settings": {
    "questionCount": 10,
    "optionCount": 4,
    "minExplanationLength": 1,
    "maxExplanationLength": 2
  }
}
```

### How to Edit Prompts

1. **Open `Prompts.json` in any text editor**
2. **Edit the text** you want to change:
   - `system`: The AI's role (e.g., "You are an educational quiz generator...")
   - `prefix`: Opening instruction
   - `instructions`: List of reading/analysis instructions
   - `requirements`: List of quiz requirements
   - `suffix`: Final reminder about format

3. **Use placeholders**:
   - `{subjectHint}` - Will be replaced with subject info (e.g., " about Mathematics")

4. **Save the file** - Changes take effect on next app launch

### Example: Changing Question Count

```json
{
  "settings": {
    "questionCount": 5,  // Change from 10 to 5 questions
    ...
  }
}
```

Then update the requirements text:
```json
"requirements": [
  "Exactly 5 questions",  // Changed from 10
  ...
]
```

### Example: Making Questions Harder

```json
{
  "requirements": [
    "Exactly 10 questions",
    "Each question has exactly 4 options (labeled A, B, C, D)",
    "One correct answer per question",
    "Questions test deep understanding and application",  // Changed!
    "Advanced difficulty for high-performing secondary school students",  // Changed!
    ...
  ]
}
```

### Best Practices

- ✅ **Do** version control prompt changes
- ✅ **Do** test prompts after editing
- ✅ **Do** keep backups of working prompts
- ✅ **Do** document why you made changes (in git commit)
- ❌ **Don't** change the JSON structure (only the text values)
- ❌ **Don't** remove the `format.example` (AI needs it)

### Testing Changes

After editing prompts:
1. Clean build (⌘⇧K)
2. Build and run (⌘R)
3. Capture a test homework image
4. Verify quiz questions match your new prompt

## Config.plist

**API Key Storage** (gitignored)

Contains your Anthropic API key. Never commit this file!

```xml
<key>ANTHROPIC_API_KEY</key>
<string>sk-ant-api03-...</string>
```

### Setup

1. Copy `Config.example.plist` to `Config.plist`
2. Add your API key from https://console.anthropic.com
3. File is automatically gitignored

---

**Questions?** Check the main README or ask in discussions.
