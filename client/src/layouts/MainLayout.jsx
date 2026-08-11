import { useEffect, useState, useCallback } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import NotificationPopup from '../components/NotificationPopup'
import PermissionMonitor from '../components/PermissionMonitor'
import ShortcutsHelp from '../components/ShortcutsHelp'
import DeviceOnboarding from '../components/DeviceOnboarding'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { usePushNotifications } from '../hooks/usePushNotifications'
import { useKeyboardNavigation, useSwipeNavigation } from '../hooks/useNavigation'
import { Sun, Moon, Menu, X, Keyboard, HelpCircle } from 'lucide-react'
import api from '../services/api'

// Authenticated app shell with sidebar, header, and page transitions
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
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('flowsync_onboard_shown_v1'))
  const openShortcuts = useCallback(() => setShowShortcuts(true), [])
  useKeyboardNavigation(openShortcuts)
  const swipe = useSwipeNavigation(() => setSidebarOpen(true))
  const pageTitle = pageTitles[location.pathname] || 'FlowSync AI'

useEffect(() => {
  document.getElementById('main-content')?.scrollTo({ top: 0 })
}, [location.pathname])

  const closeOnboarding = () => {
    localStorage.setItem('flowsync_onboard_shown_v1', '1')
    setShowOnboarding(false)
  }

  useEffect(() => {
    if (!user) return

    const DEADLINE_CHECK_COOLDOWN = 120000
    const LAST_CHECK_KEY = 'flowsync_deadline_check_at'
    const lastCheck = Number(sessionStorage.getItem(LAST_CHECK_KEY) || 0)
    if (Date.now() - lastCheck < DEADLINE_CHECK_COOLDOWN) return
    sessionStorage.setItem(LAST_CHECK_KEY, String(Date.now()))

    const checkDeadlines = async () => {
      try {
        const { data: tasks } = await api.get('/api/tasks')
        const now = new Date()
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
        const notified = new Set(JSON.parse(localStorage.getItem('flowsync_notified_tasks') || '[]'))

        tasks.forEach(task => {
          if (task.status === 'done' || notified.has(task._id)) return
          if (!task.deadline) return
          const d = new Date(task.deadline)
          if (Number.isNaN(d.getTime())) return
          const due = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

          if (due < today) {
            sendNotification('Overdue Task', {
              body: `"${task.title}" is overdue. Check your tasks.`,
            })
            notified.add(task._id)
          } else if (due === today) {
            sendNotification('Task Due Today', {
              body: `"${task.title}" is due today!`,
            })
            notified.add(task._id)
          }
        })

        localStorage.setItem('flowsync_notified_tasks', JSON.stringify([...notified]))
      } catch {}
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
            <button aria-label={sidebarOpen ? 'Close menu' : 'Open menu'} className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0" onClick={() => setSidebarOpen(prev => !prev)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <PermissionMonitor />
            <NotificationPopup />
            <button onClick={() => setShowOnboarding(true)} aria-label="Device guide and tips" title="Device guide & tips" className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0">
              <HelpCircle size={18} />
            </button>
            <button onClick={() => setShowShortcuts(true)} aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)" className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0">
              <Keyboard size={18} />
            </button>
            <button onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/profile')} aria-label="Open profile" className="flex items-center gap-1 sm:gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-zinc-800 hover:opacity-80 transition-opacity">
              <span className="text-sm text-slate-700 dark:text-slate-300 hidden sm:inline truncate max-w-[80px]">{user?.name || 'User'}</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold overflow-hidden flex-shrink-0">
                {user?.profilePicture ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || 'U')}
              </div>
            </button>
          </div>
        </header>
        <main id="main-content" onTouchStart={swipe.onTouchStart} onTouchEnd={swipe.onTouchEnd} className={`flex-1 overflow-y-auto ${location.pathname === '/ai-planner' ? 'p-0' : 'p-4 sm:p-6 lg:p-8'}`}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ willChange: 'transform, opacity' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <ShortcutsHelp open={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <DeviceOnboarding open={showOnboarding} onClose={closeOnboarding} />
    </div>
  )
}

export default MainLayout
