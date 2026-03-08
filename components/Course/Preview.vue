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
  <div class="group relative flex flex-col bg-zinc-950 border border-zinc-900 overflow-hidden hover:border-red-600/50 transition-all duration-500">
    <!-- Image/Video Section -->
    <div class="relative w-full aspect-[16/9] overflow-hidden">
      <img 
        v-if="imageSrc"
        :src="imageSrc" 
        alt="Course cover" 
        class="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-zinc-900 flex items-center justify-center">
        <Icon class="text-7xl text-zinc-800" name="heroicons:academic-cap" />
      </div>
      
      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90" />
      
      <!-- Top Badges -->
      <div class="absolute top-4 left-4 flex flex-wrap gap-2">
        <div v-if="level" class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-black/80 border border-white/5 text-white rounded-none">
          {{ level }}
        </div>
        <div v-if="course.video" class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white rounded-none flex items-center gap-1.5">
          <Icon name="heroicons:video-camera-solid" class="text-xs" /> VIDEO
        </div>
      </div>

      <!-- Play Button Overlay -->
      <div v-if="hasVideo" class="absolute inset-0 flex items-center justify-center transition-all duration-500">
        <div class="w-16 h-16 flex items-center justify-center bg-black/60 border border-white/10 rounded-none group-hover:bg-red-600 group-hover:scale-110 transition-all duration-500 shadow-2xl">
          <Icon class="text-3xl text-white ml-1" name="heroicons:play-solid" />
        </div>
      </div>

      <!-- Bottom Meta (Over Image) -->
      <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90">
        <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-black/40 px-2 py-1">
          <Icon name="heroicons:clock-20-solid" class="text-red-500" />
          {{ course.time }}
        </div>
        <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-black/40 px-2 py-1">
          <Icon name="heroicons:user-group-20-solid" class="text-zinc-500" />
          {{ course.tutor }}
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="flex-1 p-6 flex flex-col bg-zinc-950">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors line-clamp-2 leading-tight tracking-tight uppercase">
          {{ course.title }}
        </h3>
        
        <p class="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
          {{ course.description }}
        </p>
      </div>

      <div class="space-y-4">
        <!-- Footer Meta -->
        <div class="flex flex-wrap items-center gap-y-3 gap-x-6 pt-4 border-t border-zinc-900">
          <div v-if="formattedLanguages" class="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Icon name="heroicons:language-20-solid" class="text-zinc-800 text-base" />
            {{ formattedLanguages }}
          </div>
        </div>

        <AppButton :to="course._path" class="w-full pt-4 pb-4 rounded-none !bg-zinc-900 hover:!bg-red-600 transition-colors border-none">
          <span class="relative z-10 flex items-center justify-center gap-2 font-black uppercase tracking-[0.3em] text-[10px]">
            Explore <Icon name="heroicons:arrow-right-20-solid" class="text-lg" />
          </span>
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Simplified architecture, no custom animations for pulse */
</style>
