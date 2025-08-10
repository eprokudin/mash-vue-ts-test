import type { MashResult } from '@/types'
import { 
  modeKeys, 
  generatePaperName, 
  generateIssueNo, 
  todayString, 
  generateHeadlines, 
  generateBody, 
  generateQuotes, 
  quoteLabels,
  sidebarBanners, 
  nextTeasers 
} from '@/lib/tabloid'
import { pickOne } from '@/utils/random'
import { TIMING } from '@/constants/gameConfig'

/**
 * Tabloid Service
 * Handles all tabloid result generation and data transformation.
 * Creates the dramatic tabloid content from game results and manages the reveal sequence.
 * Extracted from components for better separation of concerns and reusability.
 */
export class TabloidService {
  private data: MashResult

  constructor(data: MashResult) {
    this.data = data
  }

  /**
   * Generate all tabloid content in a structured format
   */
  getTabloidContent() {
    const keys = modeKeys(this.data.mode)
    
    // Extract individual values safely
    const picks = {
      home: this.safePick(keys.home),
      partner: this.safePick(keys.partner),
      job: this.safePick(keys.job),
      vehicle: this.safePick(keys.vehicle),
      hobby: this.safePick(keys.hobby),
      perk: this.safePick(keys.perk),
      twist: this.safePick(keys.twist),
      kids: this.safePick(keys.kids),
    }

    // Generate header content
    const header = {
      paperName: generatePaperName(),
      issueNo: generateIssueNo(),
      today: todayString(),
    }

    // Generate main content
    const headlines = generateHeadlines(picks.home, picks.partner, picks.job, picks.vehicle)
    const body = generateBody(picks)
    
    // Generate sidebar content
    const quotes = generateQuotes()
    const quoteLabelsArray = quoteLabels()
    const { shock, love, career } = sidebarBanners()
    
    // Generate footer
    const nextTeaser = pickOne(nextTeasers({
      partner: picks.partner,
      home: picks.home,
      job: picks.job,
      vehicle: picks.vehicle
    }))

    return {
      header,
      headlines,
      body,
      picks,
      sidebar: {
        quotes,
        quoteLabels: quoteLabelsArray,
        banners: { shock, love, career }
      },
      footer: {
        nextTeaser
      }
    }
  }

  /**
   * Get configuration for the reveal animation sequence
   */
  getRevealConfig() {
    const content = this.getTabloidContent()
    const totalSteps = 6 + content.sidebar.quotes.length
    
    return {
      totalSteps,
      stepDelay: TIMING.REVEAL_STEP_DELAY,
      steps: [
        { name: 'flash', index: 0 },
        { name: 'mainHeadline', index: 1 },
        { name: 'subHead', index: 2 },
        { name: 'body', index: 3 },
        { name: 'sidebar', index: 4 },
        ...content.sidebar.quotes.map((_, i) => ({ 
          name: `quote-${i}`, 
          index: 5 + i 
        })),
        { name: 'nextIssue', index: 5 + content.sidebar.quotes.length }
      ]
    }
  }

  /**
   * Safely extract a value from picks with fallback
   */
  private safePick(key: string | undefined | null): string {
    if (!key) return ''
    return this.data.picks[key] ?? ''
  }

  /**
   * Static method to create reveal animation controller
   */
  static createRevealController(
    totalSteps: number,
    onStep: (index: number) => void,
    onComplete: () => void
  ) {
    return {
      async start() {
        for (let i = 0; i < totalSteps; i++) {
          await new Promise(resolve => setTimeout(resolve, TIMING.REVEAL_STEP_DELAY))
          onStep(i)
        }
        onComplete()
      }
    }
  }


}
