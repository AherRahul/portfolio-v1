<script setup lang="ts">
defineProps<{
  innerClass?: string
}>()
</script>

<template>
  <div class="relative pb-8 sm:pb-12 md:pb-16 lg:pb-20">
    <div class="mx-auto md:max-w-5xl lg:max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8" :class="innerClass">
      <slot />
    </div>
  </div>
</template>