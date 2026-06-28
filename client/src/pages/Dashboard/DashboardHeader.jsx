import { Search, Bell, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

function DashboardHeader() {
  const { dark, toggle } = useTheme()
  const { user } = useAuth()
  const now = new Date()
  const hour = now.getHours()
  const name = user?.name || 'there'
  const initial = name.charAt(0).toUpperCase()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back. Let&apos;s make today productive.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:flex-none">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-48 lg:w-56 pl-9 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
        </button>
        <button onClick={toggle} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{greeting}, {name} 👋</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{dateStr}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
            {initial}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
