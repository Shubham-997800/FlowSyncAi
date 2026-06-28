import { useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import NotificationCard from './NotificationCard'
import ReminderCard from './ReminderCard'
import AlertCard from './AlertCard'

function loadNotifications() {
  try { const d = localStorage.getItem('flowsync_notifications'); return d ? JSON.parse(d) : [] } catch { /* ignore */ return [] }
}
function saveNotifications(n) { localStorage.setItem('flowsync_notifications', JSON.stringify(n)) }

function createSystemNotification(type) {
  const msgs = {
    task: { icon: 'CheckCircle', title: 'Task Completed', message: 'Great job! Keep up the momentum.', type: 'success' },
    goal: { icon: 'Target', title: 'Goal Milestone', message: 'You\'re making progress on your goals.', type: 'info' },
    habit: { icon: 'Flame', title: 'Habit Streak', message: 'Consistency is key. Stay on track.', type: 'reminder' },
    focus: { icon: 'Timer', title: 'Focus Session Done', message: 'Well done on completing a focus session.', type: 'success' },
    overdue: { icon: 'AlertTriangle', title: 'Overdue Task', message: 'You have tasks that need attention.', type: 'alert' },
  }
  const n = msgs[type] || msgs.task
  return { id: Date.now(), ...n, read: false, time: new Date().toISOString() }
}

function Notifications() {
  const [notifications, setNotifications] = useState(loadNotifications)
  const [activeTab, setActiveTab] = useState('all')

  const addNotification = (type) => {
    const n = createSystemNotification(type)
    const updated = [n, ...notifications]
    setNotifications(updated)
    saveNotifications(updated)
  }

  const markRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    saveNotifications(updated)
  }

  const dismissAll = () => {
    setNotifications([])
    saveNotifications([])
  }

  const today = notifications.filter(n => {
    const d = new Date(n.time); const now = new Date()
    return d.toDateString() === now.toDateString()
  })
  const thisWeek = notifications.filter(n => {
    const d = new Date(n.time); const now = new Date()
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7)
    return !today.includes(n) && d >= weekAgo
  })
  const earlier = notifications.filter(n => {
    const d = new Date(n.time); const now = new Date()
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7)
    return d < weekAgo
  })

  const unread = notifications.filter(n => !n.read).length

  const sampleTypes = ['task', 'goal', 'habit', 'focus', 'overdue']

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Notifications</h1>
            {unread > 0 && (
              <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">{unread} new</span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Stay updated on your progress</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
            {['all', 'unread'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors duration-300 ${activeTab === tab ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>{tab}</button>
            ))}
          </div>
          {notifications.length > 0 && (
            <button onClick={dismissAll} className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300">Clear all</button>
          )}
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {sampleTypes.map(type => (
          <button key={type} onClick={() => addNotification(type)} className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300 capitalize">
            + {type}
          </button>
        ))}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={48} className="mx-auto mb-4 text-slate-300 dark:text-zinc-600" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No notifications yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Click the demo buttons above to generate sample notifications</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'unread' ? (
            notifications.filter(n => !n.read).length > 0 ? (
              <div className="space-y-2">
                {notifications.filter(n => !n.read).map(n => <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />)}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCheck size={40} className="mx-auto mb-3 text-emerald-400" />
                <p className="text-slate-500 dark:text-slate-400">All caught up!</p>
              </div>
            )
          ) : (
            <>
              {today.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Today</h3>
                  <div className="space-y-2">
                    {today.map(n => n.type === 'alert' ? <AlertCard key={n.id} notification={n} onMarkRead={markRead} /> : n.type === 'reminder' ? <ReminderCard key={n.id} notification={n} onMarkRead={markRead} /> : <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />)}
                  </div>
                </div>
              )}

              {thisWeek.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">This Week</h3>
                  <div className="space-y-2">
                    {thisWeek.map(n => <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />)}
                  </div>
                </div>
              )}

              {earlier.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Earlier</h3>
                  <div className="space-y-2">
                    {earlier.map(n => <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Notifications
