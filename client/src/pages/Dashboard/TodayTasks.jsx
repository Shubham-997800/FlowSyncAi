import { useState } from 'react'
import { CheckSquare, Square, Edit2, Trash2, Clock, ListTodo } from 'lucide-react'

const sampleTasks = [
  { id: 1, name: 'UI Design', priority: 'high', deadline: 'Today, 5 PM', time: '3h', progress: 75, category: 'Design', completed: false },
  { id: 2, name: 'API Integration', priority: 'medium', deadline: 'Today, 8 PM', time: '2h', progress: 40, category: 'Dev', completed: false },
  { id: 3, name: 'Presentation', priority: 'low', deadline: 'Tomorrow', time: '1h', progress: 20, category: 'Work', completed: false },
]

const priorityConfig = {
  high: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', label: 'High' },
  medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Medium' },
  low: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Low' },
}

function TodayTasks() {
  const [tasks, setTasks] = useState(sampleTasks)

  const toggleComplete = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  const remaining = tasks.filter(t => !t.completed).length

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Tasks</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{remaining} remaining</span>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <ListTodo size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">You're all caught up!</p>
          <p className="text-xs mt-1">Create your first task to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => {
            const p = priorityConfig[task.priority]
            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                  task.completed
                    ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-60'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                }`}
              >
                <button onClick={() => toggleComplete(task.id)} className="mt-0.5 flex-shrink-0">
                  {task.completed
                    ? <CheckSquare size={18} className="text-emerald-500" />
                    : <Square size={18} className="text-gray-400 dark:text-gray-500 hover:text-emerald-500 transition" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                      {task.name}
                    </p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${p.bg} ${p.color}`}>{p.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={11} /> {task.deadline}</span>
                    <span>{task.time}</span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{task.category}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${task.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{task.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default TodayTasks
