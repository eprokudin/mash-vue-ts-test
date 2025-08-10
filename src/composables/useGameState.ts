import { watch, onMounted, type Ref } from 'vue'
import type { Category, Mode, MashResult } from '@/types'
import { GameStateService } from '@/services/gameStateService'

/**
 * useGameState
 * Vue composable that provides game state management.
 * Acts as a bridge between Vue component reactivity and TypeScript business logic.
 * Handles the connection between the UI and the game engine.
 */
export function useGameState(
  categories: Ref<Category[]>,
  invalidReason: Ref<string | null>,
  mode: Mode
) {
  const gameState = new GameStateService(categories, invalidReason)

  // Watch for category changes and reinitialise engine
  watch(categories, () => {
    gameState.reinitialize()
  }, { deep: true })

  // Initialise on mount
  onMounted(() => {
    gameState.reinitialize()
  })

  // Helper function for handling count changes
  function updateCount(newCount: number) {
    gameState.setCount(newCount)
  }

  // Helper function for finishing the game
  function finishGame(): MashResult | null {
    return gameState.getResult(mode)
  }

  // Helper function for running elimination
  async function runElimination(): Promise<void> {
    await gameState.runElimination()
  }

  // Helper function for checking if setup is valid
  function isValidSetup(validate: () => boolean): boolean {
    return validate()
  }

  return {
    // Reactive state
    highlighted: () => gameState.highlighted,
    running: () => gameState.running,
    completed: () => gameState.completed,
    countNumber: () => gameState.countNumber,
    totalEliminations: () => gameState.totalEliminations,
    doneEliminations: () => gameState.doneEliminations,
    
    // Computed properties
    obscureOptions: gameState.obscureOptions,
    canStartElimination: gameState.canStartElimination,
    eliminationProgress: gameState.eliminationProgress,
    eliminationButtonText: gameState.eliminationButtonText,

    // Methods
    updateCount,
    runElimination,
    finishGame,
    isValidSetup,
    isEliminated: gameState.isEliminated.bind(gameState),
    remainingInCategory: gameState.remainingInCategory.bind(gameState),
  }
}
