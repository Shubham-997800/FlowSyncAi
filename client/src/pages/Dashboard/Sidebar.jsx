import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, ListTodo, Brain, Calendar, Clock, BarChart3, Settings, LogOut, X } from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/ai-planner', label: 'AI Planner', icon: Brain },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/focus', label: 'Focus Mode', icon: Clock },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />
      }
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto flex flex-col`}>
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 dark:border-gray-800">
          <Link to="/dashboard" className="text-xl font-bold text-emerald-600">FlowSync AI</Link>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
