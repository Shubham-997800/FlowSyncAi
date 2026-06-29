import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Info, Timer, Bell, AlertTriangle, Sparkles } from 'lucide-react'

const typeIconMap = {
  deadline_alert: AlertTriangle,
  ai_suggestion: Sparkles,
  reminder: Bell,
  system: Info,
  success: CheckCircle,
  info: Info,
  alert: AlertTriangle,
}

const borderColorMap = {
  deadline_alert: 'border-red-500',
  ai_suggestion: 'border-indigo-500',
  reminder: 'border-indigo-500',
  system: 'border-slate-300 dark:border-zinc-600',
  success: 'border-emerald-500',
  info: 'border-indigo-500',
  alert: 'border-red-500',
}

const bgColorMap = {
  deadline_alert: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  ai_suggestion: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  reminder: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  system: 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400',
  success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  info: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  alert: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
}

const actionMap = {
  deadline_alert: '/tasks',
  ai_suggestion: '/ai-planner',
  reminder: '/habits',
  success: '/dashboard',
  info: '/dashboard',
  alert: '/tasks',
}

function NotificationCard({ notification, onMarkRead }) {
  const navigate = useNavigate()
  const { title, message, type, read, time } = notification
  const Icon = typeIconMap[type] || Info
  const border = borderColorMap[type] || borderColorMap.system
  const colors = bgColorMap[type] || bgColorMap.system
  const id = notification.id || notification._id
  const timeAgo = useMemo(() => Math.floor((Date.now() - new Date(time).getTime()) / 60000), [time])

  const handleClick = () => {
    const path = notification.link || actionMap[type] || '/dashboard'
    navigate(path)
  }

  return (
    <div onClick={handleClick} className={`flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border-l-4 ${border} shadow-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer ${read ? 'opacity-60' : ''}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.split(' ')[0]} ${colors.split(' ')[1]}`}>
        <Icon size={18} className={colors.split(' ').slice(2).join(' ')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-medium ${read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>{title}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">{timeAgo < 1 ? 'now' : timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`}</span>
            {!read && (
              <button onClick={(e) => { e.stopPropagation(); onMarkRead(id) }} className="p-0.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors duration-200">
                <CheckCircle size={14} className="text-indigo-500" />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{message}</p>
      </div>
    </div>
  )
}

export default NotificationCard
