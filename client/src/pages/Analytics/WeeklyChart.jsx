import { BarChart3 } from 'lucide-react'

// Stacked bar chart of completed vs pending tasks per day
function WeeklyChart({ tasks }) {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekData = weekDays.map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const dayTasks = tasks.filter(t => {
      const d = t.deadline ? (typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]) : ''
      return d === dateStr
    })
    const completed = dayTasks.filter(t => t.status === 'done').length
    return { total: dayTasks.length, completed, pending: dayTasks.length - completed }
  })
  const maxTasks = Math.max(...weekData.map(d => d.total), 1)

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <BarChart3 size={15} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Weekly Breakdown</h2>
      </div>

      <div className="flex items-end gap-2 h-40">
        {weekData.map((d, i) => {
          const completedH = (d.completed / maxTasks) * 100
          const pendingH = (d.pending / maxTasks) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-1 self-end flex flex-col-reverse" style={{ height: '100%' }}>
                <div className="bg-indigo-500 rounded-t transition-all duration-500" style={{ height: `${completedH}%` }} />
                {d.pending > 0 && <div className="bg-slate-300 dark:bg-zinc-600 rounded-t transition-all duration-500" style={{ height: `${pendingH}%` }} />}
              </div>
              <div className="flex gap-1 text-[9px]">
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">{d.completed}</span>
                <span className="text-slate-400 dark:text-slate-500">/</span>
                <span className="text-slate-400 dark:text-slate-500">{d.total}</span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{weekDays[i].charAt(0)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WeeklyChart
