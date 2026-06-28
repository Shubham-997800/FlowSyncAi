import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import NotificationPopup from '../components/NotificationPopup'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { usePushNotifications } from '../hooks/usePushNotifications'
import { Sun, Moon } from 'lucide-react'
import api from '../services/api'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/ai-planner': 'AI Chat',
  '/calendar': 'Calendar',
  '/focus': 'Focus Mode',
  '/goals': 'Goals',
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
      } catch { /* ignore */ }
    }

    checkDeadlines()
  }, [user, sendNotification])

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-14 flex-shrink-0 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 ml-12 lg:ml-0">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <NotificationPopup />
            <button onClick={toggle} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/profile')} className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-zinc-800 hover:opacity-80 transition-opacity">
              <span className="text-sm text-slate-700 dark:text-slate-300 hidden sm:inline">{user?.name || 'User'}</span>
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
