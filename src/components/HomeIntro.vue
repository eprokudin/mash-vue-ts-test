<script setup lang="ts">

const emit = defineEmits<{
  (e: 'start', mode: 'classic' | 'modern'): void
}>()
</script>

<template>
  <section class="grid gap-8 animate-in fade-in duration-700">
    <!-- Hero Section -->
    <div class="group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-gradient-to-br from-white via-neutral-50/30 to-neutral-100/50 p-8 text-center shadow-lg backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:border-neutral-300/60">
      <!-- Subtle background pattern -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <!-- Content -->
      <div class="relative z-10">
        <div class="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
          <span class="text-2xl">🔮</span>
        </div>
        
        <h1 class="font-display text-4xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent sm:text-5xl">
          Welcome to MASH
        </h1>
        
        <p class="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 leading-relaxed">
          Your crystal ball for predicting the absolutely, definitely 100% true story of your future life.
        </p>
        
        <p class="mx-auto mt-3 max-w-2xl text-neutral-500 leading-relaxed">
          Answer a few questions, pick some wild options, and prepare for fate to do its thing…
        </p>
      </div>
    </div>

    <!-- Game Mode Cards -->
    <div class="grid gap-6 sm:grid-cols-2">
      <!-- Classic Mode -->
      <button
        class="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-white to-neutral-50/50 p-8 text-left shadow-md transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-200/60 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
        @click="emit('start', 'classic')"
      >
        <!-- Hover gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- Content -->
        <div class="relative z-10">
          <div class="mb-4 flex items-center justify-between">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span class="text-xl">🎲</span>
            </div>
            <div class="text-neutral-400 group-hover:text-amber-500 transition-colors duration-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <h3 class="mb-3 text-2xl font-bold text-neutral-900 group-hover:text-amber-900 transition-colors duration-300">
            Play Classic
          </h3>
          
          <p class="text-neutral-600 leading-relaxed group-hover:text-neutral-700 transition-colors duration-300">
            Old-school categories with a nostalgic twist. Pick your options and let the time-tested elimination decide your fate.
          </p>
        </div>
      </button>

      <!-- Modern Mode -->
      <button
        class="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-white to-neutral-50/50 p-8 text-left shadow-md transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200/60 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
        @click="emit('start', 'modern')"
      >
        <!-- Hover gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- Content -->
        <div class="relative z-10">
          <div class="mb-4 flex items-center justify-between">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span class="text-xl">✨</span>
            </div>
            <div class="text-neutral-400 group-hover:text-purple-500 transition-colors duration-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <h3 class="mb-3 text-2xl font-bold text-neutral-900 group-hover:text-purple-900 transition-colors duration-300">
            Play Modern
          </h3>
          
          <p class="text-neutral-600 leading-relaxed group-hover:text-neutral-700 transition-colors duration-300">
            A cheeky, updated set with contemporary chaos and modern twists. Same MASH thrill, fresh new laughs.
          </p>
        </div>
      </button>
    </div>
  </section>
</template>

<style scoped></style>
