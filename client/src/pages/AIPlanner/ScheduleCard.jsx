import { Clock, Coffee } from 'lucide-react'

function ScheduleCard({ schedule }) {
  const isOverloaded = schedule.filter(s => !s.task.includes('Break')).length > 4

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Clock size={15} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Schedule</h2>
        </div>
        {isOverloaded && (
          <span className="text-xs font-medium px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
            Heavy Day
          </span>
        )}
      </div>

      <div className="relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-700">
        {schedule.map((item, i) => {
          const isBreak = item.task.includes('Break')
          return (
            <div key={i} className="relative pb-4 last:pb-0">
              <div className={`absolute -left-[18px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 ${isBreak ? 'bg-slate-100 dark:bg-zinc-800' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
                {isBreak ? <Coffee size={10} className="text-slate-400" /> : <Clock size={10} className="text-indigo-600 dark:text-indigo-400" />}
              </div>
              <div className="ml-3 flex items-start justify-between">
                <div>
                  <span className={`text-xs font-medium ${isBreak ? 'text-slate-400 dark:text-slate-500' : 'text-indigo-600 dark:text-indigo-400'}`}>{item.time}</span>
                  <p className={`text-sm font-medium mt-0.5 ${isBreak ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>{item.task}</p>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-3 mt-1">{item.duration}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ScheduleCard
