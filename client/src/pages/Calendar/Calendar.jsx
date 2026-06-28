import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ListTodo, AlertCircle, CheckCircle2, Calendar as CalendarIcon, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

function loadTasks() {
  try { const d = localStorage.getItem('flowsync_tasks'); return d ? JSON.parse(d) : [] } catch { return [] }
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Calendar() {
  const [tasks, setTasks] = useState(loadTasks)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => setTasks(loadTasks()), 2000)
    return () => clearInterval(interval)
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date().toISOString().split('T')[0]

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getTasksForDate = (dateStr) => tasks.filter(t => t.dueDate === dateStr)
  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : []

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push(dateStr)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Calendar</h1>
        <button onClick={() => toast.success('Google Calendar sync coming soon!')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
          <CalendarIcon size={16} /> <ExternalLink size={14} /> Sync Google Calendar
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"><ChevronLeft size={20} /></button>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"><ChevronRight size={20} /></button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => <div key={d} className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 py-2">{d}</div>)}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((dateStr, i) => {
              if (!dateStr) return <div key={`e${i}`} />
              const day = parseInt(dateStr.split('-')[2])
              const dayTasks = getTasksForDate(dateStr)
              const isToday = dateStr === today
              const isSelected = dateStr === selectedDate
              return (
                <button key={dateStr} onClick={() => setSelectedDate(dateStr)} className={`relative p-2 min-h-[60px] rounded-xl text-sm transition border ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : isToday ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                  <span className={`text-sm font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-400' : isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{day}</span>
                  {dayTasks.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {dayTasks.slice(0, 2).map(t => (
                        <div key={t._id} className={`h-1.5 rounded-full ${t.completed ? 'bg-indigo-300 dark:bg-indigo-700' : t.priority === 'high' ? 'bg-red-400' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-slate-300 dark:bg-zinc-600'}`} />
                      ))}
                      {dayTasks.length > 2 && <span className="text-[9px] text-slate-400">+{dayTasks.length - 2}</span>}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
          </h3>
          {!selectedDate ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Click a date to view tasks</p>
          ) : selectedTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              <ListTodo size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks for this day</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map(t => (
                <div key={t._id} className={`p-3 rounded-xl border ${t.completed ? 'border-slate-100 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800' : t.priority === 'high' ? 'border-red-200 dark:border-red-900/50' : 'border-slate-200 dark:border-zinc-800'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {t.completed ? <CheckCircle2 size={14} className="text-indigo-500" /> : <AlertCircle size={14} className={t.priority === 'high' ? 'text-red-500' : 'text-amber-500'} />}
                    <span className={`text-sm font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${t.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : t.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>{t.priority}</span>
                    {!t.completed && t.dueDate < today && <span className="text-[10px] text-red-500 font-medium">Overdue</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calendar
