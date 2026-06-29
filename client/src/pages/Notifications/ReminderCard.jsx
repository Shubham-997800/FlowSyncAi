import { useMemo } from 'react'
import { Bell, CheckCircle, Clock, XCircle } from 'lucide-react'

function ReminderCard({ notification, onMarkRead }) {
  const { title, message, time, read } = notification
  const id = notification.id || notification._id
  const timeAgo = useMemo(() => Math.floor((Date.now() - new Date(time).getTime()) / 60000), [time])

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border-l-4 border-indigo-500 shadow-sm transition-all duration-300 hover:scale-[1.02] ${read ? 'opacity-60' : ''}`}>
      <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
        <Bell size={18} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-medium ${read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>{title}</p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">{timeAgo < 1 ? 'now' : timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">{message}</p>
        <div className="flex gap-2">
          {onMarkRead && (
            <button onClick={() => onMarkRead(id)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1.5">
              <CheckCircle size={12} /> Take action
            </button>
          )}
          <button className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors duration-200 flex items-center gap-1.5">
            <Clock size={12} /> Snooze
          </button>
          {onMarkRead && (
            <button onClick={() => onMarkRead(id)} className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors duration-200 flex items-center gap-1.5">
              <XCircle size={12} /> Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReminderCard
