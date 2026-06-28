import { Brain, Clock, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react'

function SchedulePreview({ tasks, selectedDate }) {
  const today = new Date().toISOString().split('T')[0]
  const dateStr = selectedDate || today
  const dayTasks = tasks.filter(t => t.dueDate === dateStr)
  const completed = dayTasks.filter(t => t.completed).length
  const overdue = dayTasks.filter(t => !t.completed && dateStr < today)
  const loadPercent = dayTasks.length > 0 ? Math.min(100, Math.round((dayTasks.length / 6) * 100)) : 0

  const displayDate = new Date(dateStr + 'T12:00:00')
  const dateLabel = displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  const suggestions = []
  if (loadPercent > 80) suggestions.push('Your day is heavily loaded. Consider moving low priority tasks.')
  if (overdue.length > 0) suggestions.push(`${overdue.length} overdue task${overdue.length > 1 ? 's' : ''} need immediate attention.`)
  if (loadPercent < 40 && dayTasks.length > 0) suggestions.push('You have free slots. Perfect for deep work or catching up.')
  if (dayTasks.length === 0) suggestions.push('No tasks scheduled. Use AI Planner to build your day.')

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Brain size={15} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Preview</h2>
      </div>

      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">{dateLabel}</div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${loadPercent > 80 ? 'bg-red-500' : loadPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${loadPercent}%` }} />
        </div>
        <span className={`text-xs font-bold ${loadPercent > 80 ? 'text-red-600 dark:text-red-400' : loadPercent > 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{loadPercent}%</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 text-center">
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{dayTasks.length}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Tasks</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 text-center">
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completed}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Done</p>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Suggestions</p>
          {suggestions.map((s, i) => (
            <div key={i} className="flex gap-2 p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
              <Lightbulb size={14} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-300">{s}</p>
            </div>
          ))}
        </div>
      )}

      {dayTasks.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Tasks</p>
          <div className="space-y-1.5">
            {dayTasks.slice(0, 4).map(t => (
              <div key={t._id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800">
                {t.completed ? <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" /> : <Clock size={12} className="text-slate-400 flex-shrink-0" />}
                <span className={`text-xs ${t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>{t.title}</span>
              </div>
            ))}
            {dayTasks.length > 4 && <p className="text-[10px] text-slate-400 text-center">+{dayTasks.length - 4} more tasks</p>}
          </div>
        </div>
      )}

      {overdue.length > 0 && (
        <div className="mt-4 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
          <span className="text-xs text-red-700 dark:text-red-300">{overdue.length} overdue task{overdue.length > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}

export default SchedulePreview
