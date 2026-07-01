import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Flame, TrendingUp, Target } from 'lucide-react'
import { getTasks } from '../../services/taskService'
import toast from 'react-hot-toast'

function UserStats() {
  const [stats, setStats] = useState({ total: 0, completed: 0, focusMinutes: 0, focusSessions: 0, streak: 0 })
  const [weekData, setWeekData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTasks()
        const tasks = Array.isArray(data) ? data : []
        const total = tasks.length
        const completed = tasks.filter(t => t.status === 'done').length
        const focusMinutes = parseInt(localStorage.getItem('flowsync_focus_minutes') || '0')
        const focusSessions = parseInt(localStorage.getItem('flowsync_focus_sessions') || '0')
        const habits = JSON.parse(localStorage.getItem('flowsync_habits') || '[]')
        const streak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0)
        setStats({ total, completed, focusMinutes, focusSessions, streak })

        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const wd = weekDays.map((_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (6 - i))
          const dateStr = d.toISOString().split('T')[0]
          const dayTasks = tasks.filter(t => {
            const deadline = t.deadline ? new Date(t.deadline).toISOString().split('T')[0] : null
            return deadline === dateStr
          })
          return dayTasks.length > 0 ? Math.round((dayTasks.filter(t => t.status === 'done').length / dayTasks.length) * 100) : 0
        })
        setWeekData(wd)
      } catch {
        toast.error('Failed to load stats')
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const cards = [
    { icon: Target, label: 'Total Tasks', value: stats.total.toString(), color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { icon: CheckCircle, label: 'Completed', value: stats.completed.toString(), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { icon: Clock, label: 'Focus Hours', value: `${Math.floor(stats.focusMinutes / 60)}h`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { icon: TrendingUp, label: 'Productivity', value: `${completionRate}%`, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  ]

  const maxVal = Math.max(...weekData, 100)

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Statistics</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {cards.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{value}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={13} className="text-slate-400" />
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Weekly Trend</span>
          </div>
          <div className="flex items-end gap-1 h-16">
            {weekData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded overflow-hidden flex-1 self-end" style={{ height: '100%' }}>
                  <div className={`rounded transition-all duration-500 ${val >= 70 ? 'bg-emerald-500' : val >= 40 ? 'bg-amber-500' : val >= 1 ? 'bg-red-500' : 'bg-transparent'}`} style={{ height: `${(val / maxVal) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
          <Flame size={24} className="text-orange-500" />
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{stats.streak}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Best Streak</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserStats
