import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Flame, TrendingUp, Target, ListTodo } from 'lucide-react'
import { getTasks } from '../../services/taskService'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function UserStats() {
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, focusMinutes: 0, focusSessions: 0, streak: 0 })
  const [weekData, setWeekData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTasks()
        const tasks = Array.isArray(data) ? data : []
        const total = tasks.length
        const completed = tasks.filter(t => t.status === 'done').length
        const inProgress = tasks.filter(t => t.status === 'in-progress').length
        const focusMinutes = parseInt(localStorage.getItem('flowsync_focus_minutes') || '0')
        const focusSessions = parseInt(localStorage.getItem('flowsync_focus_sessions') || '0')
        const habits = JSON.parse(localStorage.getItem('flowsync_habits') || '[]')
        const streak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0)
        setStats({ total, completed, inProgress, focusMinutes, focusSessions, streak })

        const wd = weekDays.map((_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (6 - i))
          const dateStr = d.toISOString().split('T')[0]
          const dayTasks = tasks.filter(t => {
            const deadline = t.deadline ? new Date(t.deadline).toISOString().split('T')[0] : null
            return deadline === dateStr
          })
          return dayTasks.length > 0 ? Math.round((dayTasks.filter(t => t.status === 'done').length / dayTasks.length) * 100) : -1
        })
        setWeekData(wd)
      } catch { setWeekData(weekDays.map(() => -1)) }
      finally { setLoading(false) }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
  const maxVal = Math.max(...weekData.filter(v => v >= 0), 100)

  const cards = [
    { icon: Target, label: 'Total Tasks', value: stats.total.toString(), color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { icon: CheckCircle, label: 'Completed', value: stats.completed.toString(), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { icon: ListTodo, label: 'In Progress', value: stats.inProgress.toString(), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { icon: Clock, label: 'Focus Hours', value: `${Math.floor(stats.focusMinutes / 60)}h ${stats.focusMinutes % 60}m`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ]

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Statistics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Statistics</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {cards.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:shadow-sm transition-shadow">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-2.5`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp size={14} className="text-slate-400" />
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weekly Completion</span>
          </div>
          <div className="flex items-end gap-1.5 h-20">
            {weekData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-slate-400 font-medium">{val >= 0 ? `${val}%` : '-'}</span>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-md overflow-hidden flex-1 self-end" style={{ height: '100%' }}>
                  {val >= 0 && (
                    <div className={`w-full rounded-md transition-all duration-700 ease-out ${
                      val >= 80 ? 'bg-emerald-500' : val >= 50 ? 'bg-amber-500' : val >= 1 ? 'bg-red-500' : 'bg-transparent'
                    }`} style={{ height: `${(val / maxVal) * 100}%` }} />
                  )}
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">{weekDays[i].charAt(0)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border border-orange-100 dark:border-orange-900/30 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Flame size={24} className="text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.streak}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Best Streak</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{stats.focusSessions} focus sessions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserStats
