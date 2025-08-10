<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseCard from './BaseCard.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const modalRef = ref<HTMLElement>()
const closeButtonRef = ref<HTMLButtonElement>()

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v),
})

// Enhanced keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault()
    e.stopPropagation()
    isOpen.value = false
  }
}

// Set up keyboard event listener on mount
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// Focus management when modal opens/closes
watch(isOpen, async (newVal) => {
  if (newVal) {
    await nextTick()
    // Focus the modal container for keyboard accessibility
    modalRef.value?.focus()
  }
})

// Clean up event listener
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

  <template>
      <div
    v-if="isOpen"
    ref="modalRef"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white/75 backdrop-blur-sm p-4 overflow-y-auto"
    @click.self="isOpen = false"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
        <BaseCard variant="glass" class="w-full max-w-2xl animate-in fade-in zoom-in duration-300 my-4 max-h-[calc(100vh-2rem)] flex flex-col">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
            <span class="text-lg">📖</span>
          </div>
          <h2 id="modal-title" class="text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">How to Play MASH</h2>
        </div>
        <BaseButton
          ref="closeButtonRef"
          size="sm"
          variant="secondary"
          @click="isOpen = false"
          aria-label="Close how to play modal"
          class="shadow-sm"
        >
          Close
        </BaseButton>
      </div>
      <!-- Scrollable Content Sections -->
      <div class="space-y-4 overflow-y-auto flex-1 min-h-0">
        <!-- Game Modes Section -->
        <div class="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">1</div>
            <h3 class="font-semibold text-neutral-900">🎮 Choose Your Game Mode</h3>
          </div>
          <!-- <div class="grid gap-2 sm:grid-cols-2 text-sm">
            <div class="p-2 bg-white/70 rounded border border-blue-200">
              <span class="font-medium text-blue-900">Classic MASH:</span> <span class="text-blue-700">Traditional categories</span>
            </div>
            <div class="p-2 bg-white/70 rounded border border-purple-200">
              <span class="font-medium text-purple-900">Modern MASH:</span> <span class="text-purple-700">Contemporary categories</span>
            </div>
          </div> -->
        </div>

        <!-- Customise Section -->
        <div class="p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">2</div>
            <h3 class="font-semibold text-neutral-900">✏️ Customise Your Options</h3>
          </div>
          <div class="text-sm text-emerald-700 space-y-1">
            <div>• <span class="font-medium">Edit:</span> Click any text field</div>
            <div>• <span class="font-medium">Add:</span> Use "+ Add option" button</div>
            <div>• <span class="font-medium">Remove:</span> Click trash icon (min 4 required)</div>
            <!-- <div>• <span class="font-medium">Auto-clean:</span> Text is sanitized automatically</div> -->
          </div>
        </div>

        <!-- Elimination Section -->
        <div class="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">3</div>
            <h3 class="font-semibold text-neutral-900">🎲 Run the Elimination</h3>
          </div>
          <div class="text-sm text-amber-700 space-y-1">
            <div>• Set count number using slider (3-10)</div>
            <div>• Click "🔮 Reveal My Fate" to start</div>
            <div>• Watch dramatic elimination animation & track progress with the progress bar</div>
          </div>
        </div>

        <!-- Results Section -->
        <div class="p-3 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">4</div>
            <h3 class="font-semibold text-neutral-900">📰 Your Tabloid Fortune</h3>
          </div>
          <div class="text-sm text-rose-700">
            Results appear as a tabloid with dynamic headlines, animated reveals, sidebar news, and next week's preview.
          </div>
        </div>

        <!-- Tip Section -->
        <div class="p-3 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-lg border border-dashed border-neutral-300">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-lg">💡</span>
            <div>
              <span class="font-medium text-neutral-800">Tip:</span>
              <span class="text-neutral-600">Use "🔁 New Game" to start over anytime!</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-500 hidden lg:block flex-shrink-0">
        Press <kbd class="rounded-lg bg-neutral-100 px-2 py-1 font-mono text-xs shadow-sm">Esc</kbd> to close this modal
      </div>
    </BaseCard>
  </div>
  
</template>

<style scoped>
kbd {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
