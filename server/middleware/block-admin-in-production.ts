export default defineEventHandler((event) => {
  const url = event.node.req.url || ''
  
  // Block all admin routes in production (Netlify)
  if (url.startsWith('/api/admin') || url.startsWith('/admin')) {
    // Check if running in production environment
    if (process.env.NODE_ENV === 'production' && process.env.NETLIFY === 'true') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Admin portal is only available in local development'
      })
    }
  }
})

