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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <button onClick={() => toast.success('Google Calendar sync coming soon!')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
          <CalendarIcon size={16} /> <ExternalLink size={14} /> Sync Google Calendar
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"><ChevronLeft size={20} /></button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"><ChevronRight size={20} /></button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => <div key={d} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-2">{d}</div>)}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((dateStr, i) => {
              if (!dateStr) return <div key={`e${i}`} />
              const day = parseInt(dateStr.split('-')[2])
              const dayTasks = getTasksForDate(dateStr)
              const isToday = dateStr === today
              const isSelected = dateStr === selectedDate
              const overdue = dayTasks.some(t => !t.completed && dateStr < today)

              return (
                <button key={dateStr} onClick={() => setSelectedDate(dateStr)} className={`relative p-2 min-h-[60px] rounded-xl text-sm transition border ${isSelected ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : isToday ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <span className={`text-sm font-medium ${isToday ? 'text-emerald-600 dark:text-emerald-400' : isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>{day}</span>
                  {dayTasks.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {dayTasks.slice(0, 2).map(t => (
                        <div key={t._id} className={`h-1.5 rounded-full ${t.completed ? 'bg-emerald-300 dark:bg-emerald-700' : t.priority === 'high' ? 'bg-red-400' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      ))}
                      {dayTasks.length > 2 && <span className="text-[9px] text-gray-400">+{dayTasks.length - 2}</span>}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
          </h3>
          {!selectedDate ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Click a date to view tasks</p>
          ) : selectedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <ListTodo size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks for this day</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map(t => (
                <div key={t._id} className={`p-3 rounded-xl border ${t.completed ? 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50' : t.priority === 'high' ? 'border-red-200 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-700'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {t.completed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className={t.priority === 'high' ? 'text-red-500' : 'text-amber-500'} />}
                    <span className={`text-sm font-medium ${t.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${t.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : t.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>{t.priority}</span>
                    {!t.completed && dateStr < today && <span className="text-[10px] text-red-500 font-medium">Overdue</span>}
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
