/**
 * Composable to get the correct API endpoints for different environments
 */
export const useApiEndpoints = () => {
  const getApiUrl = (endpoint: string) => {
    // Always use the redirected URLs in production
    // The redirects in netlify.toml will handle routing to the functions
    if (process.client && typeof window !== 'undefined') {
      // Client-side: check if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || 
                       window.location.hostname.includes('rahulaher.netlify.app')
      
      if (isNetlify) {
        // On Netlify, use the function URLs directly to avoid redirect issues
        switch (endpoint) {
          case '/api/quiz/generate':
            return '/.netlify/functions/quiz-generate'
          case '/api/summary/generate':
            return '/.netlify/functions/summary-generate'
          default:
            return endpoint
        }
      }
    }
    
    // For server-side or development, use the original endpoints
    // The redirects will handle Netlify deployment
    return endpoint
  }
  
  const makeApiCall = async (endpoint: string, options: any = {}) => {
    const url = getApiUrl(endpoint)
    
    try {
      return await $fetch(url, {
        ...options,
        timeout: 30000, // 30 second timeout
        retry: 1 // Retry once on failure
      })
    } catch (error: any) {
      console.error(`API call failed for ${endpoint}:`, error)
      
      // If direct function call fails, try the redirect URL as fallback
      if (url.includes('/.netlify/functions/')) {
        const fallbackUrl = endpoint // Original endpoint with redirect
        // console.log(`Retrying with fallback URL: ${fallbackUrl}`)
        return await $fetch(fallbackUrl, {
          ...options,
          timeout: 30000,
          retry: 0 // No retry for fallback
        })
      }
      
      throw error
    }
  }
  
  return {
    getApiUrl,
    makeApiCall
  }
}
