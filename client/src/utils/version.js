// Single source of truth for the running application version.
// Values are injected at build time by vite.config.js `define`.
/* global __APP_VERSION__, __BUILD_DATE__ */
export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0'
export const BUILD_DATE = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : ''

export async function checkForUpdates() {
  if (!('serviceWorker' in navigator)) return { supported: false, updated: false }
  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) return { supported: false, updated: false }
  await registration.update()
  // If a waiting worker exists, a new version has been downloaded and is
  // ready; the global UpdatePrompt UI handles activation + reload.
  const hasWaiting = !!registration.waiting
  return { supported: true, updated: hasWaiting }
}

export async function applyUpdate() {
  const registration = await navigator.serviceWorker.getRegistration()
  registration?.waiting?.postMessage({ type: 'SKIP_WAITING' })
}
