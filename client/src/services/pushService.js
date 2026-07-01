const VAPID_PUBLIC_KEY = 'BKdxM2AQ4h4H8LwhaIx9eTEAkNyXnGh_D0TMvab7-Cmh4f8neF8_Zg7IAOnnnXIfGKCgeseCq0TyFJBbbMjjTM8'

import api from './api'

// Web Push API subscription and unsubscription helpers
function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(b64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

export async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null

  try {
    const reg = await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    if (existing) {
      await api.post('/api/push/subscribe', existing.toJSON())
      return existing
    }

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })

    await api.post('/api/push/subscribe', sub.toJSON())
    return sub
  } catch {
    return null
  }
}

export async function unsubscribeFromPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  try {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) {
      await api.post('/api/push/unsubscribe', sub.toJSON())
      await sub.unsubscribe()
    }
  } catch { /* ignore */ }
}
