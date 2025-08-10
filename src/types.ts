/** Selected ruleset */
export type Mode = 'classic' | 'modern'

/** Option group in the game setup */
export type Category = {
  name: string
  options: string[]
}

/** Highlighted option coordinates during elimination */
export type Highlight = { ci: number; oi: number }

/** Final result emitted to the tabloid view */
export type MashResult = {
  mode: Mode
  picks: Record<string, string>
  number: number
}


