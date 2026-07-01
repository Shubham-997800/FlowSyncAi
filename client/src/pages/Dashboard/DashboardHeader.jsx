import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// Dashboard header with greeting, date, and refresh button
function DashboardHeader({ onRefresh, refreshing, lastSyncTime }) {
  const { user } = useAuth()
  const [now, setNow] = useState(Date.now())
  const [syncText, setSyncText] = useState('')

  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const interval = setInterval(tick, 60000)
    return () => clearInterval(interval)
  }, [])

  const h = new Date(now).getHours()
  const greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'

  useEffect(() => {
    if (!lastSyncTime) { setSyncText(''); return }
    const update = () => {
      const diff = Math.floor((Date.now() - lastSyncTime) / 1000)
      if (diff < 5) setSyncText('Just now')
      else if (diff < 60) setSyncText(`${diff}s ago`)
      else if (diff < 3600) setSyncText(`${Math.floor(diff / 60)}m ago`)
      else setSyncText(`${Math.floor(diff / 3600)}h ago`)
    }
    update()
    const interval = setInterval(update, 5000)
    return () => clearInterval(interval)
  }, [lastSyncTime])

  const dateStr = new Date(now).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const name = user?.name || 'there'

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{greeting}, {name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{dateStr}</p>
        {syncText && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Last updated {syncText}</p>}
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
