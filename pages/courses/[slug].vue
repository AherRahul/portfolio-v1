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

onContentNotFound(course);

defineOgImageComponent('Course', {
  title: course.value.title,
  time: course.value.time,
  tutor: course.value.tutor ?? 1,
  languages: course.value.languages ?? ['English'],
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <AppSection class="bg-gradient-to-b from-black to-zinc-900 text-white pb-12">
      <div class="container mx-auto">
        <AppLinkBack to="/courses/" class="text-gray-300 hover:text-white">
          All Courses
        </AppLinkBack>
        <ParagraphDecoration class="mt-2" />
        <AppParagraph class="mt-4" look="heading" tag="h1">
          {{ course.title }}
        </AppParagraph>
        <div class="flex flex-wrap gap-2 mt-2">
          <span v-if="level" class="text-xs px-2 py-1 rounded-md border border-zinc-700 bg-zinc-900/60">{{ level }}</span>
        </div>
        <CourseDetails
          :time="course.time"
          :tutor="course.tutor"
          :languages="course.languages"
          :video="course.video"
          class="mt-6 flex flex-wrap gap-8 hidden lg:flex"
        />
        <!-- <div class="mt-6">
          <AppButton :to="enrollMailto" class="mr-3">Enroll / Contact</AppButton>
          <AppButton to="/contact/" look="secondary">Contact form</AppButton>
        </div> -->

      </div>
    </AppSection>

    <!-- Course Content Section -->
    <AppSection class="bg-zinc-900 pb-8 text-white">
      <div class="container mx-auto">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside class="hidden lg:block lg:col-span-3 sticky top-24 self-start">
            <div class="bg-zinc-800 p-4 border border-zinc-700">
              <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="heroicons:list-bullet" class="text-xl" />
                Course Modules
              </h3>
              <ol class="space-y-2">
                <li v-for="(module, index) in (course.content || [])" :key="module.module_id">
                  <a :href="`#module-${index+1}`" 
                     class="flex items-center gap-3 p-2 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all duration-200 group">
                    <span class="flex-shrink-0 w-6 h-6 bg-zinc-700 group-hover:bg-red-500 flex items-center justify-center text-xs font-semibold">
                      {{ index + 1 }}
                    </span>
                    <span class="text-sm leading-tight">{{ module.module_name }}</span>
                  </a>
                </li>
              </ol>
            </div>
          </aside>
          <div class="lg:col-span-9">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-3xl font-semibold mb-2">Course Content</h2>
                <!-- Course stats -->
                <div class="flex flex-wrap gap-4 text-sm text-zinc-400">
                  <span>{{ course.content?.length || 0 }} modules</span>
                  <span>{{ course.content?.reduce((total: number, module: any) => total + (module.topics?.length || 0), 0) || 0 }} lectures</span>
                  <span>{{ course.time }} total length</span>
                </div>
              </div>
              <div class="flex gap-2">
                <AppButton look="secondary" @click="expandAll">
                  <Icon name="heroicons:chevron-down" class="text-lg mr-1" />
                  Expand all
                </AppButton>
                <AppButton look="secondary" @click="collapseAll">
                  <Icon name="heroicons:chevron-up" class="text-lg mr-1" />
                  Collapse all
                </AppButton>
              </div>
            </div>
            <div class="space-y-4">
          <div
            v-for="(module, index) in (course.content || [])"
            :key="module.module_id"
            :id="`module-${index+1}`"
            class="bg-zinc-800 shadow-lg transition-all hover:shadow-xl border-l-4 border-red-500 overflow-hidden"
          >
            <button 
              @click="(event) => toggleModule(module.module_id, event)"
              class="w-full bg-zinc-800/90 p-4 sm:p-6 border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors text-left"
            >
              <div class="flex items-center gap-3 text-white">
                <span class="flex-shrink-0 w-8 h-8 bg-red-500 flex items-center justify-center text-sm font-bold">
                  {{ index + 1 }}
                </span>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3">
                    <span class="text-lg sm:text-xl font-semibold truncate">{{ module.module_name }}</span>
                    <span class="hidden sm:inline text-sm text-zinc-400 bg-zinc-700 px-3 py-1 flex-shrink-0">
                      {{ module.module_duration }}
                    </span>
                  </div>
                  <!-- Module stats -->
                  <div class="flex items-center gap-4 mt-1 text-xs text-zinc-400">
                    <span>{{ module.topics?.length || 0 }} lectures</span>
                    <span v-if="module.topics_count">{{ module.topics_count }} topics</span>
                    <span class="hidden sm:inline">{{ module.tutor }} instructor{{ module.tutor > 1 ? 's' : '' }}</span>
                    <span class="text-green-600">{{ getModuleProgress(module) }}% complete</span>
                  </div>
                  <!-- Progress bar -->
                  <div class="mt-2 w-full bg-zinc-700 h-1">
                    <div 
                      class="h-1 bg-gradient-to-r from-red-500 to-pink-600 transition-all duration-300"
                      :style="{ width: `${getModuleProgress(module)}%` }"
                    ></div>
                  </div>
                </div>
                <Icon 
                  :name="moduleExpanded[module.module_id] ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                  class="text-xl text-zinc-400 transition-transform duration-200 flex-shrink-0"
                />
              </div>
              <!-- Mobile duration -->
              <div class="sm:hidden mt-2 text-sm text-zinc-400">
                Duration: {{ module.module_duration }}
              </div>
            </button>
            
            <div 
              v-show="moduleExpanded[module.module_id]"
              class="transition-all duration-300 ease-in-out"
            >
              <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div
                  v-for="(lecture, l_index) in (module.topics || [])"
                  :key="lecture.id"
                  class="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6 bg-gradient-to-r from-zinc-700 to-zinc-700/80 p-4 sm:p-6 border border-zinc-600 hover:border-zinc-500 hover:shadow-lg transition-all duration-300"
                >
                  <!-- Video Section -->
                  <div class="order-1 lg:order-1">
                    <div v-if="lecture.videoUrl" class="video-container overflow-hidden shadow-sm">
                      <iframe
                        :src="lecture.videoUrl"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      ></iframe>
                    </div>
                    <div v-else class="overflow-hidden shadow-sm bg-zinc-600">
                      <img
                        :src="lecture.photo_url"
                        :alt="`${lecture.topic_name} illustration`"
                        class="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                  
                  <!-- Lecture Details -->
                  <div class="order-2 lg:order-2 space-y-3 sm:space-y-4">
                    <div>
                      <div class="flex items-start justify-between mb-2">
                        <h4 class="text-base sm:text-lg font-semibold text-white flex items-center gap-2 flex-1">
                          <span class="w-6 h-6 bg-red-500/20 border border-red-500/50 flex items-center justify-center text-xs font-bold text-red-400">
                            {{ l_index + 1 }}
                          </span>
                          {{ lecture.topic_name }}
                        </h4>
                        <!-- Progress checkbox -->
                        <button 
                          @click="toggleLectureProgress(lecture.id)"
                          class="flex-shrink-0 ml-2"
                          :title="lectureProgress[lecture.id] ? 'Mark as incomplete' : 'Mark as complete'"
                        >
                          <Icon 
                            :name="lectureProgress[lecture.id] ? 'heroicons:check-circle' : 'heroicons:check-circle'"
                            :class="lectureProgress[lecture.id] ? 'text-green-500' : 'text-zinc-600 hover:text-green-500'"
                            class="text-xl transition-colors"
                          />
                        </button>
                      </div>
                      
                      <!-- Enhanced metadata -->
                      <div class="space-y-2">
                        <div v-if="lecture.sub_topic" class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-zinc-400 text-sm">
                          <span class="flex items-center gap-1">
                            <Icon class="text-lg" name="heroicons:book-open" /> 
                            {{ lecture.sub_topic }}
                          </span>
                          <span v-if="lecture.duration" class="flex items-center gap-1">
                            <Icon class="text-lg" name="heroicons:clock" /> 
                            {{ lecture.duration }}
                          </span>
                        </div>
                        
                        <!-- Author and date -->
                        <div v-if="lecture.auther_name || lecture.publish_date" class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-zinc-500 text-xs">
                          <span v-if="lecture.auther_name" class="flex items-center gap-1">
                            <Icon class="text-sm" name="heroicons:user" /> 
                            {{ lecture.auther_name }}
                          </span>
                          <span v-if="lecture.publish_date" class="flex items-center gap-1">
                            <Icon class="text-sm" name="heroicons:calendar" /> 
                            {{ lecture.publish_date }}
                          </span>
                          <span v-if="lecture.is_on_youtube" class="flex items-center gap-1 text-red-500">
                            <Icon class="text-sm" name="mdi:youtube" /> 
                            YouTube Available
                          </span>
                        </div>
                      </div>
                    </div>

                    <div v-if="lecture.topics?.length" class="flex flex-wrap gap-2">
                      <span
                        v-for="topic in (lecture.topics || []).slice(0, 3)"
                        :key="topic"
                        class="bg-zinc-800 hover:bg-zinc-700 text-xs px-2 py-1 border border-zinc-600 hover:border-zinc-500 transition-colors"
                      >
                        <AppLink :to="`/topics/${topic}`" class="hover:text-red-400 transition-colors">
                          #{{ topic }}
                        </AppLink>
                      </span>
                    </div>

                    <p v-if="lecture.description" class="text-zinc-300 leading-relaxed line-clamp-3">
                      {{ lecture.description }}
                    </p>
                    
                    <!-- Action buttons -->
                    <div v-if="lecture._path || lecture.slidesUrl || lecture.videoUrl" class="flex flex-wrap justify-end gap-2 pt-3">
                      <AppButton v-if="lecture._path" :to="`/articles/${$route.params.slug}/${lecture._path}`" look="secondary">
                        <Icon name="heroicons:document-text" class="text-lg mr-1" />
                        Read Article
                      </AppButton>
                      <AppButton v-if="lecture.slidesUrl" :to="lecture.slidesUrl" look="secondary" target="_blank">
                        <Icon name="heroicons:presentation-chart-bar" class="text-lg mr-1" />
                        View Slides
                      </AppButton>
                      <AppButton v-if="lecture.videoUrl && lecture.is_on_youtube" :to="lecture.videoUrl" look="secondary" target="_blank">
                        <Icon name="mdi:youtube" class="text-lg mr-1" />
                        Watch Video
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

        <!-- Optional sections -->
        <div class="mt-10 grid md:grid-cols-3 gap-6">
          <div v-if="prerequisites?.length" class="bg-zinc-800 p-6 rounded-md border border-zinc-700">
            <h3 class="text-xl font-semibold mb-3">Prerequisites</h3>
            <ul class="list-disc pl-5 text-zinc-300 space-y-1">
              <li v-for="item in prerequisites" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div v-if="outcomes?.length" class="bg-zinc-800 p-6 rounded-md border border-zinc-700">
            <h3 class="text-xl font-semibold mb-3">What you'll learn</h3>
            <ul class="list-disc pl-5 text-zinc-300 space-y-1">
              <li v-for="item in outcomes" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div v-if="audience?.length" class="bg-zinc-800 p-6 rounded-md border border-zinc-700">
            <h3 class="text-xl font-semibold mb-3">Who it's for</h3>
            <ul class="list-disc pl-5 text-zinc-300 space-y-1">
              <li v-for="item in audience" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </AppSection>

    <!-- Additional Information Section -->
    <AppSection class="bg-zinc-900 pb-8 border-t border-gray-700">
      <!-- Content Reader positioned below heading -->
      <div class="mt-8 ">
        <ClientOnly>
          <LazyContentReader :prepend="course.title" content-selector=".course-content" />
        </ClientOnly>
      </div>
      <div class="container mx-auto prose md:prose-lg lg:prose-xl text-gray-300 course-content">
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
