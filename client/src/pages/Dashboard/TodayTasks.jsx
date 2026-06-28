import { useState, useEffect } from 'react'
import { CheckSquare, Square, Trash2, ListTodo, Clock } from 'lucide-react'
import PriorityBadge from '../../components/ui/PriorityBadge'

function loadTasks() {
  try { const d = localStorage.getItem('flowsync_tasks'); return d ? JSON.parse(d) : [] } catch { return [] }
}
function saveTasks(t) { localStorage.setItem('flowsync_tasks', JSON.stringify(t)) }

function TodayTasks() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const update = () => {
      const all = loadTasks()
      const today = new Date().toISOString().split('T')[0]
      setTasks(all.filter(t => t.dueDate === today))
    }
    update()
    const interval = setInterval(update, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleComplete = (id) => {
    setTasks(prev => {
      const next = prev.map(t => t._id === id ? { ...t, completed: !t.completed } : t)
      const all = loadTasks().map(t => t._id === id ? { ...t, completed: !t.completed } : t)
      saveTasks(all)
      return next
    })
  }

  const deleteTask = (id) => {
    setTasks(prev => {
      const next = prev.filter(t => t._id !== id)
      const all = loadTasks().filter(t => t._id !== id)
      saveTasks(all)
      return next
    })
  }

  const remaining = tasks.filter(t => !t.completed).length

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Today's Tasks</h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">{remaining} remaining</span>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-10 text-slate-400 dark:text-slate-500">
          <ListTodo size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">You're all caught up!</p>
          <p className="text-xs mt-1">Create your first task to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task._id} className={`flex items-start gap-3 p-3 rounded-xl border transition ${
              task.completed ? 'bg-slate-50 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700 opacity-60' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-700 hover:border-slate-200 dark:hover:border-zinc-600'
            }`}>
              <button onClick={() => toggleComplete(task._id)} className="mt-0.5 flex-shrink-0">
                {task.completed
                  ? <CheckSquare size={18} className="text-indigo-500" />
                  : <Square size={18} className="text-slate-400 dark:text-slate-500 hover:text-indigo-500 transition" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    {task.title}
                  </p>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {task.description && <span className="truncate max-w-[200px]">{task.description}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => deleteTask(task._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default TodayTasks
