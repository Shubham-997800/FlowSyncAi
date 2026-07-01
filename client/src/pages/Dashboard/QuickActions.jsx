import { Plus, Brain, Timer, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const actions = [
  { to: '/tasks', icon: Plus, label: 'Add Task', desc: 'Create a new task', key: '⌘1' },
  { to: '/ai-planner', icon: Brain, label: 'Generate AI Plan', desc: 'Let AI plan your day', key: '⌘2' },
  { to: '/focus', icon: Timer, label: 'Start Focus Session', desc: '25 min Pomodoro', key: '⌘3' },
  { to: '/analytics', icon: BarChart3, label: 'View Analytics', desc: 'Track your progress', key: '⌘4' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

function QuickActions() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {actions.map(({ to, icon: Icon, label, desc, key }) => (
          <motion.div key={to} variants={itemVariants}>
            <Link
              to={to}
              className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 hover:border-indigo-600 dark:hover:border-indigo-500 hover:shadow-sm transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition">
                <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{key}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default QuickActions
