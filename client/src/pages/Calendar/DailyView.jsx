import { ArrowLeft, Clock } from 'lucide-react'
import EventCard from './EventCard'

function DailyView({ tasks, date, onBack, onEdit, onDelete }) {
  const dayTasks = tasks.filter(t => t.dueDate === date)
  const today = new Date().toISOString().split('T')[0]
  const currentHour = new Date().getHours()

  const timeSlots = []
  for (let h = 6; h <= 22; h++) {
    timeSlots.push(`${String(h).padStart(2, '0')}:00`)
  }

  const getTasksForHour = (hour) => {
    const hourNum = parseInt(hour.split(':')[0])
    return dayTasks.filter(t => {
      if (t.title.toLowerCase().includes('focus') || t.title.toLowerCase().includes('meeting')) {
        return hourNum >= 9 && hourNum <= 10
      }
      if (t.priority === 'high') return hourNum >= 8 && hourNum <= 11
      if (t.priority === 'medium') return hourNum >= 12 && hourNum <= 15
      return hourNum >= 14 && hourNum <= 18
    })
  }

  const displayDate = new Date(date + 'T12:00:00')
  const dateLabel = displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-300">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{dateLabel}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{dayTasks.length} tasks scheduled</p>
        </div>
      </div>

      <div className="relative">
        {timeSlots.map((slot) => {
          const hourNum = parseInt(slot.split(':')[0])
          const slotTasks = getTasksForHour(slot)
          const isCurrentHour = date === today && hourNum === currentHour

          return (
            <div key={slot} className="flex gap-3 group">
              <div className="w-14 pt-2 flex-shrink-0">
                <span className={`text-xs font-medium ${isCurrentHour ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>{slot}</span>
              </div>
              <div className={`flex-1 min-h-[40px] border-t ${isCurrentHour ? 'border-indigo-500' : 'border-slate-100 dark:border-zinc-800'} relative`}>
                {isCurrentHour && <div className="absolute left-0 right-0 -top-[1.5px] h-0.5 bg-indigo-500" />}
                <div className="py-1 space-y-1">
                    {slotTasks.map(t => (
                      <EventCard key={t._id} task={t} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {dayTasks.length === 0 && (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <Clock size={36} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">No tasks scheduled for this day</p>
          <p className="text-xs mt-1">Click Add Event to create one</p>
        </div>
      )}
    </div>
  )
}

export default DailyView
