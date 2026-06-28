import { Edit2, Trash2, Clock } from 'lucide-react'

const priorityConfig = {
  high: { color: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' },
  medium: { color: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
  low: { color: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
}

function EventCard({ task, onEdit, onDelete }) {
  const cfg = priorityConfig[task.priority] || priorityConfig.low

  return (
    <div className="group flex items-start gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:shadow-sm transition-shadow duration-300">
      <div className={`w-0.5 h-8 rounded-full flex-shrink-0 mt-0.5 ${cfg.bar}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{task.title}</span>
          <span className={`text-[10px] font-medium ${cfg.color}`}>{task.priority}</span>
        </div>
        {task.dueDate && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
            <Clock size={10} /> {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={() => onEdit?.(task)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors duration-300">
          <Edit2 size={12} />
        </button>
        <button onClick={() => onDelete?.(task._id)} className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

export default EventCard
