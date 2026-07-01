import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import NotificationPopup from '../components/NotificationPopup'
import PermissionMonitor from '../components/PermissionMonitor'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { usePushNotifications } from '../hooks/usePushNotifications'
import { Sun, Moon, Menu, X } from 'lucide-react'
import api from '../services/api'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks & Goals',
  '/ai-planner': 'AI Chat',
  '/calendar': 'Calendar',
  '/focus': 'Focus Mode',
  '/habits': 'Habits',
  '/analytics': 'Analytics',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/settings': 'Settings',
}

function MainLayout() {
  const { user } = useAuth()
  const { dark, toggle } = useTheme()
  const { sendNotification } = usePushNotifications()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pageTitle = pageTitles[location.pathname] || 'FlowSync AI'

  useEffect(() => {
    if (!user) return

    const checkDeadlines = async () => {
      try {
        const { data: tasks } = await api.get('/api/tasks')
        const today = new Date().toISOString().split('T')[0]
        const notified = JSON.parse(localStorage.getItem('flowsync_notified_tasks') || '[]')

        tasks.forEach(task => {
          if (task.status === 'done' || notified.includes(task._id)) return
          const due = task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : null
          if (!due) return

          if (due < today) {
            sendNotification('Overdue Task', {
              body: `"${task.title}" is overdue. Check your tasks.`,
            })
            localStorage.setItem('flowsync_notified_tasks', JSON.stringify([...notified, task._id]))
          } else if (due === today) {
            sendNotification('Task Due Today', {
              body: `"${task.title}" is due today!`,
            })
            localStorage.setItem('flowsync_notified_tasks', JSON.stringify([...notified, task._id]))
          }
        })
      } catch { console.warn('Deadline check failed') }
    }

    checkDeadlines()
  }, [user, sendNotification])

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-indigo-600 focus:text-white focus:text-sm focus:font-medium focus:shadow-lg">
        Skip to main content
      </a>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-14 flex-shrink-0 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-3 sm:px-6 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <PermissionMonitor />
            <NotificationPopup />
            <button onClick={toggle} className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300 flex-shrink-0">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/profile')} className="flex items-center gap-1 sm:gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-zinc-800 hover:opacity-80 transition-opacity">
              <span className="text-sm text-slate-700 dark:text-slate-300 hidden sm:inline truncate max-w-[80px]">{user?.name || 'User'}</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold overflow-hidden flex-shrink-0">
                {user?.profilePicture ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || 'U')}
              </div>
            </button>
          </div>
        </header>
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
