<script setup lang="ts">
import type { MashResult } from '@/types'
import { useTabloidResult } from '@/composables/useTabloidResult'
import BaseCard from './BaseCard.vue'

const props = defineProps<{ data: MashResult }>()

// Use tabloid result composable for all logic
const tabloidResult = useTabloidResult(props.data)
</script>

<template>
  <section class="grid gap-8 animate-in fade-in duration-700">
    <!-- Tabloid Newspaper -->
    <BaseCard variant="elevated" padding="none" class="overflow-hidden border-neutral-300/80 shadow-2xl">
      <!-- Banner -->
      <div class="relative bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-6 shadow-lg">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
        <div class="relative flex items-end justify-between">
          <div>
            <div class="mb-1 text-xs font-bold uppercase tracking-widest text-red-100">Exclusive Fortune</div>
            <h2 class="font-display text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">{{ tabloidResult.header.value.paperName }}</h2>
          </div>
          <div class="text-right leading-tight text-white/95">
            <div class="text-xs font-bold uppercase tracking-widest">Issue #{{ tabloidResult.header.value.issueNo }}</div>
            <div class="h-2"></div>
            <div class="text-xs font-bold uppercase tracking-widest">{{ tabloidResult.header.value.today }}</div>
          </div>
        </div>
      </div>

      <div class="grid gap-6 p-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <transition name="reveal" appear>
            <div v-show="tabloidResult.shouldReveal(0)" class="mb-2 text-sm font-extrabold uppercase tracking-widest text-red-600">{{ tabloidResult.headlines.value.flash }}</div>
          </transition>
          <transition name="reveal" appear>
            <h1 v-show="tabloidResult.shouldReveal(1)" class="mb-1 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              {{ tabloidResult.headlines.value.mainHeadline }}
            </h1>
          </transition>
          <transition name="reveal" appear>
            <h2 v-show="tabloidResult.shouldReveal(2)" class="mb-4 text-lg font-extrabold text-neutral-800">
              {{ tabloidResult.headlines.value.subHead }}
            </h2>
          </transition>

          <transition name="reveal" appear>
            <p v-show="tabloidResult.shouldReveal(3)" class="mb-6 text-neutral-700">{{ tabloidResult.body.value }}</p>
          </transition>
        </div>

        <aside class="space-y-4">
          <!-- Big EXCLUSIVE banner -->
          <transition name="reveal" appear>
            <div v-show="tabloidResult.shouldReveal(4)" class="rounded-md border-2 border-yellow-400 bg-yellow-300 px-3 py-2 text-center text-sm font-extrabold uppercase tracking-widest text-red-800">
              Exclusive
            </div>
          </transition>

          <!-- Themed section headers (randomised content) -->
          <transition name="reveal" appear>
            <div v-show="tabloidResult.shouldReveal(4)" class="rounded-md border bg-white p-3">
              <div class="mb-1 text-[11px] font-black uppercase tracking-widest text-red-700">Shock Life Update</div>
              <div class="text-xs font-bold">{{ tabloidResult.sidebar.value.banners.shock.headline }}</div>
              <div class="text-xs text-neutral-700">{{ tabloidResult.sidebar.value.banners.shock.blurb }}</div>
            </div>
          </transition>
          <transition name="reveal" appear>
            <div v-show="tabloidResult.shouldReveal(4)" class="rounded-md border bg-white p-3">
              <div class="mb-1 text-[11px] font-black uppercase tracking-widest text-pink-700">Love & Scandal</div>
              <div class="text-xs font-bold">{{ tabloidResult.sidebar.value.banners.love.headline }}</div>
              <div class="text-xs text-neutral-700">{{ tabloidResult.sidebar.value.banners.love.blurb }}</div>
            </div>
          </transition>
          <transition name="reveal" appear>
            <div v-show="tabloidResult.shouldReveal(4)" class="rounded-md border bg-white p-3">
              <div class="mb-1 text-[11px] font-black uppercase tracking-widest text-blue-700">Career Chaos</div>
              <div class="text-xs font-bold">{{ tabloidResult.sidebar.value.banners.career.headline }}</div>
              <div class="text-xs text-neutral-700">{{ tabloidResult.sidebar.value.banners.career.blurb }}</div>
            </div>
          </transition>
          <transition-group name="reveal" tag="div" class="space-y-4">
            <div
              v-for="(q, idx) in tabloidResult.sidebar.value.quotes"
              :key="idx"
              v-show="tabloidResult.shouldReveal(5 + idx)"
              class="rounded-md border p-4"
              :class="[
                idx % 3 === 0 && 'bg-yellow-50 border-yellow-300',
                idx % 3 === 1 && 'bg-blue-50 border-blue-300',
                idx % 3 === 2 && 'bg-neutral-50'
              ]"
            >
              <div 
                class="mb-1 text-[11px] uppercase tracking-wide"
                :class="[
                  idx % 3 === 0 && 'text-yellow-800',
                  idx % 3 === 1 && 'text-blue-800',
                  idx % 3 === 2 && 'text-neutral-500'
                ]"
              >{{ tabloidResult.sidebar.value.quoteLabels[idx] }}</div>
              <div class="text-sm italic leading-snug">"{{ q.quote }}"</div>
              <div class="mt-1 text-xs font-semibold text-neutral-700">— {{ q.source }}</div>
            </div>
          </transition-group>
        </aside>
      </div>
    </BaseCard>

    <!-- Next Issue Teaser (reveal last) -->
    <transition name="reveal" appear>
      <BaseCard
        v-show="tabloidResult.shouldReveal(5 + tabloidResult.sidebar.value.quotes.length)"
        variant="default"
        class="text-center border-dashed border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50"
      >
        <div class="text-center sm:flex sm:items-center sm:justify-center gap-3">
          <div class="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 shadow-md">
            <span class="text-sm">📰</span>
          </div>
          <div class="mx-auto">
            <div class="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">Coming Next Issue</div>
            <div class="text-sm font-extrabold text-amber-800">{{ tabloidResult.footer.value.nextTeaser }}</div>
          </div>
        </div>
      </BaseCard>
    </transition>

  </section>
</template>

<style scoped>
.reveal-enter-active,
.reveal-leave-active {
  transition: all .35s ease;
}
.reveal-enter-from,
.reveal-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>


