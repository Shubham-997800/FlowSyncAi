import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { subscribeToPush, unsubscribeFromPush } from '../services/pushService'

function getPermission() {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission
}

export function usePushNotifications(skipAutoSetup) {
  const { user } = useAuth()
  const [permission, setPermission] = useState(getPermission)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (skipAutoSetup) return
    if (!user) {
      unsubscribeFromPush().catch(() => {})
      setSubscribed(false)
      return
    }
    let mounted = true
    ;(async () => {
      try {
        if (getPermission() === 'denied') return
        if (getPermission() !== 'granted') {
          const result = await Notification.requestPermission()
          if (!mounted) return
          setPermission(result)
          if (result !== 'granted') return
        }
        const sub = await subscribeToPush()
        if (mounted && sub) setSubscribed(true)
      } catch {
        // silently fail
      }
    })()
    return () => { mounted = false }
  }, [user, skipAutoSetup])

  const reRequestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'unsupported'
    if (Notification.permission === 'granted') return 'granted'
    if (Notification.permission === 'denied') return 'denied'
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      if (result === 'granted') {
        const sub = await subscribeToPush()
        if (sub) setSubscribed(true)
      }
      return result
    } catch {
      return 'denied'
    }
  }, [])

  const sendNotification = useCallback((title, options = {}) => {
    if (typeof Notification === 'undefined') return
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

  return { permission, subscribed, reRequestPermission, sendNotification }
}