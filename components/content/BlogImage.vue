<script setup lang="ts">
const props = defineProps<{
  src: string
  width: number | string
  height: number | string
  alt: string
  caption?: string
  hideCaption?: true
  nonLazy?: true
  isIntro?: boolean
}>()

const { openModal } = useImageModal()

const openImageModal = () => {
  openModal(props.src, props.alt || 'Image')
}

// Dynamic classes based on whether it's an intro image or regular image
const imageClasses = computed(() => {
  const baseClasses = 'w-full object-cover rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-80'
  
  if (props.isIntro) {
    // Larger introductory image
    return `${baseClasses} max-w-4xl h-80 md:h-96`
  } else {
    // Regular image following the prose styling
    return `${baseClasses} max-w-[28rem] h-64`
  }
})
</script>

<template>
  <figure class="flex flex-col items-center">
    <div @click="openImageModal">
      <NuxtPicture 
        :loading="nonLazy ? undefined : 'lazy'" 
        :class="imageClasses"
        format="avif,webp,jpg" 
        densities="1x 2x" 
        :src="src" 
        :alt="alt" 
        :width="isIntro ? 800 : 500" 
        :height="isIntro ? 400 : 300" 
      />
    </div>
    <figcaption 
      v-if="!hideCaption" 
      :class="isIntro ? 'text-center text-zinc-400 text-sm sm:text-base mt-3' : 'text-center text-zinc-400 text-xs sm:text-sm mt-2'"
    >
      {{ caption ?? alt }}
    </figcaption>
  </figure>
</template>