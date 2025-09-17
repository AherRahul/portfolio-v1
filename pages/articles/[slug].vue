<script setup lang="ts">
// Using loose typing to avoid build-time type resolution issues in dev
type ParsedContent = any;
import { joinURL } from 'ufo'
import { onContentNotFound } from '~/utils/content.js';
import { parseResourcesFromContent } from '~/utils/resources';

const { page: article, next, prev } = useContent()
const router = useRouter()
import { queryContent } from '#imports'

onContentNotFound(article)

// TODO: Do we need this here?
// useSeoMeta({
//   title: () => article.value.title,
//   description: () => article.value.description,
// })

useSchemaOrg([
  defineArticle({
    description: article.value.description,
    datePublished: article.value.datePublished,
    dateModified: article.value.dateModified,
  })
])

const isOlderThanOneYear = computed(() => {
  const dateModified = new Date(article.value.dateModified)

  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  return dateModified < oneYearAgo
})

const formattedUpdateAt = computed(() => formatDateStringToHumanReadable(article.value.dateModified))
const formattedCreatedAt = computed(() => formatDateStringToHumanReadable(article.value.datePublished))

const route = useRoute()
const linkToCurrentPage = withSiteUrl(route.path)

const links = computed(() => {
  const rawShareOnTwitter = `https://twitter.com/intent/tweet?text=I just read "${article.value.title}". Check it out!&url=${linkToCurrentPage.value}&via=rahulvijayaher`
  const shareOnTwitter = encodeURI(rawShareOnTwitter.replace(/#/g, 'No. '))

  const rawDiscussOnTwitter = `https://twitter.com/search?q=${linkToCurrentPage.value}`

  const editOnGitHub = `https://github.com/aherrahul/portfolio-v1/edit/main/content/${article.value._file}`
  return {
    shareOnTwitter,
    discussOnTwitter: encodeURI(rawDiscussOnTwitter),
    editOnGitHub
  }
})


const { addNotification } = useNotifications()
async function copyLinkToClipboard(): Promise<void> {
  await navigator.clipboard.writeText(linkToCurrentPage.value);
  addNotification({
    heading: 'Link copied to clipboard',
    body: 'You can now paste the link anywhere you want.',
    iconName: 'heroicons:check-badge',
    iconClass: 'text-green-500',
    durationInMs: 2000,
  })
}

// TODO: This should not be necessary. `surround` is buggy?
function isArticle(entry?: ParsedContent): Boolean {
  return Boolean(entry?._path?.startsWith('/articles/'))
}

defineOgImageComponent('Article', {
  title: article.value.title,
  topics: article.value.topics,
  readingTime: article.value.readingTime.text,
  datePublished: formattedUpdateAt.value
})

// --- Course-aware navigation (only when article belongs to a course) ---
const isCourseArticle = computed(() => !article.value.showOnArticles && Boolean(article.value.courseName))

const courseDoc = ref<any | null>(null)

watchEffect(async () => {
  if (!isCourseArticle.value) {
    courseDoc.value = null
    return
  }
  const slug = String(article.value.courseName || '')
  if (!slug) return
  const doc = await queryContent('/courses').where({ _path: `/courses/${slug}` }).findOne()
  courseDoc.value = doc
})

const courseLectures = computed(() => {
  const arr: any[] = []
  const modules: any[] = courseDoc.value?.content || []
  modules.forEach((mod: any) => {
    (mod.topics || []).forEach((lec: any) => {
      arr.push({ ...lec, module_name: mod.module_name })
    })
  })
  return arr
})

const currentLectureIndex = computed(() => {
  const slug = String(article.value._path || '').split('/').pop()
  return courseLectures.value.findIndex(l => String(l._path) === slug)
})

const currentLecture = computed(() => courseLectures.value[currentLectureIndex.value])
const prevLecture = computed(() => courseLectures.value[currentLectureIndex.value - 1])
const nextLecture = computed(() => courseLectures.value[currentLectureIndex.value + 1])

function markComplete() {
  if (!courseDoc.value?.title || !currentLecture.value?.id) return
  const key = `course-${courseDoc.value.title}-progress`
  let map: Record<string, boolean> = {}
  try { map = JSON.parse(localStorage.getItem(key) || '{}') } catch {}
  map[String(currentLecture.value.id)] = true
  try { localStorage.setItem(key, JSON.stringify(map)) } catch {}
}

function goToNextTopic() {
  const n = nextLecture.value
  if (!n) return
  markComplete()
  router.push(`/articles/${n._path}`)
}

function goToPrevTopic() {
  const p = prevLecture.value
  if (!p) return
  router.push(`/articles/${p._path}`)
}

// Helpful booleans to disable/hide navigation at bounds
const isFirstTopic = computed(() => currentLectureIndex.value <= 0)
const isLastTopic = computed(() => courseLectures.value.length ? currentLectureIndex.value >= courseLectures.value.length - 1 : false)

// Content extraction functions for tabs
function extractContentText(body: any): string {
  if (!body?.children) return ''
  
  function extractText(node: any): string {
    if (typeof node === 'string') return node
    if (node.value) return node.value
    if (node.children) {
      return node.children.map(extractText).join('')
    }
    return ''
  }
  
  return body.children.map(extractText).join('\n')
}

function extractResources(body: any): any[] {
  const contentText = extractContentText(body)
  return parseResourcesFromContent(contentText)
}

// Prefer frontmatter resources if present; fallback to parsing content
const resourcesForTabs = computed(() => {
  const fmResources = (article.value as any)?.resources
  if (Array.isArray(fmResources) && fmResources.length > 0) {
    return fmResources
  }
  return extractResources((article.value as any).body)
})
</script>
<template>
  <div>
    <AppSection class="bg-gradient-to-b from-black to-zinc-900 !pb-4">  
      <AppLinkBack v-if="!article.showOnArticles" :to="`/courses/${article.courseName}`">Back to course</AppLinkBack>
      <AppLinkBack v-else to="/articles/">All articles</AppLinkBack>
      <ParagraphDecoration class="mt-4" />

      <!-- Course navigation (top) -->
      <div v-if="isCourseArticle && courseLectures.length" class="flex items-center justify-between mb-8 mt-8">
        <AppButton look="secondary" :disabled="isFirstTopic" @click="goToPrevTopic">
          <Icon name="heroicons:chevron-left" class="mr-1"/> Previous topic
        </AppButton>
        <AppButton :disabled="isLastTopic" @click="goToNextTopic">
          Next topic <Icon name="heroicons:chevron-right" class="ml-1"/>
        </AppButton>
      </div>

      <AppParagraph class="mt-4" look="heading" tag="h1">
        {{ article.title }}
      </AppParagraph>
      <div class="flex flex-col md:flex-row gap-4 md:gap-0 justify-between mt-8">
        <div class="flex gap-3">
          <p class="mr-2">Updated at {{ formattedUpdateAt }}</p>
          <p class="mr-2"><Icon name="heroicons:clock" /> {{ article.readingTime.text }}</p>
          <p v-if="article.slidesUrl">
            <AppLink class="border-b-4 border-white/75 hover:border-white transition-all pr-1 pb-1" :to="article.slidesUrl">
              <Icon name="heroicons:bookmark" /> Want to edit 
            </AppLink>
          </p>
        </div>
        <ul class="flex gap-8">
          <li v-for="topic in article.topics" class="bg-zinc-800 text-sm px-3 py-1 rounded-md border border-gray-700">
            <AppLink class="hover:underline" :to="`/topics/${topic}`">#{{ topic }}</AppLink>
          </li>
        </ul>
      </div>
    </AppSection>
    <AppSection class="justify-center bg-zinc-900 pb-8">
      <!-- Enhanced Course Tabs for course articles OR regular content for standalone articles -->
      <div v-if="isCourseArticle">
        <LazyCourseTabsContainer 
          :topic-title="article.title || 'Course Topic'"
          :content="extractContentText(article.body)"
          :resources="resourcesForTabs"
          :difficulty="'medium'"
          :is-older-than-one-year="isOlderThanOneYear"
        />
      </div>
      
      <!-- Regular article content for standalone articles -->
      <div v-else>
        <ArticleAgeWarning v-if="isOlderThanOneYear" />
        <ContentDoc class="prose md:prose-lg lg:prose-xl" :class="isOlderThanOneYear ? 'pt-8' : 'pt-4'" />
      </div>

      <div class="mt-16 md:mt-32">
        <div class="flex flex-col md:flex-row justify-between items-center gap-y-2 md:gap-0 mt-2">
          <div class="order-1">
            <AppLink
              class="text-red-400 underline decoration-red-400/30 font-semibold transition-all duration-150 hover:decoration-red-400 inline-block"
              :to="links.shareOnTwitter">
              Tweet this article
            </AppLink> &bull;
            <button
              class="text-red-400 underline decoration-red-400/30 font-semibold transition-all duration-150 hover:decoration-red-400 inline-block"
              @click="copyLinkToClipboard">
              Copy link
            </button>
          </div>
          <p v-if="article.datePublished !== article.dateModified"
            class="order-4 md:order-2 text-sm md:inline text-zinc-300">
            Originally published at {{ formattedCreatedAt }}
          </p>
          <div class="order-3">
            <AppLink
              class="text-red-400 underline decoration-red-400/30 font-semibold transition-all duration-150 hover:decoration-red-400 inline-block"
              :to="links.discussOnTwitter">
              Discuss on <span class="line-through">Twitter</span> X
            </AppLink> &bull;
            <AppLink
              class="text-red-400 underline decoration-red-400/30 font-semibold transition-all duration-150 hover:decoration-red-400 inline-block"
              :to="links.editOnGitHub">
              Edit on GitHub
            </AppLink>
          </div>
        </div>
      </div>
      
      <!-- Course navigation (bottom) -->
      <div v-if="isCourseArticle && courseLectures.length" class="flex items-center justify-between mt-8 mb-8">
        <AppButton look="secondary" :disabled="!prevLecture" @click="goToPrevTopic">
          <Icon name="heroicons:chevron-left" class="mr-1"/> Previous topic
        </AppButton>
        <AppButton :disabled="!nextLecture" @click="goToNextTopic">
          Next topic <Icon name="heroicons:chevron-right" class="ml-1"/>
        </AppButton>
      </div>

      <div
        class="flex flex-col md:flex-row gap-8 justify-center md:justify-start items-center mt-4 pt-8 md:pt-16 border-t border-t-gray-500/50">
        <div class="shrink-0">
          <img class="rounded-full mx-auto" width="192" height="192" src="/img/me@2x.jpg"
            alt="Photo of Rahul Aher">
        </div>
        <div class="col-span-4 text-center md:text-left">
          <h4 class="font-medium text-lg">Written by Rahul Aher</h4>
          <p class="max-w-xl text-lg mt-4 text-gray-400">
            I'm Rahul, <b>Sr. Software Engineer (SDE II)</b> and passionate content creator. 
            Sharing my expertise in software development to assist learners.
          </p>
          <AppLink to="/about/" class="underline hover:no-underline mt-2 inline-block">More about me</AppLink>
        </div>
      </div>
    </AppSection>
    
    <AppSection>
      <div v-if="isCourseArticle && courseLectures.length" class="flex flex-col gap-8 justify-between mt-16 md:flex-row md:gap-32 md:mt-24">
        <LazyArticlePreview v-if="isArticle(prev)" :article="(prev as any)" />
        <LazyArticlePreview v-if="isArticle(next)" :article="(next as any)" />
      </div>
    </AppSection>

    
  </div>
</template>
