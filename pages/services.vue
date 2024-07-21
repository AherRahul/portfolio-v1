<script setup lang="ts">
definePageMeta({
  documentDriven: false
})

const title = 'Services'
const description = 'Take a look at the services I offer, including web engineering consulting, projects for various topics and more.'

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('General')
</script>

<template>
  <div>
    <AppSection>
      <ParagraphDecoration />
      <AppParagraph look="heading" class="mt-4" tag="h1">Services</AppParagraph>
      <div class="flex flex-col items-center md:flex-row my-16 gap-16">
        <ServicePreview class="max-w-xl bg-zinc-900 p-8" icon="mdi:lightbulb-on-outline" title="Consulting" to="/consulting">
          Companies rely on my expertise to develop exceptional applications, leveraging my problem-solving skills, expertise 
          in discussing optimal abstractions, and refining architecture.
        </ServicePreview>
        
        <ServicePreview class="max-w-xl bg-zinc-900 p-8" icon="mdi:help-circle-outline" title="Something else" to="/contact">
          Problems are not always easy to categorize. If you have a problem that you think I can help you with,
          don't hesitate to reach out, and let's discuss your needs.
        </ServicePreview>
      </div>
      <div class="flex justify-center">
        <!-- <ServicePreview class="max-w-xl bg-zinc-900 p-8" icon="ph:chalkboard-teacher-light" title="Projects" to="/projects/">
          I'm dedicated to continuous learning, reinforcing new concepts through real-world projects. This not only boosts my 
          skills but also deepens my understanding of each concept.
        </ServicePreview> -->
      </div>
    </AppSection>
  </div>
</template>