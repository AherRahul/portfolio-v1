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
  time?: string
  attendees?: string
  languages?: string[]
}>()

// Workaround for https://github.com/harlan-zw/nuxt-og-image/issues/89
const actualLanguages = computed(() => props.languages?.slice(0, props.languages.length / 2) ?? [])
const formattedLanguages = computed(() => {
  if (!actualLanguages.value.length)
    return ''
  if (actualLanguages.value.length === 1) {
    return actualLanguages.value[0]
  }
  return `${actualLanguages.value.slice(0, -1).join(', ')} or ${actualLanguages.value.slice(-1)}`
})

// Ensure that longer titles don't seem too large
const headingFontSizeClass = computed(() => props.title.length > 30 ? 'text-5xl' : 'text-6xl')

</script>
<template>
  <div class="p-4 h-full w-full flex justify-center items-center" :style="bgGradientStyle">
    <div class="p-10 bg-zinc-900 h-full w-full"
      style="background-image: url(https://img.lichter.io/website-og/workshop.png); display: flex; flex-direction: column; justify-content: space-between;">
      <div class="w-full h-full flex flex-col">
        <h1 class="font-bold text-white" :class="headingFontSizeClass">
          {{ title }}
        </h1>
        <div v-if="time || attendees" class="text-white text-2xl">
          <span class="mt-4">
            <Icon class="mr-4 mt-1" name="heroicons:clock" /> {{ time }}
          </span>
          <span class="mt-4">
            <Icon class="mr-4 mt-1" name="heroicons:user-group" /> max. {{ attendees }}
          </span>
          <span class="mt-4">
            <Icon class="mr-4 mt-1" name="heroicons:language" /> {{ formattedLanguages }}
          </span>
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