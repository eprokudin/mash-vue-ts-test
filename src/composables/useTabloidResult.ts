import { onMounted, ref, computed } from 'vue'
import type { MashResult } from '@/types'
import { TabloidService } from '@/services/tabloidService'

/**
 * useTabloidResult
 * Vue composable for managing tabloid result display.
 * Handles data transformation and the dramatic reveal animation sequence.
 * Creates the suspenseful experience of content appearing step by step.
 */
export function useTabloidResult(data: MashResult) {
  const tabloidService = new TabloidService(data)
  const revealIndex = ref<number>(-1)
  const revealing = ref<boolean>(true)

  // Get all tabloid content
  const content = computed(() => tabloidService.getTabloidContent())
  
  // Get reveal configuration
  const revealConfig = computed(() => tabloidService.getRevealConfig())

  // Individual content accessors for template
  const header = computed(() => content.value.header)
  const headlines = computed(() => content.value.headlines)
  const body = computed(() => content.value.body)
  const picks = computed(() => content.value.picks)
  const sidebar = computed(() => content.value.sidebar)
  const footer = computed(() => content.value.footer)

  // Set up reveal animation
  onMounted(async () => {
    const controller = TabloidService.createRevealController(
      revealConfig.value.totalSteps,
      (index) => {
        revealIndex.value = index
      },
      () => {
        revealing.value = false
      }
    )
    
    await controller.start()
  })

  // Helper function to check if content should be revealed
  function shouldReveal(stepIndex: number): boolean {
    return revealIndex.value >= stepIndex
  }

  return {
    // Content
    header,
    headlines,
    body,
    picks,
    sidebar,
    footer,
    
    // Animation state
    revealIndex: () => revealIndex.value,
    revealing: () => revealing.value,
    
    // Helpers
    shouldReveal,
  }
}
