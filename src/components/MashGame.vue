<script setup lang="ts">
import { ref } from 'vue'
import { classicCategories, modernCategories } from '@/data/mashPresets'
import { autoResizeDirective } from '@/utils/autoResize'
import BaseButton from './BaseButton.vue'
import BaseCard from './BaseCard.vue'
import RevealConfirmModal from './RevealConfirmModal.vue'
import type { Mode, MashResult } from '@/types'
import { useEditableCategories } from '@/composables/useEditableCategories'
import { useGameState } from '@/composables/useGameState'

const props = defineProps<{ mode: Mode }>()
const emit = defineEmits<{
  (e: 'finished', data: MashResult): void
}>()

// Editable categories via composable
const { categories: selectedCategories, invalidReason, addOption, removeOption, updateOption, validate } =
  useEditableCategories(props.mode === 'classic' ? classicCategories : modernCategories)

// Game state management via service
const gameState = useGameState(selectedCategories, invalidReason, props.mode)

// Create reactive references for template binding
const countNumber = ref<number>(5)
const showRevealConfirm = ref<boolean>(false)

// Handle count changes
function onCountChange(newCount: number) {
  countNumber.value = newCount
  gameState.updateCount(newCount)
}

// Handle elimination request (show confirmation first)
function requestElimination() {
  if (!gameState.isValidSetup(validate)) return
  showRevealConfirm.value = true
}

// Handle confirmed elimination
async function confirmElimination() {
  showRevealConfirm.value = false
  await gameState.runElimination()
}

// Handle cancellation
function cancelElimination() {
  showRevealConfirm.value = false
}

// Handle game completion
function finish() {
  const result = gameState.finishGame()
  if (result) {
    emit('finished', result)
  }
}

// Handle option editing
function onEditOption(ci: number, oi: number, e: Event) {
  const target = e.target as HTMLInputElement
  updateOption(ci, oi, target.value)
}

// Auto-resize directive
const vAutoResize = autoResizeDirective

// Get relevant emoji for category
function getCategoryEmoji(categoryName: string): string {
  const emojiMap: Record<string, string> = {
    'Life Partner': '💕',
    'Partner': '💕',
    'Kids': '👶',
    'Job': '💼',
    'Salary': '💰',
    'Car': '🚗',
    'Vehicle': '🚗',
    'Where You Live': '🏠',
    'Housing': '🏠',
    'Hobby': '🎯',
    'Life Perk': '🎁',
    'Twist Ending': '🎭'
  }
  return emojiMap[categoryName] || '📋'
}
</script>

<template>
  <section class="grid gap-8 animate-in fade-in duration-700">
    <!-- Control Panel -->
    <BaseCard variant="elevated" hover>
      <div class="flex flex-wrap items-center gap-4">
        <!-- Count Controls -->
        <div class="flex items-center gap-3">
          <div class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-md">
            <span class="text-sm">⚙️</span>
          </div>
          <label class="text-sm font-semibold text-neutral-800">Elimination Count</label>
        </div>
        
        <div class="flex items-center gap-3 flex-1 min-w-0 sm:flex-none">
          <input
            :value="countNumber"
            @input="onCountChange(($event.target as HTMLInputElement).valueAsNumber)"
            type="range"
            min="3"
            max="10"
            step="1"
            :disabled="gameState.running() || gameState.completed()"
            class="h-2 flex-1 min-w-0 sm:w-56 cursor-pointer accent-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            :aria-label="`Elimination count: ${countNumber}`"
            aria-describedby="count-description"
          />
          <span 
            id="count-description"
            class="inline-flex h-8 min-w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 px-3 text-sm font-bold text-white shadow-md flex-shrink-0"
          >{{ countNumber }}</span>
        </div>

        <!-- Action Buttons -->
        <div v-if="!gameState.running()" class="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
          <BaseButton
            v-if="!gameState.completed()"
            variant="primary"
            :disabled="!gameState.canStartElimination.value"
            @click="requestElimination"
            :aria-label="gameState.running() ? 'Elimination in progress' : 'Start elimination process'"
            class="shadow-lg flex-1 sm:flex-none"
          >
            {{ gameState.eliminationButtonText.value }}
          </BaseButton>
          
          <BaseButton
            v-if="gameState.running() || gameState.completed()"
            :disabled="!gameState.completed()"
            @click="finish"
            :variant="gameState.completed() ? 'primary' : 'secondary'"
            :class="[
              gameState.running() && !gameState.completed() && 'animate-pulse',
              'shadow-lg flex-1 sm:flex-none'
            ]"
            title="View Results"
          >
            {{ gameState.completed() ? '📰 View Results' : (gameState.running() ? '⏳ Preparing…' : '📰 View Results') }}
          </BaseButton>
        </div>
      </div>
      
      <div v-if="invalidReason" class="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200">
        <p class="text-sm text-rose-700 font-medium">{{ invalidReason }}</p>
      </div>
    </BaseCard>

    <!-- Progress Section -->
    <transition name="fade" appear>
      <BaseCard v-if="gameState.running()" variant="glass" class="border-purple-200/60">
        <div class="flex items-center gap-4">
          <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg animate-pulse">
            <span class="text-lg">✨</span>
          </div>
          <div class="flex-1">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-semibold text-purple-800">Consulting the stars…</span>
              <span class="font-bold text-purple-600">{{ Math.min(gameState.doneEliminations(), gameState.totalEliminations()) }} / {{ gameState.totalEliminations() }}</span>
            </div>
            <div class="h-3 overflow-hidden rounded-full bg-purple-100 shadow-inner">
              <div 
                class="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm transition-all duration-300"
                :style="{ width: `${gameState.eliminationProgress.value}%` }"
                role="progressbar"
                :aria-label="`Elimination progress: ${gameState.eliminationProgress.value}%`"
                :aria-valuenow="gameState.eliminationProgress.value"
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        </div>
      </BaseCard>
    </transition>

    <!-- Completion Section -->
    <transition name="fade" appear>
      <BaseCard v-if="gameState.completed() && !gameState.running()" variant="elevated" class="border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div class="text-center">
          <div class="mb-4 flex items-center justify-center gap-3">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <span class="text-2xl">📰</span>
            </div>
            <h3 class="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">Your Fate is Sealed!</h3>
          </div>
          
          <div class="mb-6 p-4 rounded-lg bg-white/70 border border-emerald-200">
            <p class="text-emerald-800 font-medium mb-2">
              🎉 The mystical elimination has concluded!
            </p>
            <p class="text-emerald-700 text-sm">
              Your destiny has been determined and printed in this week's exclusive tabloid edition. 
              The cosmic forces have spoken, and your future awaits...
            </p>
          </div>

          <BaseButton
            variant="primary"
            @click="finish"
            class="shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-amber-500 hover:border-orange-500 text-white font-semibold !border-amber-500"
          >
            📰 Read Your Tabloid Fortune
          </BaseButton>
        </div>
      </BaseCard>
    </transition>

    <!-- Category Cards -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <BaseCard
        v-for="(cat, ci) in selectedCategories"
        :key="cat.name"
        variant="elevated"
        hover
        class="group transition-all duration-300"
      >
        <div class="mb-4 flex items-center gap-3">
          <div class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md group-hover:scale-110 transition-transform duration-300">
            <span class="text-sm">{{ getCategoryEmoji(cat.name) }}</span>
          </div>
          <h3 class="text-lg font-bold text-neutral-800 group-hover:text-emerald-700 transition-colors duration-300">{{ cat.name }}</h3>
        </div>
        <ul class="space-y-2">
          <li
            v-for="(opt, oi) in cat.options"
            :key="oi"
            class="flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors"
            :class="[
              // Eliminated option
              gameState.isEliminated(cat.name, oi) && 'line-through bg-rose-50 border-rose-300 text-rose-700 ring-1 ring-rose-200/60',
              // Final remaining option
              !gameState.isEliminated(cat.name, oi) && gameState.remainingInCategory(cat.name) === 1 && 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-400/60',
              // Default state
              !gameState.isEliminated(cat.name, oi) && gameState.remainingInCategory(cat.name) > 1 && 'bg-white',
              // Highlighted during elimination
              gameState.highlighted() && gameState.remainingInCategory(cat.name) > 1 && 
              gameState.highlighted()?.ci === ci && gameState.highlighted()?.oi === oi && 'ring-2 ring-neutral-900'
            ]"
          >
            <template v-if="!gameState.obscureOptions.value">
              <textarea
                :disabled="gameState.running()"
                :value="opt"
                rows="1"
                @input="(e) => { onEditOption(ci, oi, e) }"
                v-auto-resize
                class="mr-3 w-full flex-1 resize-none bg-transparent outline-none whitespace-pre-wrap break-words transition-colors"
                :class="[
                  opt.trim().length === 0 && 'border border-rose-300 ring-1 ring-rose-200 bg-rose-50/50 placeholder:text-rose-400'
                ]"
                :aria-label="`Edit option ${oi + 1} in ${cat.name} category`"
                :placeholder="opt.trim().length === 0 ? 'This field cannot be empty' : `Option ${oi + 1}`"
              />
            </template>
            <template v-else>
              <div
                class="skeleton relative mr-3 h-10 w-full flex-1 overflow-hidden rounded-md bg-neutral-100/80 ring-1 ring-neutral-200"
                aria-hidden="true"
              />
            </template>
            <div class="ml-2 flex items-center gap-2">
              <button v-if="!gameState.obscureOptions.value && !gameState.isEliminated(cat.name, oi)"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 border border-rose-200 text-rose-600 hover:bg-rose-200 hover:scale-110 disabled:opacity-40 transition-all duration-200 shadow-sm cursor-pointer"
                title="Remove option"
                aria-label="Remove option"
                :disabled="gameState.running() || gameState.completed() || selectedCategories[ci].options.length <= 4"
                @click="removeOption(ci, oi)"
              >
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 2a1 1 0 00-1 1v1H5a1 1 0 100 2h10a1 1 0 100-2h-2V3a1 1 0 00-1-1H8zm-1 6a.75.75 0 011.5 0v7a.75.75 0 01-1.5 0V8zm3 0a.75.75 0 011.5 0v7a.75.75 0 01-1.5 0V8zm3 0a.75.75 0 011.5 0v7a.75.75 0 01-1.5 0V8z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </li>
        </ul>
        <div v-if="!gameState.running() && !gameState.completed()" class="mt-4 flex items-center justify-between">
          <BaseButton size="sm" variant="secondary" @click="addOption(ci)" class="shadow-sm">
            <span class="flex items-center gap-1">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add option
            </span>
          </BaseButton>
          <span class="text-xs text-neutral-500 font-medium">Min 4 options</span>
        </div>
      </BaseCard>
    </div>

    <!-- Confirmation Modal -->
    <RevealConfirmModal
      v-model:open="showRevealConfirm"
      @confirm="confirmElimination"
      @cancel="cancelElimination"
    />
  </section>
</template>

<style scoped>
/* simple fade for progress bar */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* softer skeleton shimmer */
.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}
</style>


