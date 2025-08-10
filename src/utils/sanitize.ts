// Basic text sanitisation and profanity masking for client-side use

const PROFANITY_LIST = [
  // Keep this list short and general; mask rather than reject
  'fuck', 'shit', 'bitch', 'bastard', 'asshole', 'dick', 'cunt', 'bollocks', 'twat',
  'wank', 'prick', 'slut', 'whore'
]

/** Strip HTML tags, risky patterns and normalise whitespace; hard cap length */
export function sanitizeText(input: string, maxLength: number = 200): string {
  if (!input) return ''
  let s = String(input)
  // Remove HTML tags
  s = s.replace(/<[^>]*>/g, '')
  // Remove script-like patterns
  s = s.replace(/javascript:\s*/gi, '')
  // Remove excessive line breaks
  s = s.replace(/\n{3,}/g, '\n\n')
  // Normalise whitespace but preserve line breaks
  s = s.replace(/[ \t]+/g, ' ').trim()
  // Limit length gracefully - try to break at word boundaries
  if (s.length > maxLength) {
    const truncated = s.slice(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    // If we find a space within the last 20 characters, break there
    if (lastSpace > maxLength - 20) {
      s = truncated.slice(0, lastSpace)
    } else {
      s = truncated
    }
  }
  return s
}

/** Replace whole-word profanities with asterisks; return whether any were masked */
export function maskProfanity(input: string): { text: string; hadProfanity: boolean } {
  if (!input) return { text: '', hadProfanity: false }
  let text = input
  let had = false
  for (const word of PROFANITY_LIST) {
    const re = new RegExp(`\\b${word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi')
    if (re.test(text)) {
      had = true
      text = text.replace(re, (m) => '*'.repeat(Math.max(3, m.length)))
    }
  }
  return { text, hadProfanity: had }
}

/** Convenience function: sanitise then mask profanity */
export function sanitizeAndFilter(input: string): { text: string; hadProfanity: boolean } {
  const sanitised = sanitizeText(input)
  return maskProfanity(sanitised)
}
