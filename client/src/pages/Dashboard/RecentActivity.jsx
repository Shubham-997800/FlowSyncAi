import { CheckCircle, Brain, Timer, Plus, Clock, ArrowRight } from 'lucide-react'

const activities = [
  { icon: CheckCircle, text: 'UI Design task completed', time: '2 min ago', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { icon: Brain, text: 'AI generated daily schedule', time: '15 min ago', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { icon: Timer, text: 'Focus session completed (25 min)', time: '1h ago', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { icon: Plus, text: 'New task "API Integration" added', time: '2h ago', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: Clock, text: 'Deadline reminder: Q4 Report due', time: '3h ago', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
]

function RecentActivity() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        <a href="#" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
          View All <ArrowRight size={14} />
        </a>
      </div>
      <div className="relative pl-6 before:absolute before:left-2.5 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
        {activities.map(({ icon: Icon, text, time, color, bg }, i) => (
          <div key={i} className="relative pb-5 last:pb-0">
            <div className={`absolute -left-[18px] w-5 h-5 rounded-full ${bg} flex items-center justify-center ring-2 ring-white dark:ring-gray-800`}>
              <Icon size={10} className={color} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{text}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecentActivity
