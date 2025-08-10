/**
 * Game Configuration Constants
 * Centralised configuration for game rules, timing, and UI limits.
 * All the magic numbers and timing values that make the game tick.
 */

export const GAME_RULES = {
  MIN_OPTIONS_PER_CATEGORY: 4,
  MIN_COUNT: 3,
  MAX_COUNT: 10,
  DEFAULT_COUNT: 5,
} as const

export const TIMING = {
  ELIMINATION_DELAY: 140,
  REVEAL_STEP_DELAY: 650,
  TRANSITION_DURATION: 350,
} as const

export const TEXT_LIMITS = {
  MAX_OPTION_LENGTH: 200,
  WORD_BOUNDARY_THRESHOLD: 20,
} as const

export const UI_CONFIG = {
  TEXTAREA_MIN_HEIGHT: 24,
  TEXTAREA_MAX_HEIGHT: 200,
  PROGRESS_UPDATE_INTERVAL: 100,
} as const

export const BUTTON_TEXT = {
  ELIMINATION: {
    READY: '🔮 Reveal My Fate',
    RUNNING: '⏳ Consulting the stars…',
    COMPLETED: '✨ Fate Revealed',
  },
  RESULTS: {
    DEFAULT: '📰 View Results',
    PREPARING: '⏳ Preparing…',
    READY: '📰 View Results',
  }
} as const
