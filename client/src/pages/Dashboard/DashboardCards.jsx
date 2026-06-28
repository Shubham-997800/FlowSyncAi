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
        <div
          key={label}
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Icon size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
        </div>
      ))}
    </div>
  )
}

export default DashboardCards
