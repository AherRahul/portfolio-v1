export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'admin-token')
    
    // Remove token from memory store
    if (token && global.adminTokens) {
      global.adminTokens.delete(token)
    }
    
    // Clear the cookie
    deleteCookie(event, 'admin-token', {
      path: '/'
    })
    
    return {
      success: true,
      message: 'Logout successful'
    }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Logout failed'
    })
  }
})

