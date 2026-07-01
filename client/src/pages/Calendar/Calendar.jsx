import DailyView from './DailyView'
import MonthlyView from './MonthlyView'
import SchedulePreview from './SchedulePreview'
import WeeklyView from './WeeklyView'
import { prioritizeTasks } from '../../services/aiService'
import { getTasks, createTask, updateTask, deleteTask } from '../../services/taskService'
import { motion } from 'framer-motion'
import { Plus, Brain, X, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }
const modalVariants = { hidden: { opacity: 0, scale: 0.9, y: 30 }, visible: { opacity: 1, scale: 1, y: 0 } }

function Calendar() {
  const [tasks, setTasks] = useState([])
  const [view, setView] = useState('monthly')
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDaily, setShowDaily] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', deadline: '' })
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks()
        const mapped = (Array.isArray(data) ? data : []).map(t => ({ ...t, dueDate: t.deadline ? t.deadline.split('T')[0] : '' }))
        setTasks(mapped)
      } catch { /* ignore */ }
    }
    fetchTasks()
    const interval = setInterval(fetchTasks, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr)
    setShowDaily(true)
  }

  const openAddModal = (date) => {
    setEditingTask(null)
    setForm({ title: '', description: '', priority: 'medium', deadline: date || '' })
    setShowAddModal(true)
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setForm({ title: task.title, description: task.description || '', priority: task.priority, deadline: task.deadline ? task.deadline.split('T')[0] : '' })
    setShowAddModal(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      if (editingTask) {
        await updateTask(editingTask._id, form)
        toast.success('Task updated')
      } else {
        await createTask(form)
        toast.success('Task created')
      }
      setShowAddModal(false)
      const data = await getTasks()
      setTasks((Array.isArray(data) ? data : []).map(t => ({ ...t, dueDate: t.deadline ? t.deadline.split('T')[0] : '' })))
    } catch {
      toast.error('Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      toast.success('Task deleted')
      setTasks(prev => prev.filter(t => t._id !== id))
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleAISchedule = async () => {
    setAiLoading(true)
    try {
      const res = await prioritizeTasks()
      if (res && res.rankings) {
        toast.success(`AI prioritized ${res.rankings.length} tasks`)
      } else {
        toast.success('AI optimization complete')
      }
    } catch {
      toast.error('AI scheduling failed')
    } finally { setAiLoading(false) }
  }

  return (
    <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <Helmet>
        <title>Calendar - FlowSync AI</title>
        <meta name="description" content="Plan your work visually" />
      </Helmet>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Calendar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Plan your work visually</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
            {[
              { key: 'monthly', label: 'Monthly' },
              { key: 'weekly', label: 'Weekly' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => { setView(key); setShowDaily(false) }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${view === key && !showDaily ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => openAddModal(selectedDate)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium transition-colors duration-300">
            <Plus size={16} /> Add Event
          </button>
          <button onClick={handleAISchedule} disabled={aiLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300 disabled:opacity-50">
            {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
            {aiLoading ? 'Optimizing...' : 'AI Schedule'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`${showDaily || view === 'weekly' ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
          {view === 'monthly' && !showDaily && <MonthlyView tasks={tasks} onDateClick={handleDateClick} />}
          {view === 'weekly' && !showDaily && <WeeklyView tasks={tasks} onDateClick={handleDateClick} />}
          {showDaily && selectedDate && <DailyView tasks={tasks} date={selectedDate} onBack={() => setShowDaily(false)} onEdit={openEditModal} onDelete={handleDelete} />}
        </div>
        <div className="lg:col-span-1">
          <SchedulePreview tasks={tasks} selectedDate={selectedDate} />
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <motion.div variants={modalVariants} initial="hidden" animate="visible" className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl border border-slate-200 dark:border-zinc-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Task title *" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              <div className="flex gap-3">
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 size={15} className="animate-spin" />}
                {editingTask ? 'Update' : 'Create'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default Calendar
