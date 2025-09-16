<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  course: any
}>();

// Make isCheck reactive
const isCheck = ref(false);

const onClick = () => {
  isCheck.value = !isCheck.value; // Update the reactive value
};

const formattedLanguages = computed(() => {
  const languages = props.course.languages ? props.course.languages : ['English'];
  if (languages.length === 1) {
    return languages[0]
  }
  return `${languages.slice(0, -1).join(', ')} or ${languages.slice(-1)}`
})

const level = computed(() => props.course.level as string | undefined)
const coverImage = computed(() => props.course.coverImage as string | undefined)

function extractYouTubeId(url?: string): string | undefined {
  if (!url) return undefined
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v') || undefined
    }
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1)
    }
  } catch {}
  return undefined
}

const firstLecture = computed(() => {
  const modules = Array.isArray(props.course.content) ? props.course.content : []
  for (const m of modules) {
    if (Array.isArray(m?.topics) && m.topics.length) {
      return m.topics[0]
    }
  }
  return undefined
})

const videoId = computed(() => extractYouTubeId(firstLecture.value?.videoUrl))
const lectureImage = computed(() => firstLecture.value?.photo_url as string | undefined)
const imageSrc = computed(() => coverImage.value || (videoId.value ? `https://i.ytimg.com/vi/${videoId.value}/hqdefault.jpg` : lectureImage.value))
const hasVideo = computed(() => Boolean(videoId.value))

</script>

<template>
  <div class="group border-l-4 border-red-500 relative flex flex-col sm:flex-row hover:bg-gradient-to-r hover:-translate-y-2 hover:border-zinc-300 transition-all duration-500 from-red-500/60 to-pink-600/60 bg-zinc-800 overflow-hidden">
    <!-- Image/Video Section -->
    <div class="relative w-full sm:w-80 h-48 flex-shrink-0 overflow-hidden">
      <div v-if="imageSrc" class="relative w-full h-full">
        <NuxtImg 
          v-if="imageSrc?.startsWith('https://res.cloudinary.com')"
          provider="cloudinary"
          :src="imageSrc.replace('https://res.cloudinary.com/duojkrgue/image/upload/', '')" 
          alt="Course cover" 
          format="webp" 
          class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
        />
        <img 
          v-else
          :src="imageSrc" 
          alt="Course cover" 
          class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
        />
        <div class="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/40" />
        <div v-if="hasVideo" class="absolute inset-0 flex items-center justify-center">
          <span class="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-black/60 border border-white/20 backdrop-blur-sm group-hover:bg-red-500/80 transition-colors">
            <Icon class="text-2xl sm:text-3xl ml-1" name="heroicons:play" />
          </span>
        </div>
      </div>
      <div v-else class="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
        <Icon class="text-4xl sm:text-6xl text-zinc-500" name="heroicons:academic-cap" />
      </div>
    </div>

    <!-- Content Section -->
    <div class="flex-1 p-4 sm:p-6 flex flex-col justify-between">
      <div>
        <header class="mb-3">
          <AppParagraph tag="h3" class="text-lg sm:text-xl font-semibold leading-tight">
            {{ course.title }}
          </AppParagraph>
        </header>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <span v-if="level" class="text-xs px-2 py-1 border border-zinc-700 bg-zinc-900/60">{{ level }}</span>
          <span class="text-xs px-2 py-1 border border-zinc-700 bg-zinc-900/60 flex items-center gap-1">
            <Icon name="heroicons:clock" /> 
            <span class="hidden sm:inline">{{ course.time }}</span>
            <span class="sm:hidden">{{ course.time?.replace(' days', 'd')?.replace(' hours', 'h') }}</span>
          </span>
          <span class="text-xs px-2 py-1 border border-zinc-700 bg-zinc-900/60 flex items-center gap-1">
            <Icon name="heroicons:user-group" /> 
            <span class="hidden sm:inline">{{ course.tutor }} tutor</span>
            <span class="sm:hidden">{{ course.tutor }}</span>
          </span>
          <span v-if="formattedLanguages" class="text-xs px-2 py-1 border border-zinc-700 bg-zinc-900/60 flex items-center gap-1">
            <Icon name="heroicons:language" /> 
            <span class="hidden sm:inline">{{ formattedLanguages }}</span>
            <span class="sm:hidden">{{ formattedLanguages.split(' ')[0] }}</span>
          </span>
          <span class="text-xs px-2 py-1 border border-zinc-700 bg-zinc-900/60 flex items-center gap-1">
            <Icon :name="course.video ? 'heroicons:video-camera' : 'heroicons:book-open'" /> 
            <span class="hidden sm:inline">{{ course.video ? 'Video' : 'Reading' }}</span>
          </span>
        </div>

        <p class="text-zinc-300 leading-relaxed line-clamp-3">
          {{ course.description }}
        </p>
      </div>

      <div class="flex justify-end mt-4">
        <AppButton :to="course._path">
          Explore Course
          <Icon name="material-symbols:double-arrow" class="ml-1" />
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style>
.collapsible-container__title {
  cursor: pointer;
}

.custom-button .bg-black {
  background-color: #27272a;
}
</style>