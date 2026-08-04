import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
