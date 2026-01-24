<script setup lang="ts">
import { provideUseId } from '@headlessui/vue'
provideUseId(() => useId())

const route = useRoute()

// Check if current route is an admin route
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

useAppSeo()
useSiteNotifications()

function useAppSeo() {
  const isDark = useDark()
  const favicon = computed(() => `/img/logo/glyph-${isDark.value ? 'white' : 'black'}-colored.svg`)

  useServerHead({
    bodyAttrs: {
      class: 'bg-black antialiased min-h-screen text-white'
    },
  })

  useHead({
    titleTemplate: (c) => c ? `${c} - Rahul Aher` : 'Rahul Aher - Software Engineer (SDE-II)',
    link: [
      { rel: 'icon', href: favicon, type: "image/svg+xml" },
    ],
  })

  useSchemaOrg([
    definePerson({
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'India',
        addressLocality: 'Mumbai, Maharastra',
        addressRegion: 'Ambernath, Thane',
        postalCode: 'abc',
        streetAddress: 'Ambernath'
      },
      name: 'Rahul Aher',
      image: '/img/me@2x.jpg',
      email: 'mailto:rahulvijayaher@gmail.com',
      nationality: "Indian",
      jobTitle: 'Software Engineer and Web Engineering Consultant',
      url: 'https://rahulaher.netlify.app',
      sameAs: [
        ...Object.values(SOCIALS),
      ]
    }),
    defineWebSite(),
    defineWebPage()
  ])

  useServerSeoMeta({
    author: 'Rahul Aher',
    ogSiteName: 'https://rahulaher.netlify.app',
  })

  const styleConfig = {
    hideEventTypeDetails: false,
    layout: "month_view"
  }

  // Cal.com
  // TODO: Defer loading later on but store clicks in the meantime
  useHead({
    script: [
      {
        key: 'cal',
        innerHTML: `
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", {origin:"https://cal.com"});
Cal("ui", ${JSON.stringify(styleConfig)});
`,
      }
    ]
  })
}

function useSiteNotifications() {
  const { addNotification } = useNotifications()

  onMounted(async () => {
    const result = onDicsordRef()
    if (result) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    onUserSpeaksHindi()
  })

  function onDicsordRef(): Boolean {
    const isDicsordDomain = route.query?.ref === 'dicsord.com'
    if (!isDicsordDomain) {
      return false
    }

    addNotification({
      heading: 'You should double check the URL 😛',
      body: [
        { type: 'text', text: 'Did you want to go to ' },
        { type: 'link', href: 'https://discord.com/' },
        { type: 'text', text: ' instead?' },
      ]
    })
    return true
  }

  function onUserSpeaksHindi(): Boolean {
    const doesSpeakHindi = navigator.languages.some(lang => lang.startsWith('hi'))
    if (!doesSpeakHindi) {
      return false
    }

    const didUserSeeHindiNotificationAlready = localStorage.getItem(LOCALSTORAGE_KEYS.notificationHindi)
    if (didUserSeeHindiNotificationAlready) {
      return false
    }

    addNotification({
      heading: 'I also speak Hindi!',
      body: 'All projects and talks can also be held in Hindi.',
      onRemove() {
        localStorage.setItem(LOCALSTORAGE_KEYS.notificationHindi, 'true')
      }
    })

    return true
  }
}
</script>

<template>
  <div class="bg-black antialiased min-h-screen text-white">
    <AppNavbar v-if="!isAdminRoute" />
    <div :class="isAdminRoute ? '' : 'mt-8'">
      <NuxtPage />
    </div>
    <!-- Gradient "hack" for icons -->
    <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
      <linearGradient id="gradient-svg-icon" x2="1" y2="1">
        <stop offset="0" style="stop-color:#F20500" />
        <stop offset="2.272730e-04" style="stop-color:#F20500" />
        <stop offset="1" style="stop-color:#D90575" />
      </linearGradient>
    </svg>
    <LazyAppFooter v-if="!isAdminRoute" />
    <LazyAppNotificationArea v-if="!isAdminRoute" />
    <ClientOnly>
      <ImageModal />
    </ClientOnly>
  </div>
</template>

<style lang="pcss">

::selection {
  @apply bg-red-500/25;
}

/* TODO: Move to ProseCode component? */
.line {
  display: inline-table;
  @apply -mx-8 px-8;
}


.line.highlight {
  @apply bg-white/5;
}

p {
    /* text-align: justify; */
}



</style>
