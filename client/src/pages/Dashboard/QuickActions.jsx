import { Plus, Brain, Timer, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const actions = [
  { to: '/tasks', icon: Plus, label: 'Add Task', desc: 'Create a new task' },
  { to: '/ai-planner', icon: Brain, label: 'Generate AI Plan', desc: 'Let AI plan your day' },
  { to: '/focus', icon: Timer, label: 'Start Focus Session', desc: '25 min Pomodoro' },
  { to: '/analytics', icon: BarChart3, label: 'View Analytics', desc: 'Track your progress' },
]

function QuickActions() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map(({ to, icon: Icon, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-sm transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 transition">
              <Icon size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default QuickActions
