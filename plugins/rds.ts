import { defineNuxtPlugin } from '#app'
import RDS from '@aherrahul/design-system'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(RDS)
});
