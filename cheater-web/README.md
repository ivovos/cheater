# Cheater Web - AI-Powered Homework Quiz Generator

Transform your homework into interactive quizzes using Claude AI Vision. Built with Next.js 15, Radix UI, Tailwind CSS, and Supabase.

## Features

- **Camera Capture**: Take photos of homework assignments
- **Smart Quiz Classification**: Auto-detects topic (Maths, English, Science, History)
- **Multi-Format Questions**: MCQ, fill-in-blank, and short-answer
- **Progress Tracking**: Best scores, completion rates, attempts
- **Adaptive Learning**: Special handling for different homework types
- **Consumer-Grade Design**: iOS-inspired with spring animations and generous spacing

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Components**: Radix UI primitives
- **Animation**: Framer Motion with spring physics
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude Vision API (Anthropic)

## Design System

### Colors
- **Primary**: `hsl(211, 100%, 50%)` - iOS Blue
- **Success**: `hsl(142, 71%, 45%)` - iOS Green
- **Error**: `hsl(4, 90%, 58%)` - iOS Red

### Typography (SF Pro style)
- **Large Title**: 34px, Bold
- **Title 1**: 28px, Regular
- **Headline**: 17px, Semibold
- **Body**: 17px, Regular

### Spacing (8px base scale)
- Tiny: 4px
- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px

### Animations
- **Spring**: `{ damping: 15, stiffness: 150 }`
- **Hover**: Scale 1.02, Y -4px
- **Tap**: Scale 0.97

## Project Structure

```
cheater-web/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                 # Base UI components (Button, Card, Dialog, etc.)
│   ├── HomeworkCard.tsx    # Homework list item
│   ├── QuestionView.tsx    # Quiz question display
│   ├── AnswerButton.tsx    # Quiz answer option
│   └── ThemeToggle.tsx     # Dark mode toggle
├── lib/                    # Utilities
│   ├── tokens.ts           # Design tokens (colors, spacing, typography)
│   ├── motion.ts           # Framer Motion presets
│   └── utils.ts            # Helper functions
├── services/               # Business logic
│   ├── supabase.ts         # Supabase client
│   ├── homeworkDB.ts       # Homework database operations
│   ├── quizDB.ts           # Quiz database operations
│   └── aiService.ts        # Claude Vision API integration
├── stores/                 # Zustand state management
│   ├── homeworkStore.ts    # Homework state
│   ├── quizStore.ts        # Quiz state
│   └── captureStore.ts     # Capture flow state
└── types/                  # TypeScript definitions
    ├── homework.ts         # Homework types
    ├── question.ts         # Question types
    ├── quiz.ts             # Quiz types
    └── claude.ts           # Claude API types
```

## Getting Started

### Prerequisites

- Node.js 18+ (with `fetch` support)
- npm or yarn
- Supabase account (free tier)
- Anthropic API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd cheater/cheater-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   # Anthropic Claude AI
   NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
   ```

4. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL migrations from `../Cheater-React/supabase/migrations/`
   - Enable anonymous authentication
   - Create a storage bucket named `homework-images`

5. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Database Setup

The app requires these Supabase tables:

- `homework` - Homework assignments
- `quiz` - Generated quizzes
- `quiz_attempts` - Quiz attempt history
- `progress` - Homework progress tracking

See `../Cheater-React/supabase/migrations/` for full schema.

## Usage

1. **Upload Homework**: Click "Get Started" and upload a photo
2. **Generate Quiz**: AI analyzes the image and creates 10 questions
3. **Take Quiz**: Answer questions with instant feedback
4. **Track Progress**: View scores and completion percentage
5. **Retry**: Take quizzes multiple times to improve

## API Cost

Average cost per quiz generation:
- **Input**: ~$0.006 (2,000 tokens for image)
- **Output**: ~$0.032 (2,100 tokens for questions)
- **Total**: ~$0.04 per quiz

## Development

### Available Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style

- Use TypeScript for type safety
- Follow React functional component patterns
- Use Tailwind for styling (no inline styles)
- Prefer Framer Motion for animations
- Use Zustand for state management
- Follow iOS design principles

### Adding New Components

1. Create component in `components/ui/` or `components/`
2. Use Radix UI primitives where available
3. Apply design tokens from `lib/tokens.ts`
4. Add Framer Motion animations from `lib/motion.ts`
5. Export from component file

Example:
```tsx
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { cardMotion } from '@/lib/motion'

export const MyComponent = ({ className }) => (
  <motion.div
    variants={cardMotion}
    initial="rest"
    whileHover="hover"
    whileTap="tap"
    className={cn('rounded-card bg-card shadow-card', className)}
  >
    Content
  </motion.div>
)
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

Compatible with any platform supporting Next.js 15:
- Netlify
- AWS Amplify
- Railway
- Render

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | Claude API key from Anthropic | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## Troubleshooting

### Build Errors

**Tailwind CSS v4 issues**: Ensure you're using `@tailwindcss/postcss` plugin:
```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**Image processing fails**: Ensure images are JPEG format and under 5MB.

**Supabase auth errors**: Enable anonymous authentication in Supabase dashboard.

### Runtime Errors

**API key errors**: Check `.env.local` has valid `NEXT_PUBLIC_ANTHROPIC_API_KEY`.

**Database errors**: Verify Supabase tables exist and RLS policies allow access.

**CORS errors**: Anthropic API requires valid API key in headers.

## Related Projects

- **Cheater iOS** (`../Cheater-iOS/`) - Original SwiftUI implementation
- **Cheater React Native** (`../Cheater-React/`) - Cross-platform mobile app

## Documentation

See `../docs/` for detailed documentation:
- [00-OVERVIEW.md](../docs/00-OVERVIEW.md) - Project vision and architecture
- [01-DATA-MODELS.md](../docs/01-DATA-MODELS.md) - Data structures
- [02-API-INTEGRATION.md](../docs/02-API-INTEGRATION.md) - Claude Vision API
- [03-PROMPTS-SYSTEM.md](../docs/03-PROMPTS-SYSTEM.md) - Prompt engineering
- [04-DESIGN-SYSTEM.md](../docs/04-DESIGN-SYSTEM.md) - Design tokens
- [05-UI-COMPONENTS.md](../docs/05-UI-COMPONENTS.md) - Component library
- [06-USER-FLOWS.md](../docs/06-USER-FLOWS.md) - User flows

## License

See LICENSE file.

## Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation
- Review Supabase logs for database errors
- Check browser console for client errors

---

**Built with Next.js, Radix UI, Tailwind CSS, and Claude AI**

Design System: iOS-inspired • Consumer-grade polish • 60fps animations
