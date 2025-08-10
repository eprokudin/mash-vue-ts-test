<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseCard from './BaseCard.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const modalRef = ref<HTMLElement>()
const confirmButtonRef = ref<HTMLButtonElement>()

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v),
})

// Enhanced keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return
  
  if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    handleCancel()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    e.stopPropagation()
    handleConfirm()
  }
}

function handleConfirm() {
  emit('confirm')
  isOpen.value = false
}

function handleCancel() {
  emit('cancel')
  isOpen.value = false
}

// Set up keyboard event listener on mount
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// Focus management when modal opens/closes
watch(isOpen, async (newVal) => {
  if (newVal) {
    await nextTick()
    // Focus the confirm button as it's the primary action
    confirmButtonRef.value?.focus()
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
    @click.self="handleCancel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-modal-title"
    aria-describedby="confirm-modal-description"
  >
    <BaseCard variant="glass" class="w-full max-w-lg animate-in fade-in zoom-in duration-300 my-4 max-h-[calc(100vh-2rem)]">
      <!-- Header -->
      <div class="mb-6 flex items-center gap-3">
        <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
          <span class="text-lg">⚠️</span>
        </div>
        <h3 id="confirm-modal-title" class="text-xl font-bold text-neutral-800">
          Start New Game?
        </h3>
      </div>
      
      <!-- Content -->
      <div class="mb-8 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <p id="confirm-modal-description" class="text-sm text-amber-800 font-medium">
          Are you sure you want to start a new game? All current progress will be lost.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <BaseButton 
          variant="secondary" 
          class="flex-1 shadow-sm"
          @click="handleCancel"
        >
          No, Go Back
        </BaseButton>
        <BaseButton 
          ref="confirmButtonRef"
          variant="danger" 
          class="flex-1 shadow-sm"
          @click="handleConfirm"
        >
          Yes, Start New Game
        </BaseButton>
      </div>

      <p class="mt-4 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-500 hidden lg:block">
        Press <kbd class="rounded-lg bg-neutral-100 px-2 py-1 font-mono text-xs shadow-sm">Esc</kbd> to cancel or 
        <kbd class="rounded-lg bg-neutral-100 px-2 py-1 font-mono text-xs shadow-sm">Enter</kbd> to confirm
      </p>
    </BaseCard>
  </div>
</template>

<style scoped>
kbd {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
