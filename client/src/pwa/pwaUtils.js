export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
}

export function getInstallMethod() {
  if (window.matchMedia('(display-mode: standalone)').matches) return 'pwa'
  if (window.navigator.standalone === true) return 'ios-pwa'
  return 'browser'
}

export function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function isAndroid() {
  return /android/i.test(navigator.userAgent)
}

export function supportsPWA() {
  return 'serviceWorker' in navigator && 'PushManager' in window
}

export function getPreferredTheme() {
  const stored = localStorage.getItem('theme-mode')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }
}