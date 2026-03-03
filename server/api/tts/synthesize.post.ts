// Google Cloud TTS synthesize endpoint removed
// This file can be deleted safely
export default defineEventHandler(async () => {
  throw createError({
    statusCode: 410,
    statusMessage: 'TTS service has been removed'
  })
})
