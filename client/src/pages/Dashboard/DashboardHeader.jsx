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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back. Let&apos;s make today productive.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:flex-none">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-48 lg:w-56 pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-transparent transition-colors duration-300"
          />
        </div>
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-slate-50 dark:ring-zinc-950" />
        </button>
        <button onClick={toggle} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-zinc-800">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{greeting}, {name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{dateStr}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
            {initial}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
