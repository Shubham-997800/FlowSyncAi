export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { type: 'module' })
        .then((registration) => {
          console.log('[PWA] Service Worker registered:', registration.scope)

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  dispatchEvent(new CustomEvent('sw-update-available', { detail: registration }))
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error)
        })
    })
  }
}

export function unregisterSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister())
    })
  }
}