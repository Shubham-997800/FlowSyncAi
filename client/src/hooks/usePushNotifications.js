import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { subscribeToPush, unsubscribeFromPush } from '../services/pushService'

let globalPermission = 'Notification' in window ? Notification.permission : 'unsupported'
let globalSubscribed = false
const listeners = new Set()

function notifyListeners() {
  listeners.forEach(fn => fn())
}

export function getPushState() {
  return { permission: globalPermission, subscribed: globalSubscribed }
}

export function usePushNotifications(skipAutoSetup = false) {
  const { user } = useAuth()
  const [permission, setPermission] = useState(globalPermission)
  const [subscribed, setSubscribed] = useState(globalSubscribed)

  const syncState = useCallback(() => {
    setPermission(globalPermission)
    setSubscribed(globalSubscribed)
  }, [])

  useEffect(() => {
    listeners.add(syncState)
    return () => listeners.delete(syncState)
  }, [syncState])

  const updateGlobal = useCallback((p, s) => {
    globalPermission = p
    globalSubscribed = s
    notifyListeners()
  }, [])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported'
    if (Notification.permission === 'denied') return 'denied'
    if (Notification.permission === 'granted') return 'granted'
    const result = await Notification.requestPermission()
    updateGlobal(result, globalSubscribed)
    return result
  }, [updateGlobal])

  const reRequestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported'
    if (Notification.permission === 'granted') return 'granted'
    if (Notification.permission === 'denied') {
      updateGlobal('denied', false)
      return 'denied'
    }
    const result = await Notification.requestPermission()
    if (result === 'granted') {
      const sub = await subscribeToPush()
      updateGlobal('granted', !!sub)
      return 'granted'
    }
    updateGlobal(result, false)
    return result
  }, [updateGlobal])

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
    const check = () => {
      if ('Notification' in window && Notification.permission !== globalPermission) {
        updateGlobal(Notification.permission, globalSubscribed)
      }
    }
    check()
    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
  }, [updateGlobal])

  useEffect(() => {
    if (skipAutoSetup) return
    if (!user) {
      unsubscribeFromPush()
      updateGlobal(globalPermission, false)
      return
    }
    let mounted = true
    const setup = async () => {
      const p = await requestPermission()
      if (mounted && p === 'granted') {
        const sub = await subscribeToPush()
        if (sub) updateGlobal('granted', true)
      }
    }
    setup()
    return () => { mounted = false }
  }, [user, requestPermission, updateGlobal, skipAutoSetup])

  return { permission, subscribed, requestPermission, reRequestPermission, sendNotification }
}