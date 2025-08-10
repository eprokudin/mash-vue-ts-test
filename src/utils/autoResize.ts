/**
 * v-auto-resize
 * Vue directive that automatically adjusts textarea height to fit content.
 * Handles both initial sizing and real-time updates as the user types.
 * Includes safeguards for edge cases and smooth resizing behaviour.
 */
function resizeTextarea(el: HTMLTextAreaElement) {
  if (!(el instanceof HTMLTextAreaElement)) return
  
  // Store the current scroll position to maintain user experience
  const scrollTop = el.scrollTop
  
  // Reset height to get accurate scrollHeight
  el.style.height = 'auto'
  
  // Set new height with some padding and reasonable limits
  const newHeight = Math.min(Math.max(el.scrollHeight, 24), 200) // min 24px, max 200px
  el.style.height = `${newHeight}px`
  
  // Restore scroll position if needed
  if (scrollTop > 0) {
    el.scrollTop = scrollTop
  }
}

export const autoResizeDirective = {
  mounted(el: HTMLTextAreaElement) {
    resizeTextarea(el)
    
    // Also resize on input events for real-time adjustment
    el.addEventListener('input', () => resizeTextarea(el))
  },
  updated(el: HTMLTextAreaElement) {
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => resizeTextarea(el))
  },
  beforeUnmount(el: HTMLTextAreaElement) {
    // Clean up event listener
    el.removeEventListener('input', () => resizeTextarea(el))
  }
}


