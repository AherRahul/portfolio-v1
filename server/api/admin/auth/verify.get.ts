export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'admin-token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }
    
    // Verify token exists in memory store
    if (!global.adminTokens || !global.adminTokens.has(token)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }
    
    return {
      authenticated: true
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication verification failed'
    })
  }
})

