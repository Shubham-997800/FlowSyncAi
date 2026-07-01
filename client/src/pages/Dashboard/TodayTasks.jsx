import { memo } from 'react'
import { CheckSquare, Square, Trash2, ListTodo, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import PriorityBadge from '../../components/ui/PriorityBadge'

function getDateStr(d) {
  if (!d) return null
  if (typeof d === 'string') return d.split('T')[0]
  return new Date(d).toISOString().split('T')[0]
}

const taskVariant = {
  hidden: { opacity: 0, x: -12 },
  show: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.3, delay: i * 0.05 } }),
}

const TodayTasks = memo(function TodayTasks({ tasks, onToggle, onDelete }) {
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => { if (!t.deadline) return false; return getDateStr(t.deadline) === today })
  const remaining = todayTasks.filter(t => t.status !== 'done').length

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Today's Tasks</h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">{remaining} remaining</span>
      </div>
      {todayTasks.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-slate-400 dark:text-slate-500">
          <ListTodo size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs mt-1">No tasks scheduled for today.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {todayTasks.map((task, i) => (
            <motion.div
              key={task._id}
              variants={taskVariant}
              initial="hidden"
              animate="show"
              custom={i}
              className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                task.status === 'done' ? 'bg-slate-50 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700 opacity-60' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-700 hover:border-slate-200 dark:hover:border-zinc-600'
              }`}
            >
              <button onClick={() => onToggle(task._id)} className="mt-0.5 flex-shrink-0">
                {task.status === 'done'
                  ? <CheckSquare size={18} className="text-indigo-500" />
                  : <Square size={18} className="text-slate-400 dark:text-slate-500 hover:text-indigo-500 transition" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-semibold ${task.status === 'done' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    {task.title}
                  </p>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {task.deadline && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {task.description && <span className="truncate max-w-[200px]">{task.description}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => onDelete(task._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
})

export default TodayTasks
