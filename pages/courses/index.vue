<script setup lang="ts">
import type { Course } from '~/types.js';
// import courseContent from '../../content/courses/content-list/courses-list.json';

definePageMeta({
  documentDriven: false
})

const title = 'Courses'
const description = 'Want to upgrade your team\'s skills? I offer various courses on NodeJS, JAVA, Spring, Spring-boot, JavaScript, Web Development, Performance, Clean Code and more. Take a look at the list below or contact me for a custom course!'

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('Course')

// Filters & sorting state
const searchTerm = ref('')
const selectedLanguage = ref<'all' | string>('all')
const onlyVideo = ref(false)
const sortBy = ref<'featured' | 'az' | 'za'>('featured')

// Fetch all courses metadata to populate language options
const { data: allCourses } = await useAsyncData('all-courses-meta', () =>
  queryContent('/courses')
    .only(['languages'])
    .without(['body', 'excerpt'])
    .find()
)

const availableLanguages = computed<string[]>(() => {
  const set = new Set<string>()
  for (const c of allCourses.value || []) {
    const langs = Array.isArray(c.languages) ? c.languages : []
    for (const lang of langs) {
      if (typeof lang === 'string' && lang.trim()) set.add(lang)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

// Build dynamic query for ContentList
const query = computed(() => {
  const and: any[] = []
  const term = searchTerm.value.trim()
  if (term) {
    and.push({ $or: [
      { title: { $contains: term } },
      { description: { $contains: term } },
    ]})
  }
  if (selectedLanguage.value !== 'all') {
    and.push({ languages: { $contains: selectedLanguage.value } })
  }
  if (onlyVideo.value) {
    and.push({ video: true })
  }

  const sort =
    sortBy.value === 'az' ? [{ title: 1 as 1 }] :
    sortBy.value === 'za' ? [{ title: -1 as -1 }] : undefined

  // Always filter to published courses only for public view
  and.push({ published: true })

  return {
    path: '/courses',
    without: ['body', 'excerpt'],
    where: and.length ? and : undefined,
    sort
  }
})

// Additional client-side filter for robust, case-insensitive search over more fields
function filterClient(items: any[]): any[] {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return items
  const tokens = term.split(/\s+/).filter(Boolean)
  return items.filter((c) => {
    const haystacks: string[] = []
    if (typeof c.title === 'string') haystacks.push(c.title.toLowerCase())
    if (typeof c.description === 'string') haystacks.push(c.description.toLowerCase())
    if (Array.isArray(c.languages)) haystacks.push(c.languages.join(' ').toLowerCase())
    if (Array.isArray(c.topics)) haystacks.push(c.topics.join(' ').toLowerCase())
    // Optional extra fields
    if (typeof c.level === 'string') haystacks.push(c.level.toLowerCase())
    const blob = haystacks.join(' | ')
    return tokens.every(t => blob.includes(t))
  })
}
</script>
<template>
  <AppSection>
    <!-- <AppLinkBack class="mt-16" to="/services/">Go back to services</AppLinkBack> -->
    <ParagraphDecoration class="mt-2" />
    <AppParagraph class="mt-1"  tag="h1" look="heading">Courses</AppParagraph>
    <AppParagraph class="max-w-3xl mt-8" look="subParagraph">
      I am deeply committed to the ethos of perpetual learning, recognizing it as the cornerstone of personal and 
      professional growth. In my journey, I embrace an immersive approach to knowledge acquisition, where I not only
       absorb new concepts but actively integrate them into tangible, real-world courses. This dynamic fusion between 
       theory and practice serves as the crucible where my understanding is honed and fortified. 
    </AppParagraph>
    <!-- Filters & search -->
    <!-- <div class="mt-8 bg-zinc-900/60 rounded-md p-4 border border-zinc-800 hidden lg:block">
      <div class="grid md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-zinc-300 mb-1">Search</label>
          <input v-model="searchTerm" type="text" placeholder="Search title or description"
            class="w-full min-w-0 appearance-none border-0 bg-white/5 px-3 py-2 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-pink-500 sm:text-sm rounded-md" />
        </div>
        <div>
          <label class="block text-sm text-zinc-300 mb-1">Language</label>
          <select v-model="selectedLanguage"
            class="w-full min-w-0 appearance-none border-0 bg-white/5 px-3 py-2 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-pink-500 sm:text-sm rounded-md [&>option]:bg-zinc-800 [&>option]:text-white">
            <option value="all">All languages</option>
            <option v-for="lang in availableLanguages" :key="lang" :value="lang">{{ lang }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-zinc-300 mb-1">Format</label>
          <div class="flex items-center h-[38px]">
            <label class="inline-flex items-center gap-2 text-zinc-300">
              <input v-model="onlyVideo" type="checkbox" class="rounded border-zinc-700 bg-white/5 text-pink-600 focus:ring-pink-500" />
              <span>Video only</span>
            </label>
          </div>
        </div>
        <div>
          <label class="block text-sm text-zinc-300 mb-1">Sort</label>
          <select v-model="sortBy"
            class="w-full min-w-0 appearance-none border-0 bg-white/5 px-3 py-2 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-pink-500 sm:text-sm rounded-md [&>option]:bg-zinc-800 [&>option]:text-white">
            <option value="featured">Featured</option>
            <option value="az">Title A–Z</option>
            <option value="za">Title Z–A</option>
          </select>
        </div>
      </div>
    </div> -->
    <div class="flex flex-col gap-6 mt-8">
      <ContentList :query="query" v-slot="{ list }">
        <template v-if="filterClient(list).length">
          <CoursePreview v-for="entry in filterClient(list)" :key="entry._path" :course="(entry as Course)" />
        </template>
        <div v-else class="col-span-full text-zinc-300">
          No courses found. Try adjusting your filters.
        </div>
      </ContentList>
    </div>
  </AppSection>
</template>
