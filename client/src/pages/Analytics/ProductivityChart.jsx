import { TrendingUp } from 'lucide-react'

function ProductivityChart({ tasks }) {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekData = weekDays.map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const dayTasks = tasks.filter(t => t.dueDate === dateStr)
    const completed = dayTasks.filter(t => t.completed).length
    return dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0
  })
  const maxVal = Math.max(...weekData, 100)

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <TrendingUp size={15} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Productivity Trend</h2>
      </div>

      <div className="flex items-end gap-2 h-40">
        {weekData.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">{val}%</span>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-1 self-end" style={{ height: '100%' }}>
              <div
                className={`rounded-lg transition-all duration-500 self-end ${val >= 70 ? 'bg-emerald-500' : val >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ height: `${(val / maxVal) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">{weekDays[i].charAt(0)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductivityChart
