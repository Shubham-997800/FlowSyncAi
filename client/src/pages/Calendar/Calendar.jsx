import { useState, useEffect } from 'react'
import { Plus, Brain } from 'lucide-react'
import MonthlyView from './MonthlyView'
import WeeklyView from './WeeklyView'
import DailyView from './DailyView'
import SchedulePreview from './SchedulePreview'
import toast from 'react-hot-toast'

function loadTasks() {
  try { const d = localStorage.getItem('flowsync_tasks'); return d ? JSON.parse(d) : [] } catch { return [] }
}

function Calendar() {
  const [tasks, setTasks] = useState(loadTasks)
  const [view, setView] = useState('monthly')
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDaily, setShowDaily] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setTasks(loadTasks()), 2000)
    return () => clearInterval(interval)
  }, [])

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr)
    setShowDaily(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <button onClick={() => toast.success('New event creation coming soon!')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium transition-colors duration-300">
            <Plus size={16} /> Add Event
          </button>
          <button onClick={() => toast.success('AI schedule optimization running...')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
            <Brain size={16} /> AI Schedule
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`${showDaily || view === 'weekly' ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
          {view === 'monthly' && !showDaily && <MonthlyView tasks={tasks} onDateClick={handleDateClick} />}
          {view === 'weekly' && !showDaily && <WeeklyView tasks={tasks} onDateClick={handleDateClick} />}
          {showDaily && selectedDate && <DailyView tasks={tasks} date={selectedDate} onBack={() => setShowDaily(false)} />}
        </div>
        <div className="lg:col-span-1">
          <SchedulePreview tasks={tasks} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  )
}

export default Calendar
