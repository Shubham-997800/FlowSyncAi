import { ListTodo, CheckCircle, CalendarClock, Timer } from 'lucide-react'

const cards = [
  { label: "Today's Tasks", value: '12', sub: '4 Completed', icon: ListTodo },
  { label: 'Completed Today', value: '8', sub: '66% Completion', icon: CheckCircle },
  { label: 'Upcoming Deadlines', value: '3', sub: 'Next Due Tomorrow', icon: CalendarClock },
  { label: 'Focus Time', value: '3h 45m', sub: "Today's Focus", icon: Timer },
]

function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map(({ label, value, sub, icon: Icon }) => (
        <div key={label} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Icon size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</p>
        </div>
      ))}
    </div>
  )
}

export default DashboardCards
