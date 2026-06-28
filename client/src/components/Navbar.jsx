import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, ListTodo, Brain, Calendar, Clock, Target,
  BarChart3, Bell, Settings, LogOut, Menu, X, Flame,
} from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/ai-planner', label: 'AI Planner', icon: Brain },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/focus', label: 'Focus', icon: Clock },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">FlowSync AI</Link>

          {user ? (
            <>
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = location.pathname === link.to
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  )
                })}
                <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <button onClick={logout} className="text-gray-500 hover:text-red-600 transition" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              </div>

              <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Register</Link>
            </div>
          )}
        </div>

        {mobileOpen && user && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              )
            })}
            <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-sm font-medium">
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
