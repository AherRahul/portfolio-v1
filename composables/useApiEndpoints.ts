/**
 * Composable to get the correct API endpoints for different environments
 */
export const useApiEndpoints = () => {
  const getApiUrl = (endpoint: string) => {
    // Always use the redirected URLs in production
    // The redirects in netlify.toml will handle routing to the functions
    if (process.client && typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const isNetlify = hostname.includes('netlify.app') ||
        hostname.includes('rahulaher.netlify.app') ||
        hostname.endsWith('.netlify.app')

      if (isNetlify) {
        let resolved = endpoint
        switch (endpoint) {
          case '/api/quiz/generate':
            resolved = '/.netlify/functions/quiz-generate'
            break
          case '/api/summary/generate':
            resolved = '/.netlify/functions/summary-generate'
            break
          case '/api/system-design/evaluate':
            resolved = '/.netlify/functions/sd-evaluate'
            break
          case '/api/system-design/evaluate-step':
            resolved = '/.netlify/functions/sd-evaluate-step'
            break
          case '/api/translate':
            resolved = '/.netlify/functions/translate'
            break
        }
        // console.log(`[useApiEndpoints] Resolving ${endpoint} -> ${resolved} (Netlify detected)`)
        return resolved
      }
    }

    // For server-side or development, use the original endpoints
    // The redirects will handle Netlify deployment
    return endpoint
  }

  const makeApiCall = async <T = any>(endpoint: string, options: any = {}): Promise<T> => {
    const url = getApiUrl(endpoint)

    try {
      // Use any for url to avoid excessive stack depth in Nuxt's route types
      return await $fetch(url as any, {
        ...options,
        timeout: 120000, // Increased to 120s for slow AI models like Opus
        retry: 1 // Retry once on failure
      }) as T
    } catch (error: any) {
      console.error(`API call failed for ${endpoint}:`, error)

      // If direct function call fails, try the redirect URL as fallback
      if (url.includes('/.netlify/functions/')) {
        const fallbackUrl = endpoint // Original endpoint with redirect
        // console.log(`Retrying with fallback URL: ${fallbackUrl}`)
        return await $fetch(fallbackUrl as any, {
          ...options,
          timeout: 120000,
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
