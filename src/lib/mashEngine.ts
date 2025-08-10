import type { Category } from '@/types'

export type GameConfig = {
  categories: Category[]
  count: number
  delayMs?: number
}

export type Highlight = { ci: number; oi: number }

export type GameOutcome = {
  picks: Record<string, string>
}

/**
 * MashGameEngine
 * Drives the MASH elimination process with a circular pointer and suspenseful stepping.
 * Only eliminates from categories that still have more than 1 remaining option.
 * Exposes highlight callbacks for UI updates and eliminate callbacks for progress tracking.
 */
export class MashGameEngine {
  private categories: Category[]
  private count: number
  private delayMs: number
  private pointerIndex: number
  private eliminated: Map<string, Set<number>>
  private stopRequested: boolean

  constructor(config: GameConfig) {
    this.categories = config.categories
    this.count = Math.max(3, Math.min(10, Math.floor(config.count)))
    this.delayMs = config.delayMs ?? 140
    this.pointerIndex = 0
    this.eliminated = new Map(
      this.categories.map((c) => [c.name, new Set<number>()])
    )
    this.stopRequested = false
  }

  /** Reset transient state; optionally set a new count */
  public reset(count?: number) {
    this.count = count ? Math.max(3, Math.min(10, Math.floor(count))) : this.count
    this.pointerIndex = 0
    this.eliminated.forEach((s) => s.clear())
    this.stopRequested = false
  }

  /** Update elimination count (clamped between 3 and 10) */
  public setCount(count: number) {
    this.count = Math.max(3, Math.min(10, Math.floor(count)))
  }

  /** Check if a given option has been eliminated */
  public isEliminated(categoryName: string, optionIndex: number): boolean {
    return this.eliminated.get(categoryName)?.has(optionIndex) ?? false
  }

  /** Get the number of remaining options in a category */
  public remainingCount(categoryName: string): number {
    const cat = this.categories.find((c) => c.name === categoryName)
    if (!cat) return 0
    return cat.options.length - (this.eliminated.get(categoryName)?.size ?? 0)
  }

  /** Check if every category is down to one option (game complete) */
  public isResolved(): boolean {
    return this.categories.every((c) => this.remainingCount(c.name) === 1)
  }

  /** Get a flat list of all remaining options across categories that still need elimination */
  private flatAlive(): Array<{ ci: number; oi: number; name: string }> {
    const flat: Array<{ ci: number; oi: number; name: string }> = []
    this.categories.forEach((c, ci) => {
      // Only include options from categories that still have more than one remaining
      if (this.remainingCount(c.name) > 1) {
        c.options.forEach((_, oi) => {
          if (!this.isEliminated(c.name, oi)) flat.push({ ci, oi, name: c.name })
        })
      }
    })
    return flat
  }

  private async sleep(ms: number) {
    await new Promise((r) => setTimeout(r, ms))
  }

  /** Perform a single suspenseful elimination step */
  public async step(onHighlight?: (h: Highlight) => void, onEliminate?: (payload: { name: string; index: number }) => void): Promise<void> {
    if (this.isResolved()) return
    const flat = this.flatAlive()
    if (flat.length === 0) return

    // Highlight across count steps to build suspense
    for (let s = 0; s < this.count; s++) {
      if (this.stopRequested) return
      this.pointerIndex = (this.pointerIndex + 1) % flat.length
      onHighlight?.({ ci: flat[this.pointerIndex].ci, oi: flat[this.pointerIndex].oi })
      await this.sleep(this.delayMs)
      if (this.stopRequested) return
    }

    const chosen = flat[this.pointerIndex]
    // Do not eliminate if category is already resolved
    if (this.remainingCount(chosen.name) > 1) {
      this.eliminated.get(chosen.name)?.add(chosen.oi)
      onEliminate?.({ name: chosen.name, index: chosen.oi })
    }

    // Move pointer forward respecting new length
    const newLen = this.flatAlive().length
    if (newLen > 0) {
      this.pointerIndex = this.pointerIndex % newLen
    } else {
      this.pointerIndex = 0
    }
  }

  /**
   * Run continuously until resolved or canceled.
   * Emits highlight and eliminate callbacks for UI feedback.
   */
  public async runAuto(onHighlight?: (h: Highlight) => void, onEliminate?: (payload: { name: string; index: number }) => void): Promise<void> {
    while (!this.isResolved() && !this.stopRequested) {
      await this.step(onHighlight, onEliminate)
    }
  }

  /** Stop an in-progress run */
  public cancel() {
    this.stopRequested = true
  }

  /** Compute final surviving option per category */
  public outcome(): GameOutcome {
    const result: Record<string, string> = {}
    this.categories.forEach((c) => {
      const remainingIdx = c.options.findIndex((_, i) => !this.isEliminated(c.name, i))
      result[c.name] = c.options[Math.max(0, remainingIdx)]
    })
    return { picks: result }
  }
}


