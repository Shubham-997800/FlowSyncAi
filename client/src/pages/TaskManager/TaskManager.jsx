import { useState, useEffect } from 'react'
import { Plus, Trash2, Search, X, AlertCircle, CheckCircle2, Clock, Flag } from 'lucide-react'
import toast from 'react-hot-toast'

const priorityConfig = {
  high: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', label: 'High' },
  medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Medium' },
  low: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Low' },
}

const PRIORITIES = ['low', 'medium', 'high']

function loadTasks() {
  try {
    const data = localStorage.getItem('flowsync_tasks')
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function saveTasks(tasks) {
  localStorage.setItem('flowsync_tasks', JSON.stringify(tasks))
}

function TaskForm({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [dueDate, setDueDate] = useState(task?.dueDate || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error('Task title is required')
    onSave({ title: title.trim(), description: description.trim(), priority, dueDate, completed: task?.completed || false, createdAt: task?.createdAt || new Date().toISOString() })
    toast.success(task ? 'Task updated' : 'Task created')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter task title" className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <div className="flex gap-1.5">
                {PRIORITIES.map(p => (
                  <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${priority === p ? `${priorityConfig[p].bg} ${priorityConfig[p].color} border-${p === 'high' ? 'red' : p === 'medium' ? 'amber' : 'emerald'}-300` : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" />
            </div>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">{task ? 'Update Task' : 'Create Task'}</button>
        </form>
      </div>
    </div>
  )
}

function TaskManager() {
  const [tasks, setTasks] = useState(loadTasks)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => { saveTasks(tasks) }, [tasks])

  const addTask = (data) => {
    const task = { ...data, _id: Date.now().toString() }
    setTasks(prev => [task, ...prev])
  }

  const updateTask = (id, data) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, ...data } : t))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t._id !== id))
    toast.success('Task deleted')
  }

  const toggleComplete = (id) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, completed: !t.completed } : t))
  }

  const filtered = tasks
    .filter(t => filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()))

  const todayCount = tasks.filter(t => {
    if (!t.dueDate) return false
    const today = new Date().toISOString().split('T')[0]
    return t.dueDate === today && !t.completed
  }).length

  const overdueCount = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false
    return t.dueDate < new Date().toISOString().split('T')[0]
  }).length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Manager</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {todayCount > 0 && <span className="text-emerald-600 dark:text-emerald-400 font-medium">{todayCount} due today</span>}
            {todayCount > 0 && overdueCount > 0 && <span> &middot; </span>}
            {overdueCount > 0 && <span className="text-red-600 dark:text-red-400 font-medium">{overdueCount} overdue</span>}
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm">
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" />
        </div>
        <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Completed' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === key ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>{label}</button>
          ))}
        </div>
      </div>

      {showForm && <TaskForm task={editing} onSave={editing ? (data) => updateTask(editing._id, data) : addTask} onClose={() => { setShowForm(false); setEditing(null) }} />}

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <CheckCircle2 size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">{search ? 'No tasks match your search' : tasks.length === 0 ? 'No tasks yet. Create your first task!' : 'All tasks completed!'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => {
            const cfg = priorityConfig[task.priority]
            const isOverdue = task.dueDate && !task.completed && task.dueDate < new Date().toISOString().split('T')[0]
            return (
              <div key={task._id} className={`group bg-white dark:bg-gray-800 rounded-xl px-5 py-4 border transition hover:shadow-sm ${task.completed ? 'border-gray-100 dark:border-gray-700 opacity-70' : isOverdue ? 'border-red-200 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleComplete(task._id)} className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'}`}>
                    {task.completed && <CheckCircle2 size={14} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold text-sm ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>{task.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${cfg.bg} ${cfg.color}`}>
                        <Flag size={10} /> {cfg.label}
                      </span>
                      {isOverdue && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"><AlertCircle size={10} /> Overdue</span>}
                      {task.dueDate && (task.completed ? (
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1"><Clock size={10} /> {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      ) : (
                        <span className={`text-[11px] flex items-center gap-1 ${isOverdue ? 'text-red-500 dark:text-red-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}><Clock size={10} /> {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      ))}
                    </div>
                    {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{task.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => { setEditing(task); setShowForm(true) }} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button onClick={() => deleteTask(task._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tasks.length > 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
          {tasks.filter(t => !t.completed).length} active &middot; {tasks.filter(t => t.completed).length} completed &middot; {tasks.length} total
        </p>
      )}
    </div>
  )
}

export default TaskManager
