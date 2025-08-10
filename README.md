# MASH Game (Vue 3 + TypeScript + Tailwind + Vite)

A delightful web implementation of the classic children's game "MASH", built with Vue 3 (Composition API), TypeScript, Tailwind CSS, and Vite.

The app features both classic and modern game modes, interactive option editing, a suspenseful elimination sequence, and a cheeky tabloid-style results page that'll have you laughing at your "destined" future.

## Quick Start

### Prerequisites
- Node 20 (recommended via nvm)
- npm 9+

### Setup
```bash
# Switch to Node 20
nvm use 20

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack
- **Vue 3** + Composition API (TypeScript)
- **Tailwind CSS** (v4 via `@tailwindcss/postcss` plugin)
- **Vite** (with `@` alias pointing to `src`)

## Project Structure
```
src/
  App.vue                         # Main app shell: game stages, header, modals
  main.ts                         # Application entry point
  style.css                       # Tailwind CSS entry
  types.ts                        # Shared TypeScript types
  shims-vue.d.ts                  # Vue module shim for TypeScript

  components/
    BaseButton.vue                # Reusable button component
    BaseCard.vue                  # Reusable card component
    HomeIntro.vue                 # Landing page: intro + mode selection
    MashGame.vue                  # Main game: editing + elimination
    TabloidResult.vue             # Final results (tabloid format)
    HowToPlayModal.vue            # "How to play" modal
    NewGameConfirmModal.vue       # New game confirmation modal
    RevealConfirmModal.vue        # Elimination confirmation modal

  services/
    gameStateService.ts           # Game state management
    tabloidService.ts             # Tabloid generation logic

  composables/
    useEditableCategories.ts      # Category editing, validation, sanitisation
    useGameState.ts               # Game state composable
    useTabloidResult.ts           # Tabloid result composable

  constants/
    gameConfig.ts                 # Game rules, timing, UI configuration

  data/
    mashPresets.ts                # Classic + modern category presets

  lib/
    mashEngine.ts                 # Core elimination engine
    tabloid.ts                    # Tabloid text generators

  utils/
    autoResize.ts                 # v-auto-resize textarea directive
    sanitize.ts                   # Input sanitisation + profanity masking
    random.ts                     # Random utilities
```

## How It Works

### App Flow & Navigation
- **Home page** with a friendly introduction and two game modes: Classic and Modern
- **Global "How to play" modal** available throughout the app
- **"New Game" button** with confirmation modal to reset the flow
- **Responsive design** with mobile-optimised layouts

### Game Modes
- **Classic MASH**: Life Partner, Kids, Job, Salary, Car, Where You Live
- **Modern MASH**: Housing, Partner, Job, Vehicle, Hobby, Life Perk, Twist Ending

### Category Editing
- **Edit options in place** using auto-resizing textareas
- **Add new options** (no upper limit)
- **Remove options** (blocked when exactly 4 remain in a category)
- **Real-time validation** ensures each category has ≥ 4 non-empty options
- **Input sanitisation** and profanity masking in real time

### Elimination Experience
- **Choose elimination count** with a slider (3–10)
- **One-click auto elimination** ("🔮 Reveal My Fate")
- **Suspenseful highlighting** with configurable delays
- **Smart elimination logic** - only eliminates from categories with > 1 remaining option
- **Progress tracking** with a full-width progress bar
- **State-aware UI** - buttons adapt during elimination, "View Results" appears when complete
- **Clear final results** - chosen options highlighted in emerald styling

### Final Results (Tabloid Front Page)
- **Dynamic tabloid header** with paper name, issue number, and current date
- **Sequential reveal animation**: flash → main headline → subhead → body → sidebar items
- **Generated content** from actual game picks (mode-aware)
- **Rich sidebar content**:
  - "Exclusive" banner
  - Three themed mini-panels: "Shock Life Update", "Love & Scandal", "Career Chaos"
  - Five randomised quotes from a larger pool
- **Footer teaser** with "Next Issue" headlines

## Key TypeScript Logic

### Core Services
- **`services/gameStateService.ts`**
  - Manages complete game state and business logic
  - Handles elimination progress, button states, and result generation
  - Extracted from components for better separation of concerns

- **`services/tabloidService.ts`**
  - Generates tabloid content from game results
  - Manages reveal sequence timing and content structure
  - Handles dynamic content generation

### Game Engine
- **`lib/mashEngine.ts`**
  - Suspenseful circular pointer algorithm respecting the selected count
  - Eliminates across categories but only from those with > 1 option left
  - Emits highlight and elimination callbacks for UI updates
  - Exposes `runAuto`, `step`, `outcome`, `setCount`, `isEliminated`, `remainingCount`

### Composables
- **`composables/useEditableCategories.ts`**
  - State management for categories/options: add, remove, update, validate
  - Sanitises all edits and enforces ≥ 4 options per category
  - Provides real-time validation feedback

- **`composables/useGameState.ts`**
  - Vue composable wrapper for GameStateService
  - Provides reactive access to game state

- **`composables/useTabloidResult.ts`**
  - Vue composable wrapper for TabloidService
  - Manages tabloid reveal sequence

### Utilities
- **`utils/sanitize.ts`**
  - `sanitizeText`: strips HTML tags, normalises whitespace, caps length
  - `maskProfanity`: masks whole-word profanities with asterisks
  - `sanitizeAndFilter`: convenience wrapper combining both functions

- **`utils/random.ts`**
  - `randomInt`, `sample`, `pickOne`, `shuffle` - pure utility functions

- **`utils/autoResize.ts`**
  - `v-auto-resize` directive for auto-fitting textareas to content

### Content Generation
- **`lib/tabloid.ts`**
  - `modeKeys`: category key mapping per mode (classic/modern)
  - `generatePaperName`, `generateIssueNo`, `todayString`
  - `generateHeadlines`: flash/main/sub headlines from picks
  - `generateBody`: witty body paragraph from picks
  - `generateQuotes`, `quoteLabels`: 5 quotes + randomised labels
  - `sidebarBanners`: random "Shock/Love/Career" mini-panels
  - `nextTeasers`: options for the footer teaser

## Styling & UI
- **Tailwind CSS only** - utility classes in components
- **Tailwind v4 compatible** `postcss.config.js` using `@tailwindcss/postcss`
- **Minimal custom CSS** (transitions and UI polish)
- **Responsive design** with mobile-first approach
- **Accessibility features** including keyboard navigation and ARIA attributes

## Configuration
- **Vite alias** `@` → `src` (`vite.config.ts`)
- **Strict TypeScript** with helpful flags (`tsconfig.app.json`)
- **Centralised constants** in `constants/gameConfig.ts`
- **All gameplay logic** lives in TypeScript modules for clarity and reusability

## Customisation
- **Update category presets** in `src/data/mashPresets.ts`
- **Adjust elimination timing** by changing `delayMs` in `constants/gameConfig.ts`
- **Modify UI labels/styles** by editing the Vue components
- **Add new game modes** by extending the category presets

## Accessibility & UX Considerations
- **Clear disabled states** during elimination to prevent accidental edits
- **High-contrast highlighting** for eliminated vs. chosen options
- **Progress indicators** for long-running operations
- **Brief animations** that avoid excessive motion
- **Keyboard navigation** support throughout the app
- **Mobile-optimised** layouts and interactions

## Future Enhancements (Ideas)
- **Add comprehensive tests** for `mashEngine` and `tabloid` helpers
- **Local storage persistence** for user's custom options per mode
- **Shareable result URLs** for social sharing
- **Sound effects toggle** during elimination sequence
- **Additional game modes** with different category sets
- **Export results** as images for social media

## Development Notes
This project demonstrates modern Vue 3 + TypeScript patterns with a focus on:
- **Separation of concerns** - business logic in TypeScript services
- **Reusable components** - BaseButton, BaseCard, and modal components
- **Composables pattern** - for state management and logic reuse
- **Type safety** - comprehensive TypeScript usage throughout
- **Performance** - efficient reactivity and minimal re-renders

## License
This project is provided for technical interview purposes. No license granted for commercial use.
