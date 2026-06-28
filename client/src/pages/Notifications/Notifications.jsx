import { useState, useEffect } from 'react'
import { Bell, Trash2, CheckCheck, AlertTriangle, ListTodo, Target, Flame, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

function loadNotifications() {
  try { const d = localStorage.getItem('flowsync_notifications'); return d ? JSON.parse(d) : [] } catch { return [] }
}
function saveNotifications(n) { localStorage.setItem('flowsync_notifications', JSON.stringify(n)) }

const notificationIcons = {
  task: { icon: ListTodo, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  deadline: { icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  goal: { icon: Target, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  habit: { icon: Flame, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  focus: { icon: Clock, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
}

function createSampleNotifications() {
  return [
    { _id: '1', type: 'deadline', title: 'Overdue Task', message: '"Q4 Report" was due yesterday. Consider reprioritizing.', time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
    { _id: '2', type: 'task', title: 'Task Reminder', message: '"Design Review" is due in 2 hours. Start now to stay on track.', time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
    { _id: '3', type: 'habit', title: 'Habit Streak', message: 'You completed "Morning Workout" for 5 days in a row! Keep it up!', time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), read: false },
    { _id: '4', type: 'goal', title: 'Goal Progress', message: '"Learn React" is 75% complete. Great progress this week!', time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), read: true },
    { _id: '5', type: 'focus', title: 'Focus Summary', message: 'You completed 4 focus sessions yesterday — 100 minutes of deep work.', time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
  ]
}

function Notifications() {
  const [notifications, setNotifications] = useState(() => {
    const stored = loadNotifications()
    return stored.length > 0 ? stored : createSampleNotifications()
  })

  useEffect(() => { saveNotifications(notifications) }, [notifications])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('All marked as read')
  }

  const clearAll = () => {
    setNotifications([])
    toast.success('Notifications cleared')
  }

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: !n.read } : n))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">{unreadCount} unread</span> : 'All caught up!'}
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <button onClick={markAllRead} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <CheckCheck size={16} /> Mark All Read
            </button>
            <button onClick={clearAll} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition">
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <Bell size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No notifications</p>
          <p className="text-sm mt-1">Check back later for updates</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const cfg = notificationIcons[n.type] || notificationIcons.task
            const Icon = cfg.icon
            const timeAgo = getTimeAgo(new Date(n.time))
            return (
              <div key={n._id} className={`group bg-white dark:bg-gray-800 rounded-2xl border p-4 transition hover:shadow-sm ${n.read ? 'border-gray-200 dark:border-gray-700' : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10'}`}>
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className={`text-sm font-semibold ${n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>{n.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{timeAgo}</span>
                        <button onClick={() => deleteNotification(n._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => toggleRead(n._id)} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline mt-1.5">
                      {n.read ? 'Mark as unread' : 'Mark as read'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function getTimeAgo(date) {
  const now = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default Notifications
