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
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to} className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 hover:border-indigo-600 dark:hover:border-indigo-500 hover:shadow-sm transition group">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition">
              <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default QuickActions
