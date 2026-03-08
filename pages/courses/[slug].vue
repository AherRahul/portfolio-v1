<script setup lang="ts">
import { onContentNotFound } from '~/utils/content.js';

const { page: course } = useContent();

const level = computed(() => course.value.level as string | undefined)
const coverImage = computed(() => course.value.coverImage as string | undefined)
const prerequisites = computed(() => course.value.prerequisites as string[] | undefined)
const outcomes = computed(() => course.value.outcomes as string[] | undefined)
const audience = computed(() => course.value.audience as string[] | undefined)

const enrollMailto = computed(() => {
  const subject = encodeURIComponent(`Course inquiry: ${course.value.title}`)
  const body = encodeURIComponent(
    `Hi Rahul,%0D%0A%0D%0AI'd like to learn more about the course "${course.value.title}".%0D%0A%0D%0A` +
    `Preferred time frame: %0D%0A` +
    `Team size (if applicable): %0D%0A` +
    `Context / goals: %0D%0A`)
  return `mailto:rahulvijayaher@gmail.com?subject=${subject}&body=${body}`
})

// Module expansion state management
const moduleExpanded = ref<Record<string, boolean>>({})

// Progress tracking
const lectureProgress = ref<Record<string, boolean>>({})

// Initialize expansion state from course content
watchEffect(() => {
  if (course.value?.content) {
    course.value.content.forEach((module: any) => {
      if (!(module.module_id in moduleExpanded.value)) {
        moduleExpanded.value[module.module_id] = module.expanded ?? false
      }
      // Initialize progress for lectures
      module.topics?.forEach((lecture: any) => {
        if (!(lecture.id in lectureProgress.value)) {
          lectureProgress.value[lecture.id] = false
        }
      })
    })
  }
})

// Progress tracking functions
function toggleLectureProgress(lectureId: string) {
  lectureProgress.value[lectureId] = !lectureProgress.value[lectureId]
  // Store in localStorage for persistence
  localStorage.setItem(`course-${course.value.title}-progress`, JSON.stringify(lectureProgress.value))
}

function getModuleProgress(module: any): number {
  if (!module.topics?.length) return 0
  const completed = module.topics.filter((lecture: any) => lectureProgress.value[lecture.id]).length
  return Math.round((completed / module.topics.length) * 100)
}

const { setupContentImages } = useContentImages()

// Load progress from localStorage
onMounted(() => {
  const savedProgress = localStorage.getItem(`course-${course.value.title}-progress`)
  if (savedProgress) {
    try {
      lectureProgress.value = JSON.parse(savedProgress)
    } catch (e) {
      console.error('Failed to load progress:', e)
    }
  }
  
  // Setup image modal for content images
  setupContentImages('.course-content')
})

function toggleModule(moduleId: string, event?: Event) {
  event?.preventDefault()
  moduleExpanded.value[moduleId] = !moduleExpanded.value[moduleId]
}

function expandAll() {
  if (course.value?.content) {
    course.value.content.forEach((module: any) => {
      moduleExpanded.value[module.module_id] = true
    })
  }
}

function collapseAll() {
  if (course.value?.content) {
    course.value.content.forEach((module: any) => {
      moduleExpanded.value[module.module_id] = false
    })
  }
}

// useSeoMeta({
//   title: () => course.value.title,
//   description: () => course.value.description,
//   ogTitle: () => course.value.title,
//   ogDescription: () => course.value.description,
// });

// Filter to only published modules/topics for public view
const publishedModules = computed(() => {
  return (course.value?.content || []).filter((mod: any) => mod.published !== false).map((mod: any) => ({
    ...mod,
    topics: (mod.topics || []).filter((t: any) => t.published !== false)
  }))
})

onContentNotFound(course);

defineOgImageComponent('Course', {
  title: course.value.title,
  time: course.value.time,
  tutor: course.value.tutor ?? 1,
  languages: course.value.languages ?? ['English'],
});
</script>

<template>
  <div class="min-h-screen bg-black overflow-x-hidden">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-zinc-950 pt-2 pb-6 lg:pt-2 lg:pb-10 border-b border-zinc-900">
      <AppSection>
        <div class="container mx-auto">
          <AppLinkBack to="/courses/" class="inline-flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors uppercase text-[10px] font-black tracking-[0.3em] mb-4">
             All Courses
          </AppLinkBack>
          
          <div class="max-w-4xl">
            <div class="flex items-center gap-2 mb-3">
              <span class="h-px w-8 bg-red-600"></span>
              <span class="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-red-500">Course Deep Dive</span>
            </div>
            
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white mb-4 uppercase">
              {{ course.title }}
            </h1>
            
            <div class="flex flex-wrap items-center gap-4 lg:gap-6 mb-6">
              <div v-if="level" class="px-3 py-1.5 lg:px-4 lg:py-2 text-[10px] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-none shadow-2xl">
                {{ level }}
              </div>
              <div class="h-8 w-px bg-zinc-800 hidden sm:block"></div>
              <CourseDetails
                :time="course.time"
                :tutor="course.tutor"
                :languages="course.languages"
                :video="course.video"
                class="flex flex-wrap gap-4 lg:gap-8 text-zinc-400 font-bold uppercase text-[10px] lg:text-[11px] tracking-widest"
              />
            </div>

            <p class="text-base lg:text-lg leading-relaxed text-zinc-400 max-w-3xl font-medium mb-8">
              {{ course.description }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 mb-4">
              <AppButton :to="enrollMailto" class="w-full sm:w-auto flex justify-center items-center px-8 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-none">
                Get Started
                <Icon name="heroicons:bolt-20-solid" class="ml-2" />
              </AppButton>
              <AppButton to="#curriculum" class="hidden sm:inline-flex justify-center items-center px-8 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-none !bg-zinc-900 hover:!bg-zinc-800">
                View Curriculum
              </AppButton>
            </div>
          </div>
        </div>
      </AppSection>
    </div>

    <!-- Course Content Section -->
    <div id="curriculum" class="relative z-10 py-12 bg-black">
      <AppSection>
        <div class="container mx-auto">
          <div class="lg:grid lg:grid-cols-12 lg:gap-16">
            <!-- Sticky Sidebar -->
            <aside class="hidden lg:block lg:col-span-3 sticky top-32 self-start">
              <div class="bg-zinc-950 border border-zinc-900 p-8 shadow-2xl">
                <h3 class="text-xs font-black uppercase tracking-[0.3em] text-red-500 mb-8 flex items-center gap-3">
                  <Icon name="heroicons:list-bullet-20-solid" class="text-xl" />
                  Index
                </h3>
                <nav class="space-y-6">
                  <a v-for="(module, mIndex) in publishedModules" :key="module.module_id"
                     :href="`#module-${Number(mIndex) + 1}`" 
                     class="flex items-start gap-4 text-zinc-500 hover:text-white transition-all duration-300 group">
                    <span class="flex-shrink-0 w-6 h-6 border border-zinc-800 group-hover:border-red-600 flex items-center justify-center text-[10px] font-black">
                      {{ (Number(mIndex) + 1).toString().padStart(2, '0') }}
                    </span>
                    <span class="text-xs font-bold leading-tight uppercase tracking-wider">{{ module.module_name }}</span>
                  </a>
                </nav>
              </div>
            </aside>

            <!-- Main Content Area -->
            <div class="lg:col-span-9">
              <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 lg:mb-12">
                <div class="flex flex-col">
                  <span class="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-2">Curriculum Overview</span>
                  <h2 class="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white">Full <span class="text-red-600">Syllabus</span></h2>
                  <div class="flex flex-wrap gap-4 lg:gap-6 mt-4 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span>{{ publishedModules.length }} Modules</span>
                    <span>{{ publishedModules.reduce((total: number, module: any) => total + (module.topics?.length || 0), 0) }} Lectures</span>
                    <span>{{ course.time }} HD Content</span>
                  </div>
                </div>
                <div class="hidden sm:flex gap-2">
                  <button @click="expandAll" class="px-4 py-2 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                    Expand all
                  </button>
                  <button @click="collapseAll" class="px-4 py-2 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                    Collapse all
                  </button>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  v-for="(module, mIndex) in publishedModules"
                  :key="module.module_id"
                  :id="`module-${Number(mIndex) + 1}`"
                  class="bg-zinc-950 border border-zinc-900 group"
                  :class="{ 'border-zinc-800 shadow-2xl': moduleExpanded[module.module_id] }"
                >
                  <button 
                    @click="(event) => toggleModule(module.module_id, event)"
                    class="w-full p-4 sm:p-6 transition-colors text-left"
                  >
                    <div class="flex items-center gap-6 text-white">
                      <span class="flex-shrink-0 w-10 h-10 border border-zinc-800 group-hover:border-red-600 flex items-center justify-center text-base font-black transition-colors" :class="{ 'border-red-600 text-red-500': moduleExpanded[module.module_id] }">
                        {{ Number(mIndex) + 1 }}
                      </span>
                      <div class="flex-1 min-w-0">
                        <div class="flex flex-wrap items-center gap-3 mb-1">
                          <span class="text-xl font-black uppercase tracking-tighter">{{ module.module_name }}</span>
                          <span class="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-900/50 px-2 py-0.5">
                            {{ module.module_duration }}
                          </span>
                        </div>
                        <div class="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
                          <span class="text-zinc-500">{{ module.topics?.length || 0 }} Lectures</span>
                          <span class="text-red-500/80">{{ getModuleProgress(module) }}% Completed</span>
                        </div>
                      </div>
                      <Icon 
                        :name="moduleExpanded[module.module_id] ? 'heroicons:minus-20-solid' : 'heroicons:plus-20-solid'"
                        class="text-xl text-zinc-700 transition-all group-hover:text-red-500"
                        :class="{ 'text-red-500': moduleExpanded[module.module_id] }"
                      />
                    </div>
                  </button>
                  
                  <div v-show="moduleExpanded[module.module_id]" class="border-t border-zinc-900 bg-black/40">
                    <div class="p-4 sm:p-6 space-y-px bg-zinc-900 border-t border-zinc-900">
                      <div
                        v-for="(lecture, l_index) in (module.topics || [])"
                        :key="lecture.id"
                        class="bg-zinc-950 p-6 sm:p-8 border border-zinc-900 hover:border-zinc-700 transition-all duration-300"
                      >
                        <div class="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
                          <!-- Media Section -->
                          <div>
                            <div v-if="lecture.videoUrl" class="video-container shadow-2xl ring-1 ring-zinc-800">
                              <iframe
                                :src="lecture.videoUrl"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                              ></iframe>
                            </div>
                            <div v-else class="relative group/img overflow-hidden ring-1 ring-zinc-800 bg-zinc-950 flex items-center justify-center">
                              <img
                                :src="lecture.photo_url"
                                :alt="`${lecture.topic_name} illustration`"
                                class="w-full aspect-video object-contain transition-all duration-700 group-hover/img:scale-105"
                              />
                            </div>
                          </div>
                          
                          <!-- Info Section -->
                          <div class="flex flex-col">
                            <div class="flex items-start justify-between mb-4">
                              <div class="flex flex-col">
                                <span class="text-[9px] font-black uppercase tracking-[0.3em] text-red-600 mb-2">Lecture {{ Number(l_index) + 1 }}</span>
                                <h4 class="text-xl font-black uppercase tracking-tighter text-white leading-tight">
                                  {{ lecture.topic_name }}
                                </h4>
                              </div>
                              <button @click="toggleLectureProgress(lecture.id)" class="text-2xl transition-all" :class="lectureProgress[lecture.id] ? 'text-green-500' : 'text-zinc-800 hover:text-zinc-600'">
                                <Icon :name="lectureProgress[lecture.id] ? 'heroicons:check-badge-20-solid' : 'heroicons:check-badge-20-solid'" />
                              </button>
                            </div>
                            
                            <div class="flex flex-wrap gap-6 mb-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                              <span v-if="lecture.duration" class="flex items-center gap-2">
                                <Icon class="text-lg text-zinc-800" name="heroicons:clock-20-solid" /> 
                                {{ lecture.duration }}
                              </span>
                              <span v-if="lecture.is_on_youtube" class="flex items-center gap-2 text-red-500">
                                <Icon class="text-lg" name="mdi:youtube" /> 
                                Public
                              </span>
                            </div>

                            <p v-if="lecture.description" class="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
                              {{ lecture.description }}
                            </p>
                            <div class="mt-auto flex flex-col sm:flex-row gap-3">
                              <AppButton v-if="lecture._path" :to="`/articles/${$route.params.slug}/${lecture._path}`" class="w-full sm:w-auto flex justify-center items-center text-center !bg-red-600 hover:!bg-red-700 !text-[12px] py-4 px-8 lg:px-12 rounded-none border-none uppercase tracking-widest font-black shadow-xl transition-all hover:scale-105 active:scale-95">
                                Read Article
                              </AppButton>
                              <AppButton v-if="lecture.slidesUrl" :to="lecture.slidesUrl" target="_blank" class="w-full sm:w-auto flex justify-center items-center text-center !bg-zinc-900 hover:!bg-zinc-800 !text-[9px] py-4 px-8 rounded-none border-none">
                                DOWNLOAD SLIDES
                              </AppButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Details -->
          <div v-if="prerequisites?.length || outcomes?.length || audience?.length" class="mt-8 border-t border-zinc-900 pt-8 mb-8">
            <div class="grid md:grid-cols-3 gap-16">
              <div v-if="prerequisites?.length">
                <span class="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-4 block">Preparation</span>
                <h3 class="text-2xl font-black uppercase tracking-tighter text-white mb-8">Prerequisites</h3>
                <ul class="space-y-4">
                  <li v-for="item in prerequisites" :key="item" class="flex items-start gap-3 text-zinc-400 text-sm font-medium">
                    <Icon name="heroicons:chevron-right-20-solid" class="text-red-500 mt-0.5" />
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div v-if="outcomes?.length">
                <span class="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-4 block">Knowledge</span>
                <h3 class="text-2xl font-black uppercase tracking-tighter text-white mb-8">Outcomes</h3>
                <ul class="space-y-4">
                  <li v-for="item in outcomes" :key="item" class="flex items-start gap-3 text-zinc-400 text-sm font-medium">
                    <Icon name="heroicons:check-20-solid" class="text-green-500 mt-0.5" />
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div v-if="audience?.length">
                <span class="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-4 block">Targeting</span>
                <h3 class="text-2xl font-black uppercase tracking-tighter text-white mb-8">Who it's for</h3>
                <ul class="space-y-4">
                  <li v-for="item in audience" :key="item" class="flex items-start gap-3 text-zinc-500 text-sm font-bold uppercase tracking-wide italic">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AppSection>
    </div>

    <!-- Article Content -->
    <AppSection class="bg-black py-12 border-t border-zinc-900">
      <div class="container mx-auto prose prose-invert prose-red max-w-none course-content">
        <div class="flex items-center gap-4 mb-10">
          <h2 class="text-4xl font-black uppercase tracking-tighter text-white m-0">
            Deep <span class="text-red-600">Context</span>
          </h2>
          <div class="h-px flex-1 bg-zinc-900 mt-2"></div>
        </div>
        <ContentDoc />
      </div>
    </AppSection>
  </div>
</template>

<style scoped>
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
