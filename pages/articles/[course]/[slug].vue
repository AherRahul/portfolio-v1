<script setup lang="ts">
type ParsedContent = any
import { onContentNotFound } from '~/utils/content.js'
import { parseResourcesFromContent } from '~/utils/resources'

const route = useRoute()
const router = useRouter()
const { course, slug } = route.params

const articlePath = `/articles/${course}/${slug}`

const { data: article } = await useAsyncData(`article-${course}-${slug}`, () =>
  queryContent(articlePath).findOne()
)

const { data: surroundData } = await useAsyncData(`surround-${course}-${slug}`, () =>
  queryContent(`/articles/${course}`).findSurround(articlePath)
)

const [prev, next] = surroundData.value || []

onContentNotFound(article)

useSchemaOrg([
  defineArticle({
    description: article.value?.description,
    datePublished: article.value?.datePublished,
    dateModified: article.value?.dateModified,
  })
])

const isOlderThanOneYear = computed(() => {
  if (!article.value?.dateModified) return false
  const dateModified = new Date(article.value.dateModified)
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  return dateModified < oneYearAgo
})

const formattedUpdateAt = computed(() => formatDateStringToHumanReadable(article.value?.dateModified || ''))
const formattedCreatedAt = computed(() => formatDateStringToHumanReadable(article.value?.datePublished || ''))

const linkToCurrentPage = withSiteUrl(route.path)

const links = computed(() => {
  if (!article.value) return { shareOnTwitter: '', discussOnTwitter: '', editOnGitHub: '' }
  const rawShareOnTwitter = `https://twitter.com/intent/tweet?text=I just read "${article.value.title}". Check it out!&url=${linkToCurrentPage.value}&via=rahulvijayaher`
  const shareOnTwitter = encodeURI(rawShareOnTwitter.replace(/#/g, 'No. '))
  const rawDiscussOnTwitter = `https://twitter.com/search?q=${linkToCurrentPage.value}`
  const editOnGitHub = `https://github.com/aherrahul/portfolio-v1/edit/main/content/${article.value._file}`
  return { shareOnTwitter, discussOnTwitter: encodeURI(rawDiscussOnTwitter), editOnGitHub }
})

const { addNotification } = useNotifications()
async function copyLinkToClipboard(): Promise<void> {
  await navigator.clipboard.writeText(linkToCurrentPage.value)
  addNotification({ heading: 'Link copied to clipboard', body: 'You can now paste the link anywhere you want.', iconName: 'heroicons:check-badge', iconClass: 'text-green-500', durationInMs: 2000 })
}

// ── Content theme (dark / light) ──────────────────────────────────────────────
const contentTheme = ref<'dark' | 'light'>('dark')
function toggleContentTheme() {
  contentTheme.value = contentTheme.value === 'dark' ? 'light' : 'dark'
}

function isArticle(entry?: ParsedContent): Boolean {
  return Boolean(entry?._path?.startsWith('/articles/'))
}

// ── Course awareness ──────────────────────────────────────────────────────────
const isCourseArticle = computed(() => !article.value?.showOnArticles && Boolean(article.value?.courseName))
const courseDoc = ref<any | null>(null)

watchEffect(async () => {
  if (!isCourseArticle.value) { courseDoc.value = null; return }
  const courseSlug = String(article.value?.courseName || '')
  if (!courseSlug) return
  courseDoc.value = await queryContent('/courses').where({ _path: `/courses/${courseSlug}` }).findOne()
})

const courseLectures = computed(() => {
  const arr: any[] = []
  ;(courseDoc.value?.content || []).forEach((mod: any) => {
    ;(mod.topics || []).forEach((lec: any) => arr.push({ ...lec, module_name: mod.module_name }))
  })
  return arr
})

const currentLectureIndex = computed(() =>
  courseLectures.value.findIndex(l => String(l._path) === String(slug))
)
const currentLecture = computed(() => courseLectures.value[currentLectureIndex.value])
const prevLecture = computed(() => courseLectures.value[currentLectureIndex.value - 1])
const nextLecture = computed(() => courseLectures.value[currentLectureIndex.value + 1])
const isFirstTopic = computed(() => currentLectureIndex.value <= 0)
const isLastTopic = computed(() => courseLectures.value.length ? currentLectureIndex.value >= courseLectures.value.length - 1 : false)

// ── Progress tracking ─────────────────────────────────────────────────────────
const lectureProgress = ref<Record<string, boolean>>({})

function isTopicCompleted(id: string | number) {
  return Boolean(lectureProgress.value[String(id)])
}

const isCurrentTopicCompleted = computed(() =>
  currentLecture.value ? isTopicCompleted(currentLecture.value.id) : false
)

function loadProgress() {
  if (!courseDoc.value?.title) return
  try { lectureProgress.value = JSON.parse(localStorage.getItem(`course-${courseDoc.value.title}-progress`) || '{}') } catch {}
}

watch(() => courseDoc.value, (doc) => { if (doc) loadProgress() })

function toggleMarkComplete() {
  if (!courseDoc.value?.title || !currentLecture.value?.id) return
  const key = `course-${courseDoc.value.title}-progress`
  let map: Record<string, boolean> = {}
  try { map = JSON.parse(localStorage.getItem(key) || '{}') } catch {}
  map[String(currentLecture.value.id)] = !map[String(currentLecture.value.id)]
  try { localStorage.setItem(key, JSON.stringify(map)) } catch {}
  lectureProgress.value = { ...map }
}

function goToNextTopic() {
  if (!nextLecture.value) return
  router.push(`/articles/${course}/${nextLecture.value._path}`)
}

function goToPrevTopic() {
  if (!prevLecture.value) return
  router.push(`/articles/${course}/${prevLecture.value._path}`)
}

// ── Content helpers ───────────────────────────────────────────────────────────
function extractContentText(body: any): string {
  if (!body?.children) return ''
  function extractText(node: any): string {
    if (typeof node === 'string') return node
    if (node.value) return node.value
    if (node.children) return node.children.map(extractText).join('')
    return ''
  }
  return body.children.map(extractText).join('\n')
}

const resourcesForTabs = computed(() => {
  const fmResources = (article.value as any)?.resources
  if (Array.isArray(fmResources) && fmResources.length > 0) return fmResources
  return parseResourcesFromContent(extractContentText((article.value as any)?.body || {}))
})

defineOgImageComponent('Article', {
  title: article.value?.title || '',
  topics: article.value?.topics || [],
  readingTime: article.value?.readingTime?.text,
  datePublished: formattedUpdateAt.value
})

const { setupContentImages } = useContentImages()
onMounted(() => { setupContentImages('.prose'); loadProgress() })
</script>

<template>
  <div>
    <!-- Hero -->
    <AppSection class="bg-gradient-to-b from-black to-zinc-900 !pb-4">
      <AppLinkBack v-if="!article?.showOnArticles" :to="`/courses/${article?.courseName}`">Back to course</AppLinkBack>
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

      <AppParagraph class="mt-4 mb-4" look="heading" tag="h1">
        {{ article?.title }}
      </AppParagraph>
      <div class="flex flex-col md:flex-row gap-4 md:gap-0 justify-between mt-8 hidden lg:flex">
        <div class="flex gap-3">
          <p class="mr-2">Updated at {{ formattedUpdateAt }}</p>
          <p class="mr-2"><Icon name="heroicons:clock" /> {{ article?.readingTime?.text }}</p>
          <p v-if="article?.slidesUrl">
            <AppLink class="border-b-4 border-white/75 hover:border-white transition-all pr-1 pb-1" :to="article.slidesUrl">
              <Icon name="heroicons:bookmark" /> Want to edit
            </AppLink>
          </p>
        </div>
        <ul class="flex gap-8">
          <li v-for="topic in article?.topics" :key="topic" class="bg-zinc-800 text-sm px-3 py-1 rounded-md border border-gray-700">
            <AppLink class="hover:underline" :to="`/topics/${topic}`">#{{ topic }}</AppLink>
          </li>
        </ul>
      </div>
    </AppSection>
    <AppSection class="justify-center bg-zinc-900 pb-8">
      <!-- Enhanced Course Tabs for course articles OR regular content for standalone articles -->
      <div v-if="isCourseArticle">
        <LazyCourseTabsContainer
          :topic-title="article?.title || 'Course Topic'"
          :content="extractContentText(article?.body)"
          :resources="resourcesForTabs"
          :difficulty="'medium'"
          :is-older-than-one-year="isOlderThanOneYear"
          :enable-ai-notes="currentLecture?.enable_ai_notes ?? true"
          :enable-ai-quiz="currentLecture?.enable_ai_quiz ?? true"
          :content-theme="contentTheme"
        />
      </div>
      
      <!-- Regular article content for standalone articles -->
      <div v-else class="article-content">
        <ArticleAgeWarning v-if="isOlderThanOneYear" />
        <ContentDoc class="prose md:prose-lg lg:prose-xl" :class="isOlderThanOneYear ? 'pt-8' : 'pt-4'" />
      </div>

      <div v-if="article" class="mt-16 md:mt-32">
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
          <p v-if="article?.datePublished !== article?.dateModified"
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

    <!-- Related articles -->
    <AppSection>
      <div v-if="isCourseArticle && courseLectures.length" class="flex flex-col gap-8 justify-between mt-16 md:flex-row md:gap-32 md:mt-24">
        <LazyArticlePreview v-if="isArticle(prev)" :article="(prev as any)" />
        <LazyArticlePreview v-if="isArticle(next)" :article="(next as any)" />
      </div>
    </AppSection>

    <div
      v-if="isCourseArticle && courseDoc"
      class="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur border-t border-zinc-700 px-4 py-2.5"
      style="display: grid; grid-template-columns: 1fr auto 1fr;"
    >
      <!-- Prev topic (col 1 – left aligned) -->
      <div class="flex items-center">
        <button
          @click="goToPrevTopic"
          :disabled="isFirstTopic"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          :class="isFirstTopic ? 'text-zinc-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'"
        >
          <Icon name="heroicons:chevron-left" class="text-base flex-shrink-0" />
          <span class="hidden sm:inline max-w-[150px] truncate">{{ prevLecture?.topic_name || 'Previous' }}</span>
        </button>
      </div>

      <!-- Center actions (col 2 – always centred) -->
      <div class="flex items-center gap-2">
        <!-- Mark as complete toggle -->
        <button
          @click="toggleMarkComplete"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all duration-150"
          :class="isCurrentTopicCompleted
            ? 'bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30'
            : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-green-500 hover:text-green-400'"
        >
          <Icon name="heroicons:check-circle" class="text-base" />
          <span class="hidden sm:inline">{{ isCurrentTopicCompleted ? 'Completed ✓' : 'Mark as Complete' }}</span>
        </button>

        <!-- Theme toggle -->
        <button
          @click="toggleContentTheme"
          :title="contentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          :aria-label="contentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-200"
          :class="contentTheme === 'dark'
            ? 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:text-amber-300 hover:border-amber-400'
            : 'bg-amber-950/40 border-amber-700 text-amber-300 hover:border-amber-500'"
        >
          <Icon
            :name="contentTheme === 'dark' ? 'heroicons:sun' : 'heroicons:moon'"
            class="text-base"
          />
          <span class="hidden sm:inline">{{ contentTheme === 'dark' ? 'Light' : 'Dark' }}</span>
        </button>

        <!-- Share -->
        <button
          @click="copyLinkToClipboard"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all duration-150"
          title="Copy link"
        >
          <Icon name="heroicons:link" class="text-base" />
          <span class="hidden sm:inline">Share</span>
        </button>
      </div>

      <!-- Next topic (col 3 – right aligned) -->
      <div class="flex items-center justify-end">
        <button
          @click="goToNextTopic"
          :disabled="isLastTopic"
          class="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          :class="isLastTopic ? 'text-zinc-500 bg-zinc-800 border border-zinc-700' : 'text-white bg-red-600 hover:bg-red-500'"
        >
          <span class="hidden sm:inline max-w-[150px] truncate">{{ nextLecture?.topic_name || 'Next' }}</span>
          <Icon name="heroicons:chevron-right" class="text-base flex-shrink-0" />
        </button>
      </div>
    </div>

  </div>
</template>