import tailwindTypography from '@tailwindcss/typography'
import tailwindForms from '@tailwindcss/forms'
import { typographyStyles } from './typography.js'
import type { PluginUtils } from 'tailwindcss/types/config.js'
import { defineNuxtConfig } from 'nuxt/config'
import { readdirSync } from 'node:fs'
import { join, basename } from 'node:path'

function discoverContentRoutes(directories: string[]): string[] {
  const projectRoot = process.cwd()
  const routes: string[] = []
  
  function scanDirectory(baseDir: string, subPath: string = ''): void {
    try {
      const fullPath = join(baseDir, subPath)
      const files = readdirSync(fullPath, { withFileTypes: true })
      
      for (const entry of files) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          const slug = basename(entry.name, '.md')
          const routePath = subPath ? `${subPath}/${slug}` : slug
          routes.push(`/${basename(baseDir)}/${routePath}`)
        } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const nextSubPath = subPath ? `${subPath}/${entry.name}` : entry.name
          scanDirectory(baseDir, nextSubPath)
        }
      }
    } catch {
      // ignore missing directories or files
    }
  }
  
  for (const dir of directories) {
    try {
      const contentDir = join(projectRoot, 'content', dir)
      scanDirectory(contentDir)
    } catch {
      // ignore missing directories
    }
  }
  return routes
}

function discoverOgImageRoutes(): string[] {
  const contentRoutes = discoverContentRoutes(['articles', 'projects', 'courses', 'npmpackages'])
  // Map page routes to nuxt-og-image static endpoints, e.g. /__og-image__/articles/slug/og.png
  return contentRoutes.map((route) => `/__og-image__${route}/og.png`)
}

export default defineNuxtConfig({
  compatibilityDate: '2025-09-10',

  routeRules: {
    '/support-me/': { redirect: { to: '/sponsors/', statusCode: 301 } },
    '/timeline/': { redirect: { to: '/about/', statusCode: 301 } },
  },
  runtimeConfig: {
    // Server-side environment variables
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    public: {
      site: {
        url: 'https://rahulaher.netlify.app',
      }
    }
  },

  plugins: [
    { src: '~/plugins/rds.ts', mode: 'client' }
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@nuxt/content',
    // Temporarily disable OG image module to fix build issues
    // 'nuxt-og-image',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxtjs/plausible',
  ],

  nitro: {
    preset: 'netlify',
    prerender: {
      routes: [
        '/feed.xml',
        // Core pages
        '/',
        '/about/',
        '/contact/',
        '/services/',
        '/consulting/',
        '/sponsors/',
        // Index pages
        '/articles/',
        '/courses/',
        '/projects/',
        '/npmpackages/',
        '/learning/',
        // Content routes
        ...discoverContentRoutes(['articles', 'projects', 'courses', 'npmpackages']),
        // Temporarily disable OG image generation to fix build issues
        // ...discoverOgImageRoutes(),
      ],
      crawlLinks: false, // Disable crawling to prevent memory issues
      failOnError: false,
      ignore: [
        '/projects/-',
        '/npmpackages/-',
        '/articles/-_',
        '/courses/-',
        // Ignore potential memory-heavy routes
        '/__og-image__/**',
        '/api/_content/query/**',
        // Ignore topic pages that are extremely slow to render
        '/topics/**'
      ]
    },
    devProxy: {
      '/api/newsletter': { target: 'https://rahulaher.netlify.app', changeOrigin: true }
    }
  },

  site: {
    url: 'https://rahulaher.netlify.app',
    name: 'Rahul Aher',
    trailingSlash: true
  },

  // ogImage config removed to avoid TS typing issues during dev

  plausible: {
    domain: 'rahulaher.netlify.app',
    // On static hosting, Plausible should point to plausible.io (or your self-hosted endpoint)
    apiHost: 'https://plausible.io',
  },

  content: {
    documentDriven: true,
    highlight: {
      theme: 'vitesse-dark'
    },
    markdown: {
      remarkPlugins: ['remark-reading-time'],
      rehypePlugins: {
        'rehype-external-links': false
      }
    },
    // Enable global components
    components: {
      global: true,
      dirs: ['~/components/content']
    }
  },

  tailwindcss: {
    config: {
      plugins: [tailwindTypography, tailwindForms],
      theme: {
        typography: typographyStyles,
        extend: {
          backgroundSize: {
            '200%': '200%'
          },
          animation: {
            'bg-shift': 'bg-shift 2s linear infinite',
            'pulse-slow': 'pulse 3s linear infinite',
          },
          keyframes: {
            'bg-shift': {
              '0%, 100%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
            }
          }
        }
      }
    }
  },

  image: {
    // Disable image optimization for external domains to prevent Netlify processing
    provider: 'none',
    domains: ['res.cloudinary.com', 'i.ytimg.com']
  },

  devtools: {
    enabled: false
  },

  experimental: {
    inlineRouteRules: true,
    defaults: {
      useAsyncData: {
        deep: false,
      }
    },
    headNext: false,
    sharedPrerenderData: true,
    // Re-enable when https://github.com/nuxt/nuxt/issues/25743 is resolved
    appManifest: false,
  },

  future: {
    typescriptBundlerResolution: true
  },

  watch: ['typography.ts']
} as any)