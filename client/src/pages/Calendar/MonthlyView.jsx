import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Monthly calendar grid with task indicators per day
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function MonthlyView({ tasks, onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date().toISOString().split('T')[0]

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getTasksForDate = (dateStr) => tasks.filter(t => {
    const d = t.deadline ? (typeof t.deadline === 'string' ? t.deadline.split('T')[0] : new Date(t.deadline).toISOString().split('T')[0]) : ''
    return d === dateStr
  })

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push(dateStr)
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{MONTHS[month]} {year}</h2>
        <button onClick={nextMonth} className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((dateStr, i) => {
          if (!dateStr) return <div key={`e${i}`} />
          const day = parseInt(dateStr.split('-')[2])
          const dayTasks = getTasksForDate(dateStr)
          const isToday = dateStr === today
          const overloaded = dayTasks.length > 3

          return (
            <button key={dateStr} onClick={() => onDateClick(dateStr)} className={`relative p-1.5 sm:p-2 min-h-[48px] sm:min-h-[64px] rounded-lg sm:rounded-xl text-sm transition border ${isToday ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
              <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{day}</span>
              {dayTasks.length > 0 && (
                <div className="mt-1 sm:mt-1.5 flex gap-0.5">
                  {dayTasks.slice(0, 3).map(t => (
                    <div key={t._id} className={`w-1.5 h-1.5 rounded-full ${t.status === 'done' ? 'bg-indigo-300 dark:bg-indigo-700' : t.priority === 'high' ? 'bg-red-400' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-slate-300 dark:bg-zinc-600'}`} />
                  ))}
                  {overloaded && <span className="text-[9px] text-slate-400 ml-0.5">+{dayTasks.length - 3}</span>}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthlyView
