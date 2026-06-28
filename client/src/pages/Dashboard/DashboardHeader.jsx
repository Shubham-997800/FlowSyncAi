import { useAuth } from '../../context/AuthContext'

function DashboardHeader() {
  const { user } = useAuth()
  const now = new Date()
  const hour = now.getHours()
  const name = user?.name || 'there'
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{greeting}, {name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{dateStr}</p>
      </div>
    </header>
  )
}

export default DashboardHeader
