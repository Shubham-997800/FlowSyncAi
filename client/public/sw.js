/* global clients */

const CACHE_NAME = 'flowsync-v1'
const API_PREFIX = '/api/'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (url.pathname.startsWith(API_PREFIX)) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(request, copy)).catch(() => {})
          return res
        })
        .catch(() => caches.match(request))
    )
    return
  }

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put('/index.html', copy)).catch(() => {})
          return res
        })
        .catch(() => caches.match('/index.html'))
    )
    return
  }

  e.respondWith(
    caches.match(request).then(
      (cached) => cached || fetch(request).then((res) => {
        const copy = res.clone()
        caches.open(CACHE_NAME).then((c) => c.put(request, copy)).catch(() => {})
        return res
      })
    )
  )
})

self.addEventListener('push', (e) => {
  let data = { title: 'FlowSync AI', body: '', icon: '/favicon.svg', badge: '/favicon.svg' }
  try {
    const parsed = e.data?.json()
    if (parsed) data = { ...data, ...parsed }
  } catch {
    data.body = e.data?.text() || ''
  }

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: data.url ? { url: data.url } : undefined,
    })
  )
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const url = e.notification.data?.url || '/notifications'
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      const matching = clientsArr.find((c) => c.url.includes(url))
      if (matching) return matching.focus()
      return clients.openWindow(url)
    })
  )
})
