<script setup lang="ts">
// inherited attrs can mess up the satori parser
defineOptions({
  inheritAttrs: false,
})

const bgGradientStyle = {
  backgroundImage: 'linear-gradient(to right, #dc2626, #be185d)',
}

const props = defineProps<{
  title: string
  topics?: string[]
  readingTime?: string
  datePublished?: string
}>()

// Ensure that longer titles don't seem too large
const headingFontSizeClass = computed(() => 
props.title.length > 30 ? 'text-5xl' : 'text-6xl')

</script>
<template>
  <div class="p-4 h-full w-full flex justify-center items-center" :style="bgGradientStyle">
    <div class="p-10 bg-zinc-900 h-full w-full"
      style="background-image: url(https://img.lichter.io/website-og/workshop.png); display: flex; flex-direction: column; justify-content: space-between;">
      <div class="w-full h-full flex flex-col">
        <h1 class="font-bold text-white" :class="headingFontSizeClass">
          {{ title }}
        </h1>
        <div class="text-white/75 text-xl flex justify-between" style="display: flex;">
          <div style="display: flex; gap: 1rem;" v-if="topics?.length">
            <span v-for="topic in topics" :key="topic">
              #{{ topic }}
            </span>
          </div>
          <div v-if="readingTime || datePublished">
            {{ readingTime }}
            &bull;
            Updated at {{ datePublished }}
          </div>
        </div>
      </div>
      <!-- Weird hack so the lower line is correct when rendering svg -->
      <div style="display: flex; margin-top: -6rem;">
        <div class="mr-auto" style="display: flex;">
          <img width="64" height="64" class="mr-4 rounded-full mt-2" src="/img/me@2x.png" />
          <div style="display: flex; flex-direction: column; justify-content: center;">
            <div class="text-2xl leading-none text-white">Rahul Aher</div>
            <div class="text-white/50 text-lg leading-none mt-2">https://rahulaher.netlify.app</div>
          </div>
        </div>
        <img width="64" src="/img/logo/glyph-white-colored.svg" />
      </div>
    </div>
  </div>
</template>