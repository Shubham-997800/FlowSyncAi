import { useState, useEffect, useCallback } from 'react'

function getInitialInstalledState() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
}

function getInitialIOSState() {
  if (typeof window === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function getInitialCanInstallState() {
  if (typeof window === 'undefined') return false
  if (getInitialInstalledState()) return false
  return false
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [canInstall, setCanInstall] = useState(getInitialCanInstallState)
  const [isInstalled] = useState(getInitialInstalledState)
  const [isIOS] = useState(getInitialIOSState)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setCanInstall(false)
      setDeferredPrompt(null)
      console.log('[PWA] App installed successfully')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        alert('To install FlowSync AI on iOS:\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"')
      }
      return { success: false, reason: 'no-prompt' }
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setCanInstall(false)
        setDeferredPrompt(null)
        return { success: true }
      } else {
        return { success: false, reason: 'dismissed' }
      }
    } catch (error) {
      console.error('[PWA] Install failed:', error)
      return { success: false, reason: 'error' }
    }
  }, [deferredPrompt, isIOS])

  const dismiss = useCallback(() => {
    setCanInstall(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }, [])

  const shouldShowInstall = useCallback(() => {
    if (isInstalled || !canInstall) return false
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissTime = parseInt(dismissed, 10)
      const week = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - dismissTime < week) return false
    }
    return true
  }, [canInstall, isInstalled])

  return {
    canInstall,
    isInstalled,
    isIOS,
    install,
    dismiss,
    shouldShowInstall: shouldShowInstall()
  }
}