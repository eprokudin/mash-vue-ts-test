<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseCard from './BaseCard.vue'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const modalRef = ref<HTMLDivElement>()
const confirmButtonRef = ref<InstanceType<typeof BaseButton>>()

const isOpen = ref(props.open)

// Watch for prop changes
watch(() => props.open, (newVal) => {
  isOpen.value = newVal
})

// Watch for local changes and emit
watch(isOpen, (newVal) => {
  emit('update:open', newVal)
  if (newVal) {
    // Focus the modal when opened
    setTimeout(() => {
      modalRef.value?.focus()
    }, 100)
  }
})

function handleConfirm() {
  emit('confirm')
  isOpen.value = false
}

function handleCancel() {
  emit('cancel')
  isOpen.value = false
}

function handleKeydown(e: KeyboardEvent) {
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

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

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
    aria-labelledby="reveal-modal-title"
    aria-describedby="reveal-modal-description"
  >
    <BaseCard variant="glass" class="w-full max-w-lg animate-in fade-in zoom-in duration-300 my-4 max-h-[calc(100vh-2rem)]">
      <!-- Header -->
      <div class="mb-6 flex items-center gap-3">
        <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
          <span class="text-lg">🔮</span>
        </div>
        <h3 id="reveal-modal-title" class="text-xl font-bold text-neutral-800">
          Ready to Reveal Your Fate?
        </h3>
      </div>

      <!-- Content -->
      <div class="mb-6 space-y-4">
        <div class="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <p id="reveal-modal-description" class="text-sm text-purple-800 font-medium mb-3">
            Before we begin the mystical elimination process, please confirm:
          </p>
          <div class="space-y-2 text-sm text-purple-700">
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              <span>You've set your preferred elimination count</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              <span>You've customised your options as desired</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              <span>All empty options have been filled or removed</span>
            </div>
          </div>
        </div>

        <div class="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p class="text-xs text-amber-800 text-center">
            ⚠️ Once the elimination begins, you won't be able to make changes
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <BaseButton
          variant="secondary"
          class="flex-1 shadow-sm"
          @click="handleCancel"
        >
          Make Changes
        </BaseButton>
        <BaseButton
          ref="confirmButtonRef"
          variant="primary"
          class="flex-1 shadow-sm"
          @click="handleConfirm"
        >
          🔮 Reveal My Fate!
        </BaseButton>
      </div>

      <p class="mt-4 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-500 hidden lg:block">
        Press <kbd class="rounded-lg bg-neutral-100 px-2 py-1 font-mono text-xs shadow-sm">Esc</kbd> to go back or
        <kbd class="rounded-lg bg-neutral-100 px-2 py-1 font-mono text-xs shadow-sm">Enter</kbd> to confirm
      </p>
    </BaseCard>
  </div>
</template>
