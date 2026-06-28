import { Calendar } from 'lucide-react'

function getDayColor(count, max) {
  if (count === 0) return 'bg-slate-100 dark:bg-zinc-800'
  const ratio = count / max
  if (ratio > 0.7) return 'bg-indigo-500'
  if (ratio > 0.4) return 'bg-indigo-400'
  if (ratio > 0.15) return 'bg-indigo-300 dark:bg-indigo-700'
  return 'bg-indigo-200 dark:bg-indigo-800'
}

function MonthlyChart({ tasks }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dayData = []
  let maxCount = 0
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const count = tasks.filter(t => t.dueDate === dateStr).length
    maxCount = Math.max(maxCount, count)
    dayData.push({ day: d, count, dateStr })
  }

  const completedTotal = tasks.filter(t => t.completed).length
  const pendingTotal = tasks.filter(t => !t.completed).length
  const completionRate = tasks.length > 0 ? Math.round((completedTotal / tasks.length) * 100) : 0

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Calendar size={15} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Monthly Overview</h2>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {dayData.map(({ day, count, dateStr }) => (
          <div key={dateStr} className={`w-full aspect-square rounded-lg ${getDayColor(count, maxCount)} flex items-center justify-center`}>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">{day}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-500" /> Active</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-300 dark:bg-indigo-700" /> Light</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-100 dark:bg-zinc-800" /> Inactive</span>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800">
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{completedTotal}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Completed</p>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800">
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{pendingTotal}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Pending</p>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800">
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{completionRate}%</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Rate</p>
        </div>
      </div>
    </div>
  )
}

export default MonthlyChart
