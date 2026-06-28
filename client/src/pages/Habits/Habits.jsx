import { useState, useEffect } from 'react'
import { Plus, X, Flame, CheckCircle2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

function loadHabits() {
  try { const d = localStorage.getItem('flowsync_habits'); return d ? JSON.parse(d) : [] } catch { return [] }
}
function saveHabits(h) { localStorage.setItem('flowsync_habits', JSON.stringify(h)) }

function getWeekDates() {
  const dates = []
  const now = new Date()
  const dayOfWeek = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - dayOfWeek)
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function HabitForm({ habit, onSave, onClose }) {
  const [title, setTitle] = useState(habit?.title || '')
  const [frequency, setFrequency] = useState(habit?.frequency || 'daily')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error('Habit title is required')
    onSave({ title: title.trim(), frequency, createdAt: habit?.createdAt || new Date().toISOString(), streak: habit?.streak || 0, logs: habit?.logs || [], lastLogDate: habit?.lastLogDate || null })
    toast.success(habit ? 'Habit updated' : 'Habit created')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{habit ? 'Edit Habit' : 'New Habit'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Habit Name</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Morning workout" className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
            <div className="flex gap-2">
              {['daily', 'weekly'].map(f => (
                <button key={f} type="button" onClick={() => setFrequency(f)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${frequency === f ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">{habit ? 'Update Habit' : 'Create Habit'}</button>
        </form>
      </div>
    </div>
  )
}

function Habits() {
  const [habits, setHabits] = useState(loadHabits)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => { saveHabits(habits) }, [habits])

  const addHabit = (data) => setHabits(prev => [{ ...data, _id: Date.now().toString() }, ...prev])
  const updateHabit = (id, data) => setHabits(prev => prev.map(h => h._id === id ? { ...h, ...data } : h))
  const deleteHabit = (id) => { setHabits(prev => prev.filter(h => h._id !== id)); toast.success('Habit deleted') }

  const toggleLog = (id) => {
    const today = getToday()
    setHabits(prev => prev.map(h => {
      if (h._id !== id) return h
      const hasLogged = h.logs?.includes(today)
      const logs = hasLogged ? (h.logs || []).filter(d => d !== today) : [...(h.logs || []), today]
      const sortedLogs = logs.sort()
      let streak = 0
      const checkDate = new Date()
      while (true) {
        const d = checkDate.toISOString().split('T')[0]
        if (sortedLogs.includes(d)) { streak++; checkDate.setDate(checkDate.getDate() - 1) }
        else break
      }
      return { ...h, logs: sortedLogs, streak }
    }))
  }

  const today = getToday()
  const weekDates = getWeekDates()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Habits</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {habits.filter(h => h.logs?.includes(today)).length}/{habits.length} habits done today
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm">
          <Plus size={18} /> Add Habit
        </button>
      </div>

      {showForm && <HabitForm habit={editing} onSave={editing ? (data) => updateHabit(editing._id, data) : addHabit} onClose={() => { setShowForm(false); setEditing(null) }} />}

      {habits.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <Flame size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No habits yet. Start building one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map(habit => {
            const isDone = habit.logs?.includes(today)
            return (
              <div key={habit._id} className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border transition ${isDone ? 'border-emerald-200 dark:border-emerald-800' : 'border-gray-200 dark:border-gray-700'} hover:shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleLog(habit._id)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${isDone ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'}`}>
                      <CheckCircle2 size={20} />
                    </button>
                    <div>
                      <h3 className={`font-semibold text-sm ${isDone ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{habit.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{habit.frequency}</span>
                        <span className="flex items-center gap-1 text-xs font-medium text-orange-500">
                          <Flame size={12} /> {habit.streak || 0} day streak
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteHabit(habit._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"><Trash2 size={14} /></button>
                </div>

                <div className="flex gap-1.5">
                  {weekDates.map(date => {
                    const isToday = date === today
                    const logged = habit.logs?.includes(date)
                    const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)
                    return (
                      <div key={date} className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-center transition ${isToday ? 'bg-gray-50 dark:bg-gray-700/50 ring-1 ring-emerald-500' : ''}`}>
                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{dayLabel}</span>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition ${logged ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600'}`}>
                          {logged ? <CheckCircle2 size={12} /> : '-'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Habits
