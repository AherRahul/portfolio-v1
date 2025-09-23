<script setup lang="ts">
const props = defineProps<{
  src: string
  width: number | string
  height: number | string
  alt: string
  caption?: string
  hideCaption?: true
  nonLazy?: true
}>()

const { openModal } = useImageModal()

const openImageModal = () => {
  openModal(props.src, props.alt || 'Image')
}
</script>

<template>
  <figure class="flex flex-col items-center">
    <div 
      class="cursor-pointer hover:opacity-80 transition-opacity duration-200"
      @click="openImageModal"
    >
      <NuxtPicture 
        :loading="nonLazy ? undefined : 'lazy'" 
        class="not-prose w-full max-w-md h-64 object-cover rounded-lg shadow-md" 
        format="avif,webp,jpg" 
        densities="1x 2x" 
        :src="src" 
        :alt="alt" 
        :width="400" 
        :height="256" 
      />
    </div>
    <figcaption v-if="!hideCaption" class="text-center text-zinc-400 text-xs sm:text-sm mt-2">{{ caption ?? alt }}</figcaption>
  </figure>
</template>