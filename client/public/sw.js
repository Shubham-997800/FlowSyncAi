self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (e) => e.waitUntil(clients.claim()))

self.addEventListener('push', (e) => {
  let data = { title: 'FlowSync AI', body: '', icon: '/favicon.ico', badge: '/favicon.ico' }
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
