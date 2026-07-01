import { useState, useEffect } from 'react'
import { Brain, Clock, AlertTriangle, CheckCircle, Lightbulb, Loader2, Zap } from 'lucide-react'
import { getTasks } from '../../services/taskService'
import { prioritizeTasks } from '../../services/aiService'

function SchedulePreview({ tasks, selectedDate }) {
  const [aiRankings, setAiRankings] = useState([])
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const dateStr = selectedDate || today
  const dayTasks = tasks.filter(t => t.dueDate === dateStr)
  const completed = dayTasks.filter(t => t.status === 'done').length
  const overdue = dayTasks.filter(t => t.status !== 'done' && dateStr < today)
  const loadPercent = dayTasks.length > 0 ? Math.min(100, Math.round((dayTasks.length / 6) * 100)) : 0

  const displayDate = new Date(dateStr + 'T12:00:00')
  const dateLabel = displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  useEffect(() => {
    if (dayTasks.length === 0) return
    setLoading(true)
    prioritizeTasks()
      .then(res => {
        if (res?.rankings) setAiRankings(res.rankings)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [dateStr])

  const suggestions = []
  if (loadPercent > 80) suggestions.push('Your day is heavily loaded. Consider moving low priority tasks.')
  if (overdue.length > 0) suggestions.push(`${overdue.length} overdue task${overdue.length > 1 ? 's' : ''} need immediate attention.`)
  if (loadPercent < 40 && dayTasks.length > 0) suggestions.push('You have free slots. Perfect for deep work or catching up.')
  if (dayTasks.length === 0) suggestions.push('No tasks scheduled. Use AI Planner to build your day.')

  const rankedDayTasks = aiRankings.length > 0
    ? [...dayTasks].sort((a, b) => {
        const ra = aiRankings.find(r => r.taskId === a._id)
        const rb = aiRankings.find(r => r.taskId === b._id)
        return (rb?.priorityScore || 0) - (ra?.priorityScore || 0)
      })
    : dayTasks

  const isFuture = dateStr > today

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
          <p className={`text-xl font-bold ${completed > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>{completed}</p>
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

      {rankedDayTasks.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {isFuture ? 'Planned' : rankedDayTasks.length > 1 && aiRankings.length > 0 ? 'AI Priority Order' : 'Tasks'}
            </p>
            {loading && <Loader2 size={10} className="animate-spin text-slate-400" />}
            {aiRankings.length > 0 && !loading && <Zap size={12} className="text-indigo-400" />}
          </div>
          <div className="space-y-1.5">
            {rankedDayTasks.slice(0, 6).map((t, idx) => {
              const rank = aiRankings.find(r => r.taskId === t._id)
              return (
                <div key={t._id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800">
                  <span className="text-[10px] font-bold text-slate-400 w-4">{idx + 1}.</span>
                  {t.status === 'done' ? <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" /> : <Clock size={12} className="text-slate-400 flex-shrink-0" />}
                  <span className={`text-xs flex-1 ${t.status === 'done' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>{t.title}</span>
                  {rank && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${rank.riskScore > 60 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                      {Math.round(rank.priorityScore || 0)}%
                    </span>
                  )}
                </div>
              )
            })}
            {rankedDayTasks.length > 6 && <p className="text-[10px] text-slate-400 text-center">+{rankedDayTasks.length - 6} more tasks</p>}
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