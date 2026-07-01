import { useState, useEffect } from 'react'
import { Plus, Trash2, Search, X, AlertCircle, CheckCircle2, Clock, Flag, Target, Calendar as CalIcon, Brain, Loader2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { getTasks, createTask, updateTask, deleteTask } from '../../services/taskService'
import { getGoals, createGoal, updateGoal as updateGoalApi, deleteGoal as deleteGoalApi } from '../../services/goalService'
import { suggestTask } from '../../services/aiService'

const priorityConfig = {
  high: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', label: 'High' },
  medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Medium' },
  low: { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30', label: 'Low' },
}

const PRIORITIES = ['low', 'medium', 'high']

function TaskForm({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [deadline, setDeadline] = useState(task?.deadline ? task.deadline.split('T')[0] : '')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error('Task title is required')
    onSave({ title: title.trim(), description: description.trim(), priority, deadline: deadline || null })
  }

  const handleAiSuggest = async () => {
    if (!title.trim()) return toast.error('Enter a task title first')
    setAiLoading(true)
    setAiSuggestion(null)
    try {
      const res = await suggestTask(title.trim())
      setAiSuggestion(res)
      if (res.suggestedPriority) setPriority(res.suggestedPriority)
    } catch {
      toast.error('AI suggest failed')
    } finally { setAiLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-zinc-800" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <div className="flex gap-2">
              <input value={title} onChange={e => { setTitle(e.target.value); setAiSuggestion(null) }} placeholder="Enter task title" className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" autoFocus />
              <button type="button" onClick={handleAiSuggest} disabled={aiLoading} className="px-3 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition disabled:opacity-50 flex items-center gap-1.5 text-sm font-medium">
                {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                AI
              </button>
            </div>
          </div>
          {aiSuggestion && (
            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-3 border border-indigo-200 dark:border-indigo-900/30 space-y-1.5">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><Brain size={12} /> AI Suggestion</p>
              {aiSuggestion.suggestedPriority && <p className="text-xs text-slate-600 dark:text-slate-400">Priority: <span className="font-medium text-slate-800 dark:text-slate-200">{aiSuggestion.suggestedPriority}</span></p>}
              {aiSuggestion.suggestedEstimatedTime && <p className="text-xs text-slate-600 dark:text-slate-400">Estimated: <span className="font-medium text-slate-800 dark:text-slate-200">{aiSuggestion.suggestedEstimatedTime} min</span></p>}
              {aiSuggestion.suggestedTags?.length > 0 && <p className="text-xs text-slate-600 dark:text-slate-400">Tags: <span className="font-medium text-slate-800 dark:text-slate-200">{aiSuggestion.suggestedTags.join(', ')}</span></p>}
              {aiSuggestion.reason && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">{aiSuggestion.reason}</p>}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <div className="flex gap-1.5">
                {PRIORITIES.map(p => (
                  <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${priority === p ? `${priorityConfig[p].bg} ${priorityConfig[p].color} border-indigo-300 dark:border-indigo-700` : 'border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">{task ? 'Update Task' : 'Create Task'}</button>
        </form>
      </div>
    </div>
  )
}

function GoalForm({ goal, onSave, onClose }) {
  const [title, setTitle] = useState(goal?.title || '')
  const [description, setDescription] = useState(goal?.description || '')
  const [status, setStatus] = useState(goal?.status || 'active')
  const [targetDate, setTargetDate] = useState(goal?.targetDate ? goal.targetDate.split('T')[0] : '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error('Goal title is required')
    await onSave({ title: title.trim(), description: description.trim(), status, targetDate, progress: goal?.progress || 0 })
    toast.success(goal ? 'Goal updated' : 'Goal created')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-zinc-800" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{goal ? 'Edit Goal' : 'New Goal'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter goal title" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                {['active', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
              <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">{goal ? 'Update Goal' : 'Create Goal'}</button>
        </form>
      </div>
    </div>
  )
}

function TaskAndGoals() {
  const [tab, setTab] = useState('tasks')
  const [tasks, setTasks] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchTasks = async () => {
    try {
      const data = await getTasks()
      setTasks(data)
    } catch {
      toast.error('Failed to load tasks')
    }
  }

  const fetchGoals = async () => {
    try {
      const data = await getGoals()
      setGoals(Array.isArray(data) ? data : [])
    } catch { /* ignore */ }
  }

  useEffect(() => {
    (async () => {
      setLoading(true)
      await Promise.all([fetchTasks(), fetchGoals()])
      setLoading(false)
    })()
  }, [])

  const addTask = async (data) => {
    try {
      const created = await createTask(data)
      setTasks(prev => [created, ...prev])
      toast.success('Task created')
      setShowForm(false)
    } catch {
      toast.error('Failed to create task')
    }
  }

  const handleUpdateTask = async (id, data) => {
    try {
      const updated = await updateTask(id, data)
      setTasks(prev => prev.map(t => t._id === id ? updated : t))
      toast.success('Task updated')
      setShowForm(false)
      setEditing(null)
    } catch {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t._id !== id))
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t._id === id)
    if (!task) return
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    try {
      const updated = await updateTask(id, { status: newStatus })
      setTasks(prev => prev.map(t => t._id === id ? updated : t))
    } catch {
      toast.error('Failed to update task')
    }
  }

  const addGoal = async (data) => {
    try {
      await createGoal(data)
      await fetchGoals()
    } catch {
      toast.error('Failed to create goal')
    }
  }

  const updateGoal = async (id, data) => {
    try {
      await updateGoalApi(id, data)
      await fetchGoals()
    } catch {
      toast.error('Failed to update goal')
    }
  }

  const deleteGoal = async (id) => {
    try {
      await deleteGoalApi(id)
      await fetchGoals()
      toast.success('Goal deleted')
    } catch {
      toast.error('Failed to delete goal')
    }
  }

  const updateProgress = async (id, progress) => {
    try {
      await updateGoalApi(id, { progress: Math.min(100, Math.max(0, progress)) })
      await fetchGoals()
    } catch {
      toast.error('Failed to update progress')
    }
  }

  const filtered = tasks
    .filter(t => filter === 'all' ? true : filter === 'active' ? t.status !== 'done' : t.status === 'done')
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()))

  const todayStr = new Date().toISOString().split('T')[0]
  const todayCount = tasks.filter(t => { if (!t.deadline) return false; const d = typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]; return d === todayStr && t.status !== 'done' }).length
  const overdueCount = tasks.filter(t => { if (!t.deadline || t.status === 'done') return false; const d = typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]; return d < todayStr }).length

  const getStatusStyle = (status) => {
    if (status === 'completed') return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
    if (status === 'cancelled') return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' }
    return { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Tasks & Goals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {loading ? 'Loading...' : tab === 'tasks' ? (
              <>
                {todayCount > 0 && <span className="text-indigo-600 dark:text-indigo-400 font-medium">{todayCount} due today</span>}
                {todayCount > 0 && overdueCount > 0 && <span> &middot; </span>}
                {overdueCount > 0 && <span className="text-red-600 dark:text-red-400 font-medium">{overdueCount} overdue</span>}
              </>
            ) : 'Track your long-term and short-term objectives'}
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-sm">
          <Plus size={18} /> Add {tab === 'tasks' ? 'Task' : 'Goal'}
        </button>
      </div>

      <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl w-fit mb-6">
        {[
          { key: 'tasks', label: 'Tasks', icon: CheckCircle2 },
          { key: 'goals', label: 'Goals', icon: Target },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => { setTab(key); setSearch(''); setFilter('all') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${tab === key ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {showForm && tab === 'tasks' && (
        <TaskForm task={editing} onSave={editing ? (data) => handleUpdateTask(editing._id, data) : addTask} onClose={() => { setShowForm(false); setEditing(null) }} />
      )}
      {showForm && tab === 'goals' && (
        <GoalForm goal={editing} onSave={editing ? (data) => updateGoal(editing._id, data) : addGoal} onClose={() => { setShowForm(false); setEditing(null) }} />
      )}

      {tab === 'tasks' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
            </div>
            <div className="flex gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
              {[
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'completed', label: 'Completed' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === key ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>{label}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400"><Clock size={32} className="mx-auto mb-3 animate-spin" /><p>Loading tasks...</p></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400 dark:text-slate-500">
              <CheckCircle2 size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400">{search ? 'No tasks match your search' : tasks.length === 0 ? 'No tasks yet. Create your first task!' : 'All tasks completed!'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(task => {
                const cfg = priorityConfig[task.priority]
                let dl = task.deadline
                if (dl && typeof dl === 'string') dl = dl.split('T')[0]
                else if (dl) dl = new Date(dl).toISOString().split('T')[0]
                const isOverdue = dl && task.status !== 'done' && dl < todayStr
                return (
                  <div key={task._id} className={`group bg-white dark:bg-zinc-900 rounded-xl px-5 py-4 border transition hover:shadow-sm ${task.status === 'done' ? 'border-slate-100 dark:border-zinc-700 opacity-70' : isOverdue ? 'border-red-200 dark:border-red-900/50' : 'border-slate-200 dark:border-zinc-800'}`}>
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleComplete(task._id)} className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${task.status === 'done' ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-zinc-600 hover:border-indigo-400'}`}>
                        {task.status === 'done' && <CheckCircle2 size={14} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-semibold text-sm ${task.status === 'done' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>{task.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${cfg.bg} ${cfg.color}`}><Flag size={10} /> {cfg.label}</span>
                          {isOverdue && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"><AlertCircle size={10} /> Overdue</span>}
                          {dl && (
                            <span className={`text-[11px] flex items-center gap-1 ${isOverdue ? 'text-red-500 dark:text-red-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                              <Clock size={10} /> {new Date(dl).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{task.description}</p>}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => { setEditing(task); setShowForm(true) }} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </button>
                        <button onClick={() => handleDeleteTask(task._id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {tasks.length > 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 text-center">
              {tasks.filter(t => t.status !== 'done').length} active &middot; {tasks.filter(t => t.status === 'done').length} completed &middot; {tasks.length} total
            </p>
          )}
        </>
      )}

      {tab === 'goals' && (
        <>
          {loading ? (
            <div className="text-center py-20 text-slate-400"><Clock size={32} className="mx-auto mb-3 animate-spin" /><p>Loading goals...</p></div>
          ) : goals.length === 0 ? (
            <div className="text-center py-20 text-slate-400 dark:text-slate-500">
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400">No goals yet. Set your first goal!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {goals.map(goal => {
                const ss = getStatusStyle(goal.status)
                const daysLeft = goal.targetDate ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)) : null
                const isOverdue = daysLeft !== null && daysLeft < 0
                return (
                  <div key={goal._id} className="group bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 hover:shadow-sm transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${ss.bg} ${ss.color}`}><Target size={12} /> {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}</span>
                        {isOverdue && <span className="text-xs text-red-500 dark:text-red-400 font-medium">Overdue</span>}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => { setEditing(goal); setShowForm(true) }} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </button>
                        <button onClick={() => deleteGoal(goal._id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{goal.title}</h3>
                    {goal.description && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{goal.description}</p>}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-10 text-right">{goal.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                        {daysLeft !== null && (
                          <span className="flex items-center gap-1"><CalIcon size={12} />{isOverdue ? `${Math.abs(daysLeft)} days ago` : `${daysLeft} days left`}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[0, 25, 50, 75, 100].map(pct => (
                          <button key={pct} onClick={() => updateProgress(goal._id, pct)} className={`w-6 h-6 rounded-md text-[10px] font-medium border transition ${goal.progress >= pct ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-200 dark:border-zinc-700 text-slate-400 dark:text-slate-500 hover:border-indigo-300'}`}>{pct === 0 ? '0' : pct < 100 ? `${pct}` : '100'}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TaskAndGoals
