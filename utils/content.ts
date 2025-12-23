export function onContentNotFound(page: Ref<any>) {
  if (page.value) {
    return
  }

  if (process.server) {
    const event = useRequestEvent()
    if (!event) return
    
    const url = event.path || ''
    
    // Ignore system requests (Chrome DevTools, favicon, etc.)
    if (url.startsWith('/.well-known/') || url === '/favicon.ico') {
      setResponseStatus(event, 404)
      return // Don't throw fatal error for system requests
    }
    
    setResponseStatus(event, 404)
  }

  throw createError({
    fatal: true,
    statusCode: 404,
  })
}