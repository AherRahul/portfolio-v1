<script setup lang="ts">
const navigation = {
  content: [
    { name: 'Articles', to: '/articles/' },
    { name: 'Learnings', to: '/learning/' },
  ],
  general: [
    { name: 'About', to: '/about/' },
    // { name: 'My equipment', to: '/uses/' },
    // { name: 'Sponsors', to: '/sponsors/' },
    { name: 'Topics', to: '/topics/' }
  ],
  services: [
    { name: 'Consulting', to: '/consulting/' },
    { name: 'Projects', to: '/projects/' },
    { name: 'Courses', to: '/courses/' },
    { name: 'Npm Packages', to: '/npmpackages/' },
  ],
  contact: [
    { name: 'Contact me', to: '/contact/' },
  ],
  social: [
    {
      name: 'X',
      href: SOCIALS.twitter,
      icon: 'ri:twitter-x-fill',
      hoverClass: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      href: SOCIALS.github,
      icon: 'mdi:github',
      hoverClass: 'hover:text-gray-200'
    },
    {
      name: 'YouTube',
      href: SOCIALS.youtube,
      icon: 'mdi:youtube',
      hoverClass: 'hover:text-red-500'
    },
    {
      name: 'LinkedIn',
      href: SOCIALS.linkedin,
      icon: 'mdi:linkedin',
      hoverClass: 'hover:text-blue-500'
    },
    {
      name: 'Gmail',
      href: SOCIALS.gmail,
      icon: 'mdi:gmail',
      hoverClass: 'hover:text-blue-500'
    },
  ],
}

type NewsletterState = 'initial' | 'loading' | 'error' | 'confirmation-mail-sent'
const state = ref<NewsletterState>('initial')
const form = ref({
  name: '',
  email: ''
})

const { addNotification } = useNotifications() 

async function subscribeToNewsletter() {
  if(state.value === 'loading') {
    return
  }
  
  state.value = 'loading'
  const { name, email } = form.value
  try {
    await $fetch('https://script.google.com/macros/s/AKfycbx4jemRUN32qS4nCOoES2bUyk3006GtqNPRRc62Iowi0eTKhocmA6EacDBItUQwyA9k/exec', {
      method: 'POST',
      body: { name, email },
      muteHttpExceptions: true,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    })
    state.value = 'confirmation-mail-sent'
    addNotification({
      heading: 'Almost done!',
      body: 'Thanks for subscribing to my newsletter! 🎉 Please confirm your email now!',
      iconName: 'heroicons:check-badge',
      iconClass: 'text-green-500',
      durationInMs: 10000,
    })
    form.value = { name: '', email: '' }
  } catch (error) {
    // TODO: Better error handling
    // @ts-expect-error Better type checking needed but too lazy on stream. Sorry
    const body = error?.data?.message ?? error.message
    addNotification({
      heading: 'Something went wrong!',
      body,
      iconName: 'heroicons:exclamation-circle',
      iconClass: 'text-red-500',
      durationInMs: 10000,
    })
    console.error(error)
    state.value = 'error'
  }
}
</script>
<template>
  
  <div class="flex items-center justify-end" >
      <span class="border-b border-dashed border-gray-500" style="width: 100%;" />
  </div>
  <footer  aria-labelledby="footer-heading" style="background-color: rgb(33 33 33);">
    <h2 id="footer-heading" class="sr-only">Footer</h2>
    <div class="mx-auto max-w-7xl px-6 pb-8 pt-8 sm:pt-16 lg:px-8 xl:pt-32">
      <div class="xl:grid xl:grid-cols-4 xl:gap-8">
        <img loading="lazy" width="256" height="183" class="hidden xl:block xl:pr-16"
          src="/img/logo/glyph-and-word-white-colored.svg" alt="">
        <img loading="lazy" width="256" height="96" class="md:mx-auto xl:hidden" src="/img/logo/word-white-colored.svg"
          alt="">
        <div class="grid grid-cols-2 gap-8 xl:col-span-3 pt-16 xl:pt-0">
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold leading-6 text-white">Content</h3>
              <ul role="list" class="mt-6 space-y-4">
                <li v-for="item in navigation.content" :key="item.name">
                  <AppLink :to="item.to" class="text-sm leading-6 text-gray-300 hover:text-white">{{ item.name }}
                  </AppLink>
                </li>
              </ul>
            </div>
            <div class="mt-10 md:mt-0">
              <h3 class="text-sm font-semibold leading-6 text-white">General</h3>
              <ul role="list" class="mt-6 space-y-4">
                <li v-for="item in navigation.general" :key="item.name">
                  <AppLink :href="item.to" class="text-sm leading-6 text-gray-300 hover:text-white">{{ item.name }}
                  </AppLink>
                </li>
              </ul>
            </div>
          </div>
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold leading-6 text-white">Services</h3>
              <ul role="list" class="mt-6 space-y-4">
                <li v-for="item in navigation.services" :key="item.name">
                  <AppLink :href="item.to" class="text-sm leading-6 text-gray-300 hover:text-white">{{ item.name }}
                  </AppLink>
                </li>
              </ul>
            </div>
            <div class="mt-10 md:mt-0">
              <h3 class="text-sm font-semibold leading-6 text-white">Contact</h3>
              <ul role="list" class="mt-6 space-y-4">
                <li v-for="item in navigation.contact" :key="item.name">
                  <AppLink :to="item.to" class="text-sm leading-6 text-gray-300 hover:text-white">{{ item.name }}
                  </AppLink>
                </li>
                <li>
                  <AppMeetingButtonWrapper meeting="intro-website">
                    <button class="text-sm leading-6 text-gray-300 hover:text-white">
                      Schedule meeting
                    </button>
                  </AppMeetingButtonWrapper>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 lg:flex lg:items-center lg:justify-between">
        <div>
          <h3 class="text-sm font-semibold leading-6 text-white">
            <template v-if="state === 'initial'">
              Subscribe to my newsletter
            </template>
            <template v-else-if="state === 'loading'">
              Subscribing to my newsletter...
            </template>
            <template v-else-if="state === 'error'">
              Something went wrong!
            </template>
            <template v-else-if="state === 'confirmation-mail-sent'">
              Almost done!
            </template>
          </h3>
          <p v-if="state === 'loading'" class="mt-2 text-sm leading-6 text-gray-300">
            Please wait...
          </p>
          <p v-else class="mt-2 text-sm leading-6 text-gray-300">
            Get a recap of the latest news, articles, videos and resources,
            sent to your inbox every two weeks.</p>
        </div>
        <form id="newsletter" @submit.prevent="subscribeToNewsletter" class="mt-6 sm:flex sm:max-w-md lg:mt-0">
          <label for="email-address" class="sr-only">Email address</label>
          <input v-model="form.name" type="text" name="name" id="firstname" required
            class="w-full min-w-0 appearance-none border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-pink-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full mr-2"
            placeholder="First name" />
          <br>
          <input v-model="form.email" type="email" name="email-address" id="email-address" autocomplete="email" required
            class="w-full min-w-0 appearance-none border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-pink-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full mt-2 sm:mt-0"
            placeholder="Email" />
          <div class="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
            <AppButton type="submit" look="primary">
              Subscribe
              <Icon v-if="state === 'loading'" class="text-xl -mt-0.5" name="line-md:loading-loop" />
            </AppButton>
          </div>
        </form>
      </div>
      <div class="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
        <div class="flex space-x-6 md:order-2">
          <a target="_blank" v-for="item in navigation.social" :key="item.name" :href="item.href" class="text-gray-400"
            :class="item.hoverClass">
            <span class="sr-only">{{ item.name }}</span>
            <Icon :name="item.icon" class="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
        <p class="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
          &copy; {{ new Date().getFullYear() }} Rahul Aher
          &bull;
          Written content licensed under
          <AppLink class="inline-block underline hover:no-underline"
            to="https://creativecommons.org/licenses/by-nc-sa/4.0/">
            CC-BY-NC-SA 4.0
          </AppLink>
          &bull;
          <AppLink class="inline-block underline hover:no-underline"
            to="https://github.com/aherrahul/portfolio-v1">
            Code
          </AppLink>
          licensed under 
          <AppLink class="inline-block underline hover:no-underline"
            to="https://opensource.org/licenses/MIT">
            MIT
          </AppLink>
        </p>
      </div>
    </div>
  </footer>
</template>