import { RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function DashboardHeader({ onRefresh, refreshing }) {
  const { user } = useAuth()
  const now = new Date()
  const hour = now.getHours()
  const name = user?.name || 'there'
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{greeting}, {name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{dateStr}</p>
      </div>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-50 transition-all"
      >
        <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    </header>
  )
}

export default DashboardHeader
