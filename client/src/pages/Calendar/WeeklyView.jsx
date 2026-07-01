import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function getWeekDates(refDate) {
  const start = new Date(refDate)
  start.setDate(start.getDate() - start.getDay())
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function WeeklyView({ tasks, onDateClick }) {
  const [weekStart, setWeekStart] = useState(new Date())

  const dates = getWeekDates(weekStart)
  const today = new Date().toISOString().split('T')[0]

  const prevWeek = () => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d) }
  const nextWeek = () => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d) }

  const getTasksForDate = (dateStr) => tasks.filter(t => t.dueDate === dateStr)

  const getLoadDot = (dateStr) => {
    const count = getTasksForDate(dateStr).filter(t => t.status !== 'done').length
    if (count === 0) return 'bg-emerald-400'
    if (count <= 2) return 'bg-amber-400'
    return 'bg-red-400'
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevWeek} className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">This Week</h2>
        <button onClick={nextWeek} className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {dates.map((dateStr, i) => {
          const isToday = dateStr === today
          const dayNum = parseInt(dateStr.split('-')[2])
          const dayTasks = getTasksForDate(dateStr)

          return (
            <button key={dateStr} onClick={() => onDateClick(dateStr)} className={`flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-xl transition ${isToday ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
              <span className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500">{dayLabels[i]}</span>
              <span className={`text-base sm:text-lg font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'}`}>{dayNum}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${getLoadDot(dateStr)}`} />
              {dayTasks.length > 0 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{dayTasks.length} tasks</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WeeklyView
