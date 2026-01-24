<script setup lang="ts">
// Redirect /admin to /admin/dashboard
definePageMeta({
  middleware: 'admin',
  documentDriven: false
})

navigateTo('/admin/dashboard', { replace: true })
</script>

<template>
  <div></div>
</template>

