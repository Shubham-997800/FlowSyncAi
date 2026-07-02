import { useState, useEffect, useRef, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import { Bell, CheckCircle, Target, Flame, Timer, AlertTriangle, Info, Sparkles } from 'lucide-react'
import { getNotifications } from '../services/notificationService'
import toast from 'react-hot-toast'

// Header dropdown showing recent notifications with unread badge
const typeIconMap = {
  deadline_alert: AlertTriangle,
  ai_suggestion: Sparkles,
  reminder: Bell,
  system: Info,
  success: CheckCircle,
  info: Info,
  alert: AlertTriangle,
}

const typeColorMap = {
  deadline_alert: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  ai_suggestion: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  reminder: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  system: 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400',
  success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  info: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  alert: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
}

const NotificationPopup = memo(function NotificationPopup() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getNotifications()
        setNotifications(Array.isArray(data) ? data : [])
      } catch {
        toast.error('Failed to load notifications')
      }
    }
    fetch()
    const interval = setInterval(fetch, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const unread = notifications.filter(n => n.status !== 'read').length
  const recent = notifications.slice(0, 5)

  const timeAgo = (time) => {
    const mins = Math.floor((Date.now() - new Date(time).getTime()) / 60000) // eslint-disable-line react-hooks/purity
    if (mins < 1) return 'now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <ErrorBoundary>
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full ring-2 ring-slate-50 dark:ring-zinc-950">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-24px)] sm:max-w-none bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl z-40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</p>
              {unread > 0 && <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-medium">{unread} new</span>}
            </div>

            <div className="max-h-72 overflow-y-auto">
              {recent.length === 0 ? (
                <div className="text-center py-8">
                  <Bell size={24} className="mx-auto mb-2 text-slate-300 dark:text-zinc-600" />
                  <p className="text-xs text-slate-400 dark:text-slate-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {recent.map(n => {
                    const Icon = typeIconMap[n.type] || Info
                    const colorClass = typeColorMap[n.type] || typeColorMap.system
                    const isRead = n.status === 'read'
                    return (
                      <button key={n._id} onClick={() => { setOpen(false); navigate('/notifications') }} className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition flex items-start gap-3 ${isRead ? 'opacity-60' : ''}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
                          <Icon size={14} className={colorClass.split(' ').slice(2).join(' ')} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-medium ${isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>{n.title}</p>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 flex-shrink-0">{timeAgo(n.createdAt)}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{n.message}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <button onClick={() => { setOpen(false); navigate('/notifications') }} className="w-full text-center py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-800 border-t border-slate-200 dark:border-zinc-800 transition">
              View all notifications
            </button>
          </div>
        </>
      )}
    </div>
    </ErrorBoundary>
  )
})

export default NotificationPopup
