export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'admin-token')
  
  return {
    hasCookie: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : null,
    hasTokenStore: !!global.adminTokens,
    tokenCount: global.adminTokens ? global.adminTokens.size : 0,
    isTokenValid: token && global.adminTokens ? global.adminTokens.has(token) : false,
    envCheck: {
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
      hasSessionSecret: !!process.env.SESSION_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  }
})

