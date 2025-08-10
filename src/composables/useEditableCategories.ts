import { ref } from 'vue'
import type { Category } from '@/types'
import { sanitizeAndFilter } from '@/utils/sanitize'

/**
 * useEditableCategories
 * Manages editable category and option state with validation and sanitisation.
 * Ensures each category has at least 4 options and handles input cleaning.
 * Provides a clean API for adding, removing, and updating options.
 */
export function useEditableCategories(initial: Category[]) {
  const categories = ref<Category[]>(JSON.parse(JSON.stringify(initial)) as Category[])
  const invalidReason = ref<string | null>(null)

  function sanitizeOption(text: string): string {
    const { text: clean } = sanitizeAndFilter(text)
    return clean
  }

  /** Add a new empty option to a category */
  function addOption(categoryIndex: number) {
    if (categoryIndex < 0 || categoryIndex >= categories.value.length) {
      console.warn('Invalid category index:', categoryIndex)
      return
    }
    categories.value[categoryIndex].options.push('')
    validate()
  }

  /** Remove an option if more than 4 remain in the category */
  function removeOption(categoryIndex: number, optionIndex: number) {
    if (categoryIndex < 0 || categoryIndex >= categories.value.length) {
      console.warn('Invalid category index:', categoryIndex)
      return
    }
    
    const list = categories.value[categoryIndex].options
    if (list.length <= 4) return
    
    if (optionIndex < 0 || optionIndex >= list.length) {
      console.warn('Invalid option index:', optionIndex)
      return
    }
    
    list.splice(optionIndex, 1)
    validate()
  }

  /** Sanitise and update an option's text value */
  function updateOption(categoryIndex: number, optionIndex: number, value: string) {
    if (categoryIndex < 0 || categoryIndex >= categories.value.length) {
      console.warn('Invalid category index:', categoryIndex)
      return
    }
    
    const category = categories.value[categoryIndex]
    if (optionIndex < 0 || optionIndex >= category.options.length) {
      console.warn('Invalid option index:', optionIndex)
      return
    }
    
    category.options[optionIndex] = sanitizeOption(value)
    validate()
  }

  /** Validate all categories and set a user-friendly error message if needed */
  function validate(): boolean {
    // First check for any empty options
    for (const c of categories.value) {
      for (let i = 0; i < c.options.length; i++) {
        const trimmed = sanitizeOption(c.options[i])
        if (trimmed.length === 0) {
          invalidReason.value = `All options must have text. Please fill in or remove the empty option in "${c.name}".`
          return false
        }
      }
    }
    
    // Then check minimum count requirement
    for (const c of categories.value) {
      const trimmed = c.options.map((o) => sanitizeOption(o)).filter((o) => o.length > 0)
      if (trimmed.length < 4) {
        invalidReason.value = `Each category must have at least 4 options ("${c.name}" has ${trimmed.length}).`
        return false
      }
    }
    invalidReason.value = null
    return true
  }

  return {
    categories,
    invalidReason,
    addOption,
    removeOption,
    updateOption,
    validate,
  }
}


