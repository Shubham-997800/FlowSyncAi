import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App.jsx'
import { registerSW } from './pwa/registerSW'
import './index.css'

registerSW()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <ThemeProvider>
              <AuthProvider>
                <App />
                <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
              </AuthProvider>
            </ThemeProvider>
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
