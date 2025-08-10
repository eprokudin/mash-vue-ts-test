<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import MashGame from './components/MashGame.vue'
import TabloidResult from './components/TabloidResult.vue'
import HomeIntro from './components/HomeIntro.vue'
import HowToPlayModal from './components/HowToPlayModal.vue'
import NewGameConfirmModal from './components/NewGameConfirmModal.vue'
import BaseButton from './components/BaseButton.vue'
import type { Mode, MashResult } from '@/types'

// App-level flow state: selected mode, final result, and modal visibility
const mode = ref<Mode | null>(null)
const result = ref<MashResult | null>(null)
const showHow = ref(false)
const showNewGameConfirm = ref(false)

function startSelected(selected: Mode) {
  mode.value = selected
  result.value = null
}

function onFinished(payload: MashResult) {
  result.value = payload
}

function requestNewGame() {
  showNewGameConfirm.value = true
}

function confirmNewGame() {
  mode.value = null
  result.value = null
  showNewGameConfirm.value = false
}

function cancelNewGame() {
  showNewGameConfirm.value = false
}

// Scroll to top when mode changes (for mobile navigation)
watch(mode, async (newMode) => {
  if (newMode) {
    // Wait for the next tick to ensure the new component is rendered
    await nextTick()
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

// Scroll to top when result changes (for mobile navigation)
watch(result, async (newResult) => {
  if (newResult) {
    // Wait for the next tick to ensure the new component is rendered
    await nextTick()
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 text-neutral-900">
    <div class="mx-auto max-w-5xl p-6">
      <header class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
            <span class="text-lg">🔮</span>
          </div>
          <h1 class="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            MASH
          </h1>
        </div>
        <!-- Header-right: homepage shows How to play; non-home shows sm+; tabloid hides How to play -->
        <div class="items-center gap-3" :class="(mode || result) ? 'hidden sm:flex' : 'flex'">
          <template v-if="!mode && !result">
            <BaseButton @click="showHow = true" variant="secondary" class="shadow-sm">
              📖 How to play
            </BaseButton>
          </template>
          <template v-else>
            <template v-if="mode && !result">
              <BaseButton @click="showHow = true" variant="secondary" class="shadow-sm">
                📖 How to play
              </BaseButton>
              <BaseButton @click="requestNewGame" variant="primary" class="shadow-sm">
                🔁 New Game
              </BaseButton>
            </template>
            <template v-else>
              <!-- Tabloid (result): hide How to play; keep New Game on desktop -->
              <BaseButton @click="requestNewGame" variant="primary" class="shadow-sm">
                🔁 New Game
              </BaseButton>
            </template>
          </template>
        </div>
        <!-- Tabloid mobile: show New Game inline in header on mobile only -->
        <div v-if="result" class="sm:hidden">
          <BaseButton @click="requestNewGame" variant="primary" class="shadow-sm">
            🔁 New Game
          </BaseButton>
        </div>
      </header>

      <!-- Game (non-home) mobile buttons row: full-width, two halves with gap, mobile only -->
      <div v-if="mode && !result" class="sm:hidden grid grid-cols-2 gap-3 mb-6">
        <BaseButton @click="showHow = true" variant="secondary" class="w-full shadow-sm">
          📖 How to play
        </BaseButton>
        <BaseButton @click="requestNewGame" variant="primary" class="w-full shadow-sm">
          🔁 New Game
        </BaseButton>
      </div>

      <main>
        <HomeIntro v-if="!mode && !result" @start="startSelected" @openHow="showHow = true" />
        <MashGame v-else-if="mode && !result" :mode="mode!" @finished="onFinished" />
        <TabloidResult v-else :data="result!" @restart="requestNewGame" />
      </main>
      <HowToPlayModal v-model:open="showHow" />
      <NewGameConfirmModal 
        v-model:open="showNewGameConfirm" 
        @confirm="confirmNewGame"
        @cancel="cancelNewGame"
      />
    </div>
  </div>
</template>

<style scoped></style>
