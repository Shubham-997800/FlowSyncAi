import { useState, memo } from 'react'
import { CheckSquare, Square, Trash2, ListTodo, Clock, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PriorityBadge from '../../components/ui/PriorityBadge'

// Displays today's incomplete tasks sorted by priority/deadline
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
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => { if (!t.deadline) return false; return getDateStr(t.deadline) === today })
  const remaining = todayTasks.filter(t => t.status !== 'done')
  const completed = todayTasks.filter(t => t.status === 'done')
  const [showCompleted, setShowCompleted] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [selected, setSelected] = useState([])

  const allSelected = remaining.length > 0 && selected.length === remaining.length
  const someSelected = selected.length > 0 && !allSelected

  const handleStartEdit = (task) => {
    setEditingId(task._id)
    setEditValue(task.title)
  }

  const handleSaveEdit = (id) => {
    if (editValue.trim() && editValue !== tasks.find(t => t._id === id)?.title) {
      onToggle(id)
    }
    setEditingId(null)
    setEditValue('')
  }

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleAll = () => {
    if (allSelected) { setSelected([]) }
    else { setSelected(remaining.map(t => t._id)) }
  }

  const bulkComplete = () => {
    selected.forEach(id => {
      const task = tasks.find(t => t._id === id)
      if (task && task.status !== 'done') onToggle(id)
    })
    setSelected([])
  }

  if (todayTasks.length === 0) {
    return (
      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Today's Tasks</h2>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-slate-400 dark:text-slate-500">
          <ListTodo size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs mt-1 mb-4">No tasks scheduled for today.</p>
          <button onClick={() => navigate('/tasks')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
            <ListTodo size={14} /> Go to Tasks
          </button>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={toggleAll} className="text-slate-400 hover:text-indigo-500 transition">
            {allSelected ? <CheckSquare size={18} className="text-indigo-500" /> : <Square size={18} />}
          </button>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Today's Tasks</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">{remaining.length} left</span>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button onClick={bulkComplete} className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition">
              Complete {selected.length}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {remaining.map((task, i) => (
          <motion.div
            key={task._id}
            variants={taskVariant}
            initial="hidden"
            animate="show"
            custom={i}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-slate-200 dark:hover:border-zinc-600 transition group"
          >
            <button onClick={() => toggleSelect(task._id)} className="mt-0.5 flex-shrink-0">
              {selected.includes(task._id)
                ? <CheckSquare size={18} className="text-indigo-500" />
                : <Square size={18} className="text-slate-400 dark:text-slate-500 hover:text-indigo-500 transition" />
              }
            </button>
            <button onClick={() => onToggle(task._id)} className="mt-0.5 flex-shrink-0">
              <Square size={18} className="text-slate-400 dark:text-slate-500 hover:text-indigo-500 transition" />
            </button>
            <div className="flex-1 min-w-0">
              {editingId === task._id ? (
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => handleSaveEdit(task._id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveEdit(task._id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="w-full text-sm font-semibold bg-transparent border-b-2 border-indigo-500 text-slate-900 dark:text-slate-100 outline-none py-0.5"
                  autoFocus
                />
              ) : (
                <p
                  onClick={() => handleStartEdit(task)}
                  className="text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  {task.title}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                {task.deadline && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
                <PriorityBadge priority={task.priority} />
                {task.description && <span className="truncate max-w-[120px]">{task.description}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => navigate('/focus')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
                title="Focus on this"
              >
                <Play size={14} />
              </button>
              <button onClick={() => onDelete(task._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {completed.length > 0 && (
        <>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 mt-4 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-700" />
            {showCompleted ? 'Hide' : 'Show'} {completed.length} completed
            <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-700" />
          </button>
          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-2 mt-3"
              >
                {completed.map((task, i) => (
                  <motion.div
                    key={task._id}
                    variants={taskVariant}
                    initial="hidden"
                    animate="show"
                    custom={i}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 opacity-60"
                  >
                    <CheckSquare size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-through text-slate-400 dark:text-slate-500">{task.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 dark:text-slate-500">
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  )
})

export default TodayTasks
