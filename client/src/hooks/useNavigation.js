import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const NAV_ORDER = [
  { to: '/dashboard', key: '1', label: 'Dashboard' },
  { to: '/tasks', key: '2', label: 'Tasks & Goals' },
  { to: '/ai-planner', key: '3', label: 'AI Chat' },
  { to: '/calendar', key: '4', label: 'Calendar' },
  { to: '/focus', key: '5', label: 'Focus Mode' },
  { to: '/habits', key: '6', label: 'Habits' },
  { to: '/analytics', key: '7', label: 'Analytics' },
  { to: '/notifications', key: '8', label: 'Notifications' },
  { to: '/settings', key: '9', label: 'Settings' },
  { to: '/profile', key: '0', label: 'Profile' },
]

export function isTypingTarget(t) {
  if (!t || !t.tagName) return false
  const tag = t.tagName.toLowerCase()
  if (['input', 'textarea', 'select'].includes(tag)) return true
  if (t.isContentEditable) return true
  if (typeof t.getAttribute === 'function' && t.getAttribute('contenteditable')) return true
  return false
}

export function useKeyboardNavigation(onOpenHelp) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (isTypingTarget(e.target)) return

      const idx = NAV_ORDER.findIndex(n => n.to === location.pathname)

      if (e.key === 'ArrowLeft') {
        if (idx > 0) { e.preventDefault(); navigate(NAV_ORDER[idx - 1].to) }
        return
      }
      if (e.key === 'ArrowRight') {
        if (idx !== -1 && idx < NAV_ORDER.length - 1) { e.preventDefault(); navigate(NAV_ORDER[idx + 1].to) }
        return
      }
      if (e.key === '?') {
        e.preventDefault()
        onOpenHelp?.()
        return
      }
      if (/^[0-9]$/.test(e.key)) {
        const target = NAV_ORDER[e.key === '0' ? 9 : Number(e.key) - 1]
        if (target && target.to !== location.pathname) { e.preventDefault(); navigate(target.to) }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, location.pathname, onOpenHelp])
}

export function useSwipeNavigation(onEdgeOpen) {
  const navigate = useNavigate()
  const location = useLocation()
  const start = useRef(null)
  const edgeRef = useRef(false)

  const onTouchStart = (e) => {
    if (isTypingTarget(e.target)) return
    const touch = e.touches[0]
    start.current = { x: touch.clientX, y: touch.clientY, t: Date.now() }
    edgeRef.current = touch.clientX < 28
  }

  const onTouchEnd = (e) => {
    if (!start.current) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - start.current.x
    const dy = touch.clientY - start.current.y
    const dt = Date.now() - start.current.t
    const wasEdge = edgeRef.current
    start.current = null
    edgeRef.current = false
    if (dt > 600 || Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.2) return

    if (dx > 70 && wasEdge) {
      onEdgeOpen?.()
      return
    }
    const idx = NAV_ORDER.findIndex(n => n.to === location.pathname)
    if (dx < 0 && idx !== -1 && idx < NAV_ORDER.length - 1) navigate(NAV_ORDER[idx + 1].to)
    else if (dx > 0 && idx > 0) navigate(NAV_ORDER[idx - 1].to)
  }

  return { onTouchStart, onTouchEnd }
}
