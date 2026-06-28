import { useState, useEffect } from 'react'
import { Plus, X, Target, Calendar, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getGoals, createGoal, updateGoal as updateGoalApi, deleteGoal as deleteGoalApi } from '../../services/goalService'

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

function Goals() {
  const [goals, setGoals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchGoals = async () => {
    try {
      const data = await getGoals()
      setGoals(Array.isArray(data) ? data : [])
    } catch { /* ignore */ }
  }

  useEffect(() => { fetchGoals() }, [])

  const addGoal = async (data) => {
    await createGoal(data)
    await fetchGoals()
  }

  const updateGoal = async (id, data) => {
    await updateGoalApi(id, data)
    await fetchGoals()
  }

  const deleteGoal = async (id) => {
    await deleteGoalApi(id)
    await fetchGoals()
    toast.success('Goal deleted')
  }

  const updateProgress = async (id, progress) => {
    await updateGoalApi(id, { progress: Math.min(100, Math.max(0, progress)) })
    await fetchGoals()
  }

  const getStatusStyle = (status) => {
    if (status === 'completed') return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
    if (status === 'cancelled') return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' }
    return { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Goals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your long-term and short-term objectives</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-sm">
          <Plus size={18} /> Add Goal
        </button>
      </div>

      {showForm && <GoalForm goal={editing} onSave={editing ? (data) => updateGoal(editing._id, data) : addGoal} onClose={() => { setShowForm(false); setEditing(null) }} />}

      {goals.length === 0 ? (
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
              <div key={goal._id} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 hover:shadow-sm transition">
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
                      <span className="flex items-center gap-1"><Calendar size={12} />{isOverdue ? `${Math.abs(daysLeft)} days ago` : `${daysLeft} days left`}</span>
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
    </div>
  )
}

export default Goals
