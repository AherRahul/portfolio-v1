<script setup lang="ts">
import type { Course } from '~/types.js';

definePageMeta({
  documentDriven: false
})

const title = 'Courses'
const description = 'High-performance engineering courses for developers. From Node.js internals to large-scale System Design and behavioral mastery.'

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('Course')

// Fetch all courses
const { data: courses } = await useAsyncData('all-courses', () =>
  queryContent('/courses')
    .where({ published: true })
    .without(['body', 'excerpt'])
    .sort({ title: 1 })
    .find()
)

const CATEGORIES = {
  INTERVIEW: ['interview', 'roadmap', 'behavioral', 'concurrency', 'dsa', 'placement', 'hiring'],
  LANGUAGES: ['javascript', 'java', 'nodejs', 'typescript', 'python', 'go', 'cpp', 'csharp'],
  TOOLS: ['git', 'aws', 'react', 'spring', 'docker', 'kubernetes', 'npm', 'cloud', 'mongodb', 'postgresql', 'redis'],
}

// Logic to check if a course matches a category based on topics
const matches = (course: any, keywords: string[]) => {
  return course.topics?.some((t: string) => 
    keywords.some(k => t.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(t.toLowerCase()))
  )
}

// Priority: 1. Languages (if it's a core language course) -> 2. Interview -> 3. Tools -> 4. Skills
const languageCourses = computed(() => {
  return courses.value?.filter(c => matches(c, CATEGORIES.LANGUAGES)) || []
})

const interviewCourses = computed(() => {
  return courses.value?.filter(c => 
    !languageCourses.value.find(lc => lc._path === c._path) &&
    matches(c, CATEGORIES.INTERVIEW)
  ) || []
})

const toolCourses = computed(() => {
  return courses.value?.filter(c => 
    !languageCourses.value.find(lc => lc._path === c._path) &&
    !interviewCourses.value.find(ic => ic._path === c._path) &&
    matches(c, CATEGORIES.TOOLS)
  ) || []
})

const skillCourses = computed(() => {
  return courses.value?.filter(c => 
    !languageCourses.value.find(lc => lc._path === c._path) &&
    !interviewCourses.value.find(ic => ic._path === c._path) &&
    !toolCourses.value.find(tc => tc._path === c._path)
  ) || []
})
</script>

<template>
  <div class="min-h-screen bg-black overflow-x-hidden">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-zinc-950 pt-10 pb-12 lg:pt-12 lg:pb-32 border-b border-zinc-900">
      <AppSection>
        <div class="max-w-4xl">
          <div class="flex items-center gap-2 mb-4 lg:mb-6">
            <span class="h-px w-8 bg-red-600"></span>
            <span class="text-[10px] lg:text-xs font-bold uppercase tracking-[0.3em] text-red-500">Learning Path</span>
          </div>
          <h1 class="text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter text-white mb-6 lg:mb-8 uppercase">
            Master Your <span class="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-600">Craft</span>
          </h1>
          <p class="text-lg lg:text-xl leading-relaxed text-zinc-400 max-w-2xl font-medium mb-10 lg:mb-12">
            High-performance engineering courses for developers who want to go deeper. 
            From Node.js internals to large-scale System Design and behavioral mastery.
          </p>
          <div class="flex">
            <AppButton to="#start-learning" class="px-8 py-4 lg:px-10 lg:py-5 text-xs lg:text-sm font-black uppercase tracking-[0.2em] rounded-none">
              Explore Courses
              <Icon name="heroicons:arrow-small-down-20-solid" class="ml-3 text-xl" />
            </AppButton>
          </div>
        </div>
      </AppSection>
    </div>

    <!-- Content Section -->
    <div id="start-learning" class="relative z-10 py-16 lg:py-24 bg-black">
      <AppSection>
        
        <!-- 1. Language Based (Core) -->
        <div v-if="languageCourses.length" class="mb-20 lg:mb-32">
          <div class="flex items-center gap-4 mb-10 lg:mb-16">
            <div class="flex flex-col">
              <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-1">Core Foundations</span>
              <h2 class="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white">
                Language <span class="text-red-600">Based</span>
              </h2>
            </div>
            <div class="h-px flex-1 bg-zinc-900 mt-6 lg:mt-8"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            <CoursePreview 
              v-for="entry in languageCourses" 
              :key="entry._path" 
              :course="(entry as Course)" 
            />
          </div>
        </div>

        <!-- 2. Interview Prep -->
        <div v-if="interviewCourses.length" class="mb-20 lg:mb-32">
          <div class="flex items-center gap-4 mb-10 lg:mb-16">
            <div class="flex flex-col">
              <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-1">Success Path</span>
              <h2 class="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white">
                Interview <span class="text-red-600">Mastery</span>
              </h2>
            </div>
            <div class="h-px flex-1 bg-zinc-900 mt-6 lg:mt-8"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            <CoursePreview 
              v-for="entry in interviewCourses" 
              :key="entry._path" 
              :course="(entry as Course)" 
            />
          </div>
        </div>

        <!-- 3. Tool Based -->
        <div v-if="toolCourses.length" class="mb-20 lg:mb-32">
          <div class="flex items-center gap-4 mb-10 lg:mb-16">
            <div class="flex flex-col">
              <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-1">Developer Toolbox</span>
              <h2 class="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white">
                Tool <span class="text-red-600">Based</span>
              </h2>
            </div>
            <div class="h-px flex-1 bg-zinc-900 mt-6 lg:mt-8"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            <CoursePreview 
              v-for="entry in toolCourses" 
              :key="entry._path" 
              :course="(entry as Course)" 
            />
          </div>
        </div>

        <!-- 4. Pure Skill/Engineering Based -->
        <div v-if="skillCourses.length" class="pb-16 lg:pb-24">
          <div class="flex items-center gap-4 mb-10 lg:mb-16">
            <div class="flex flex-col">
              <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-1">Engineering Excellence</span>
              <h2 class="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white">
                Professional <span class="text-red-600">Skills</span>
              </h2>
            </div>
            <div class="h-px flex-1 bg-zinc-900 mt-6 lg:mt-8"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            <CoursePreview 
              v-for="entry in skillCourses" 
              :key="entry._path" 
              :course="(entry as Course)" 
            />
          </div>
        </div>

      </AppSection>
    </div>
  </div>
</template>
