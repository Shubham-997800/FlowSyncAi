import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(null)

function getSystemDark() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getInitialMode() {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem('theme-mode')
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

function applyTheme(dark) {
  const root = document.documentElement
  if (dark) {
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(getInitialMode)
  const [systemDark, setSystemDark] = useState(getSystemDark)

  const dark = mode === 'dark' || (mode === 'system' && systemDark)

  useEffect(() => {
    applyTheme(dark)
    localStorage.setItem('theme-mode', mode)
    if (mode === 'dark') localStorage.setItem('theme', 'dark')
    else if (mode === 'light') localStorage.setItem('theme', 'light')
    else localStorage.removeItem('theme')
  }, [dark, mode])

  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const setMode = useCallback((next) => setModeState(next), [])

  const toggle = useCallback(() => {
    setModeState(prev => {
      if (prev === 'system') return 'dark'
      return prev === 'dark' ? 'light' : 'dark'
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ dark, mode, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
