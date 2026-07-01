import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, ListTodo, Brain, Calendar, Clock, Target,
  BarChart3, Bell, Settings, LogOut, Flame, User,
} from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks & Goals', icon: ListTodo },
  { to: '/ai-planner', label: 'AI Chat', icon: Brain },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/focus', label: 'Focus Mode', icon: Clock },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/profile', label: 'Profile', icon: User },
]

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleNavClick = () => onClose?.()

  const sidebarContent = (
    <>
      <div className="flex items-center px-6 h-14 border-b border-slate-200 dark:border-zinc-800">
        <Link to="/dashboard" onClick={handleNavClick} className="text-xl font-bold text-indigo-600 dark:text-indigo-400">FlowSync AI</Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 ${
                isActive ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-slate-200 dark:border-zinc-800">
        <Link to="/profile" onClick={handleNavClick} className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold overflow-hidden">
            {user?.profilePicture ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ''}</p>
          </div>
        </Link>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => onClose?.()} />
      )}

      <aside className={`${
        open ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 lg:z-0 w-64 flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 h-screen`}>
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
