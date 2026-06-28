import { Target, Clock, Brain } from 'lucide-react'

const priorityConfig = {
  high: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', label: 'High' },
  medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Medium' },
  low: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Low' },
}

function CurrentTask({ task }) {
  if (!task) return null

  const cfg = priorityConfig[task.priority] || priorityConfig.low

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5 w-full max-w-md mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Target size={15} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Current Task</h3>
      </div>

      <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">{task.title}</p>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label} Priority</span>
        {task.dueDate && (
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock size={12} /> Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      <div className="mt-3 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl flex items-start gap-2">
        <Brain size={14} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-700 dark:text-indigo-300">
          Focus on <strong>{task.title}</strong> first due to {task.priority === 'high' ? 'high risk and approaching deadline' : task.priority === 'medium' ? 'medium priority level' : 'building momentum with easy tasks'}.
        </p>
      </div>
    </div>
  )
}

export default CurrentTask
