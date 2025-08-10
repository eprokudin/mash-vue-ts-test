import { computed, ref, type Ref } from 'vue'
import type { Category, Mode, Highlight, MashResult } from '@/types'
import { MashGameEngine } from '@/lib/mashEngine'
import { GAME_RULES, TIMING, BUTTON_TEXT } from '@/constants/gameConfig'

/**
 * Game State Service
 * Manages the complete game state and business logic for the MASH game.
 * Handles everything from elimination progress to button states and result generation.
 * Extracted from components for better separation of concerns and testability.
 */
export class GameStateService {
  // Core reactive state
  private _engine = ref<MashGameEngine | null>(null)
  private _highlighted = ref<Highlight | null>(null)
  private _running = ref<boolean>(false)
  private _completed = ref<boolean>(false)
  private _countNumber = ref<number>(GAME_RULES.DEFAULT_COUNT)
  
  // Progress tracking for the elimination sequence
  private _totalEliminations = ref<number>(0)
  private _doneEliminations = ref<number>(0)

  // References to external state managed by composables
  private categories: Ref<Category[]>
  private invalidReason: Ref<string | null>

  constructor(
    categories: Ref<Category[]>,
    invalidReason: Ref<string | null>
  ) {
    this.categories = categories
    this.invalidReason = invalidReason
    this.initializeEngine()
  }

  // Getters for reactive state - these provide read-only access to internal refs
  get engine() { return this._engine.value }
  get highlighted() { return this._highlighted.value }
  get running() { return this._running.value }
  get completed() { return this._completed.value }
  get countNumber() { return this._countNumber.value }
  get totalEliminations() { return this._totalEliminations.value }
  get doneEliminations() { return this._doneEliminations.value }

  // Computed properties for derived state
  readonly obscureOptions = computed(() => this._running.value || this._completed.value)
  
  readonly canStartElimination = computed(() => 
    !this._running.value && !this._completed.value && !this.invalidReason.value
  )

  readonly eliminationProgress = computed(() => 
    Math.min(100, Math.round((this._doneEliminations.value / Math.max(1, this._totalEliminations.value)) * 100))
  )

  readonly eliminationButtonText = computed(() => {
    if (this._running.value) return BUTTON_TEXT.ELIMINATION.RUNNING
    if (this._completed.value) return BUTTON_TEXT.ELIMINATION.COMPLETED
    return BUTTON_TEXT.ELIMINATION.READY
  })

  // Business logic methods
  private initializeEngine(): void {
    this._engine.value = new MashGameEngine({ 
      categories: this.categories.value, 
      count: this._countNumber.value, 
      delayMs: TIMING.ELIMINATION_DELAY 
    })
    this._highlighted.value = null
    this._completed.value = false
    this.calculateTotalEliminations()
    this._doneEliminations.value = 0
  }

  private calculateTotalEliminations(): void {
    this._totalEliminations.value = this.categories.value.reduce(
      (acc, c) => acc + Math.max(0, c.options.length - 1), 
      0
    )
  }

  setCount(count: number): void {
    const clampedCount = Math.max(GAME_RULES.MIN_COUNT, Math.min(GAME_RULES.MAX_COUNT, Math.floor(count)))
    this._countNumber.value = clampedCount
    this._engine.value?.setCount(clampedCount)
  }

  reinitialize(): void {
    this.initializeEngine()
  }

  isEliminated(catName: string, oi: number): boolean {
    return this._engine.value?.isEliminated(catName, oi) ?? false
  }

  remainingInCategory(catName: string): number {
    return this._engine.value?.remainingCount(catName) ?? 0
  }



  async runElimination(): Promise<void> {
    if (!this._engine.value) return
    
    this._running.value = true
    await this._engine.value.runAuto(
      (h: Highlight) => {
        this._highlighted.value = h
      },
      () => {
        this._doneEliminations.value++
      }
    )
    this._running.value = false
    this._completed.value = true
  }

  getResult(mode: Mode): MashResult | null {
    if (!this._engine.value) return null
    
    const outcome = this._engine.value.outcome().picks
    return {
      mode,
      picks: outcome,
      number: this._countNumber.value,
    }
  }
}
