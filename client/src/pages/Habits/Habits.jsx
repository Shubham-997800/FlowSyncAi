import { motion } from 'framer-motion'
import { Plus, X, Flame, CheckCircle2, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { getHabits, createHabit, updateHabit as updateHabitApi, deleteHabit as deleteHabitApi } from '../../services/habitService'

// Habit tracker with weekly calendar, logging, and streak tracking
function getWeekDates() {
  const dates = []
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay())
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

function getToday() { return new Date().toISOString().split('T')[0] }

function HabitForm({ habit, onSave, onClose }) {
  const [title, setTitle] = useState(habit?.title || '')
  const [frequency, setFrequency] = useState(habit?.frequency || 'daily')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error('Habit title is required')
    await onSave({ title: title.trim(), frequency })
    toast.success(habit ? 'Habit updated' : 'Habit created')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-zinc-800" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{habit ? 'Edit Habit' : 'New Habit'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Habit Name</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Morning workout" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
            <div className="flex gap-2">
              {['daily', 'weekly'].map(f => (
                <button key={f} type="button" onClick={() => setFrequency(f)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${frequency === f ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">{habit ? 'Update Habit' : 'Create Habit'}</button>
        </form>
      </div>
    </div>
  )
}

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

function Habits() {
  const [habits, setHabits] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchHabits = async () => {
    try {
      const data = await getHabits()
      setHabits(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load habits')
    }
  }

  useEffect(() => { fetchHabits() }, [])

  const addHabit = async (data) => {
    await createHabit(data)
    await fetchHabits()
  }

  const updateHabit = async (id, data) => {
    await updateHabitApi(id, data)
    await fetchHabits()
  }

  const deleteHabit = async (id) => {
    await deleteHabitApi(id)
    await fetchHabits()
    toast.success('Habit deleted')
  }

  const toggleLog = async (id) => {
    const today = getToday()
    const h = habits.find(x => x._id === id)
    if (!h) return
    const hasLogged = h.logs?.includes(today)
    const newLogs = hasLogged ? (h.logs || []).filter(d => d !== today) : [...(h.logs || []), today]
    const sortedLogs = newLogs.sort()
    let streak = 0
    const checkDate = new Date()
    while (true) {
      const d = checkDate.toISOString().split('T')[0]
      if (sortedLogs.includes(d)) { streak++; checkDate.setDate(checkDate.getDate() - 1) }
      else break
    }
    setHabits(prev => prev.map(x => x._id === id ? { ...x, logs: sortedLogs, streak } : x))
    try { await updateHabitApi(id, { logs: sortedLogs, streak }) } catch { toast.error('Failed to update habit') }
  }

  const today = getToday()
  const weekDates = getWeekDates()

  return (
    <motion.div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10" variants={containerVariants} initial="hidden" animate="visible">
      <Helmet>
        <title>Habits - FlowSync AI</title>
        <meta name="description" content="Track your daily habits" />
      </Helmet>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Habits</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {habits.filter(h => h.logs?.includes(today)).length}/{habits.length} habits done today
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-sm">
          <Plus size={18} /> Add Habit
        </button>
      </div>

      {showForm && <HabitForm habit={editing} onSave={editing ? (data) => updateHabit(editing._id, data) : addHabit} onClose={() => { setShowForm(false); setEditing(null) }} />}

      {habits.length === 0 ? (
        <div className="text-center py-20 text-slate-400 dark:text-slate-500">
          <Flame size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400">No habits yet. Start building one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map(habit => {
            const isDone = habit.logs?.includes(today)
            return (
              <motion.div key={habit._id} variants={itemVariants} className={`bg-white dark:bg-zinc-900 rounded-2xl p-5 border transition ${isDone ? 'border-indigo-200 dark:border-indigo-800' : 'border-slate-200 dark:border-zinc-800'} hover:shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleLog(habit._id)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${isDone ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}>
                      <CheckCircle2 size={20} />
                    </button>
                    <div>
                      <h3 className={`font-semibold text-sm ${isDone ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>{habit.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400 dark:text-slate-500">{habit.frequency}</span>
                        <span className="flex items-center gap-1 text-xs font-medium text-orange-500"><Flame size={12} /> {habit.streak || 0} day streak</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteHabit(habit._id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"><Trash2 size={14} /></button>
                </div>

                <div className="flex gap-1 sm:gap-1.5">
                  {weekDates.map(date => {
                    const isToday = date === today
                    const logged = habit.logs?.includes(date)
                    const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)
                    return (
                      <div key={date} className={`flex-1 flex flex-col items-center gap-0.5 sm:gap-1 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-center transition ${isToday ? 'bg-slate-50 dark:bg-zinc-800 ring-1 ring-indigo-500' : ''}`}>
                        <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500">{dayLabel}</span>
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex sm:rounded-md items-center justify-center text-[10px] sm:text-xs transition ${logged ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-300 dark:text-slate-600'}`}>
                          {logged ? <CheckCircle2 size={10} className="sm:w-3 sm:h-3" /> : '-'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

export default Habits
