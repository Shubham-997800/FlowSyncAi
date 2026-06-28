import { CheckCircle, Target, Flame, Timer, Info } from 'lucide-react'

const iconMap = { CheckCircle, Target, Flame, Timer, Info }

const borderColorMap = {
  success: 'border-emerald-500',
  info: 'border-indigo-500',
  default: 'border-slate-300 dark:border-zinc-600',
}

function NotificationCard({ notification, onMarkRead }) {
  const { icon, title, message, type, read, time } = notification
  const Icon = iconMap[icon] || Info
  const border = borderColorMap[type] || borderColorMap.default
  const timeAgo = Math.floor((Date.now() - new Date(time).getTime()) / 60000)

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border-l-4 ${border} shadow-sm transition-all duration-300 hover:scale-[1.02] ${read ? 'opacity-60' : ''}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' : type === 'info' ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-slate-100 dark:bg-zinc-800'}`}>
        <Icon size={18} className={type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : type === 'info' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-medium ${read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>{title}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">{timeAgo < 1 ? 'now' : timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`}</span>
            {!read && (
              <button onClick={() => onMarkRead(notification.id)} className="p-0.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors duration-200">
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
