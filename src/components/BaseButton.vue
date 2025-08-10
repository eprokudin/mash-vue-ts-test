<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md'
  disabled?: boolean
}

const { variant = 'secondary', size = 'md', disabled = false } = defineProps<Props>()
</script>

<template>
    <button
    class="rounded-md border font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
    :class="[
      // Variants
      variant === 'primary' && 'bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800 hover:shadow-lg focus:ring-neutral-500',
      variant === 'secondary' && 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-md focus:ring-neutral-500',
      variant === 'danger' && 'bg-rose-600 border-rose-600 text-white hover:bg-rose-700 hover:shadow-lg focus:ring-rose-500',
      // Sizes
      size === 'sm' && 'px-2 py-1 text-xs',
      size === 'md' && 'px-3 py-1.5 text-sm'
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
