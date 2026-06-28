import { useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

export function usePushNotifications() {
  const { user } = useAuth()

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }, [])

  const sendNotification = useCallback((title, options = {}) => {
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      })
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    if (user) {
      requestPermission()
    }
  }, [user, requestPermission])

  return { requestPermission, sendNotification }
}
