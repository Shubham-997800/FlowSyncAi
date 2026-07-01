import { useState, useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import NotificationCard from './NotificationCard'
import ReminderCard from './ReminderCard'
import AlertCard from './AlertCard'
import { getNotifications, markAsRead, createNotification } from '../../services/notificationService'

function normalizeNotification(n) {
  const id = n._id
  const read = n.status === 'read'
  const time = n.createdAt
  return { ...n, id, read, time }
}

function createLocalNotification(type) {
  const msgs = {
    task: { title: 'Task Completed', message: 'Great job! Keep up the momentum.', type: 'success' },
    goal: { title: 'Goal Milestone', message: 'You\'re making progress on your goals.', type: 'info' },
    habit: { title: 'Habit Streak', message: 'Consistency is key. Stay on track.', type: 'reminder' },
    focus: { title: 'Focus Session Done', message: 'Well done on completing a focus session.', type: 'success' },
    overdue: { title: 'Overdue Task', message: 'You have tasks that need attention.', type: 'alert' },
  }
  const n = msgs[type] || msgs.task
  return { _id: 'local_' + Date.now().toString(), ...n, status: 'unread', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
}

const isLocalId = (id) => typeof id === 'string' && id.startsWith('local_')

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications()
        const items = (Array.isArray(data) ? data : []).map(normalizeNotification)
        setNotifications(items)
      } catch {
        toast.error('Failed to load notifications')
      }
    }
    fetchNotifications()
  }, [])

  const addNotification = (type) => {
    const n = createLocalNotification(type)
    const normalized = normalizeNotification(n)
    setNotifications(prev => [normalized, ...prev])
    createNotification({ type: normalized.type, title: normalized.title, message: normalized.message }).catch(() => {})
  }

  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => (n.id === id || n._id === id) ? { ...n, read: true, status: 'read' } : n))
    if (!isLocalId(id)) {
      try { await markAsRead(id) } catch { toast.error('Failed to mark as read') }
    }
  }

  const dismissAll = () => {
    setNotifications([])
  }

  const unread = notifications.filter(n => !n.read).length

  const today = notifications.filter(n => {
    const d = new Date(n.time)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })

  const thisWeek = notifications.filter(n => {
    const d = new Date(n.time)
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    return d > weekAgo && d.toDateString() !== now.toDateString()
  })

  const earlier = notifications.filter(n => {
    const d = new Date(n.time)
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    return d <= weekAgo
  })

  const sampleTypes = ['task', 'goal', 'habit', 'focus', 'overdue']

  return (
    <motion.div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <Helmet>
        <title>Notifications - FlowSync AI</title>
        <meta name="description" content="Stay updated on your progress" />
      </Helmet>
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
                {notifications.filter(n => !n.read).map(n => <motion.div key={n.id} variants={itemVariants}><NotificationCard notification={n} onMarkRead={markRead} /></motion.div>)}
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
                    {today.map(n => (n.type === 'alert' || n.type === 'deadline_alert') ? <motion.div key={n.id} variants={itemVariants}><AlertCard notification={n} onMarkRead={markRead} /></motion.div> : n.type === 'reminder' ? <motion.div key={n.id} variants={itemVariants}><ReminderCard notification={n} onMarkRead={markRead} /></motion.div> : <motion.div key={n.id} variants={itemVariants}><NotificationCard notification={n} onMarkRead={markRead} /></motion.div>)}
                  </div>
                </div>
              )}

              {thisWeek.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">This Week</h3>
                  <div className="space-y-2">
                    {thisWeek.map(n => <motion.div key={n.id} variants={itemVariants}><NotificationCard notification={n} onMarkRead={markRead} /></motion.div>)}
                  </div>
                </div>
              )}

              {earlier.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Earlier</h3>
                  <div className="space-y-2">
                    {earlier.map(n => <motion.div key={n.id} variants={itemVariants}><NotificationCard notification={n} onMarkRead={markRead} /></motion.div>)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default Notifications
