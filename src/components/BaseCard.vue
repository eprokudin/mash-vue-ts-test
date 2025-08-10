<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const { variant = 'default', padding = 'md', hover = false } = defineProps<Props>()
</script>

<template>
  <div 
    class="rounded-2xl border transition-all duration-300"
    :class="[
      // Variants
      variant === 'default' && 'border-neutral-200/80 bg-white shadow-md',
      variant === 'elevated' && 'border-neutral-200/80 bg-gradient-to-br from-white to-neutral-50/50 shadow-lg backdrop-blur-sm',
      variant === 'glass' && 'border-neutral-400/80 bg-white/80 shadow-xl backdrop-blur-md',
      
      // Padding
      padding === 'none' && 'p-0',
      padding === 'sm' && 'p-4',
      padding === 'md' && 'p-6',
      padding === 'lg' && 'p-8',
      
      // Hover effects
      hover && 'hover:shadow-xl hover:border-neutral-300/60 hover:scale-[1.01]'
    ]"
  >
    <slot />
  </div>
</template>
