import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'FlowSync AI',
        short_name: 'FlowSync',
        description: 'AI-Powered Productivity Operating System',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#6366F1',
        background_color: '#020617',
        lang: 'en',
        icons: [
          {
            src: '/icons/icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192x192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [],
        categories: ['productivity', 'utilities'],
        shortcuts: [
          {
            name: 'AI Chat',
            short_name: 'AI Chat',
            description: 'Open AI Assistant',
            url: '/ai-planner',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'View your dashboard',
            url: '/dashboard',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Tasks',
            short_name: 'Tasks',
            description: 'Manage your tasks',
            url: '/tasks',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
          }
        ],
        prefer_related_applications: false
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf,eot,json,webmanifest}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/') && url.origin === self.location.origin,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60
              },
              networkTimeoutSeconds: 10,
              fetchOptions: {
                credentials: 'include'
              },
              plugins: [
                {
                  cacheWillUpdate: async ({ response }) => {
                    if (!response.ok) return null
                    const contentType = response.headers.get('content-type')
                    if (contentType?.includes('application/json')) {
                      const cloned = response.clone()
                      try {
                        const data = await cloned.json()
                        if (data?.token || data?.refreshToken) return null
                      } catch {}
                    }
                    return response
                  }
                }
              ]
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /\.json$/, /\.xml$/]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor'
          if (id.includes('node_modules/react-router')) return 'router'
          if (id.includes('node_modules/framer-motion')) return 'motion'
          if (id.includes('node_modules/lucide-react')) return 'icons'
          if (id.includes('node_modules/axios') || id.includes('node_modules/react-hot-toast') || id.includes('node_modules/react-helmet-async')) return 'utils'
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) return 'report-pdf'
          if (id.includes('node_modules/docx')) return 'report-docx'
        },
      },
    },
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 650,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})