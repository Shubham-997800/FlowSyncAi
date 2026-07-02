import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Brain, Clock, AlertTriangle, BarChart3 } from 'lucide-react'

// Auth page layout (login/register/verify) with feature highlights sidebar
const highlights = {
  login: [
    { icon: Brain, text: 'AI Task Prioritization' },
    { icon: Clock, text: 'Smart Scheduling' },
    { icon: AlertTriangle, text: 'Focus Mode' },
  ],
  register: [
    { icon: Brain, title: 'AI Planning', desc: 'Let AI build your daily schedule' },
    { icon: AlertTriangle, title: 'Deadline Prediction', desc: 'Never miss an important deadline' },
    { icon: BarChart3, title: 'Productivity Insights', desc: 'Track what matters with analytics' },
  ],
  verify: [
    { icon: Brain, text: 'AI Task Prioritization' },
    { icon: Clock, text: 'Smart Scheduling' },
    { icon: AlertTriangle, text: 'Focus Mode' },
  ],
}

function AuthLayout({ mode, title, subtitle, children, footer }) {
  const items = highlights[mode]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="hidden lg:flex flex-col justify-between w-80 xl:w-96 bg-white dark:bg-zinc-900 p-12 border-r border-slate-200 dark:border-zinc-800"
      >
        <div>
          <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">FlowSync AI</Link>
          <div className="mt-12">
            <span className="inline-flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">
              <Sparkles size={12} /> AI Productivity Platform
            </span>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-6 leading-tight">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">{subtitle}</p>
          </div>
          <div className="mt-10 space-y-4">
            {items.map((item) => {
              const Icon = item.icon
              if (mode === 'login') {
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <Icon size={16} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item.text}</span>
                  </div>
                )
              }
              return (
                <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">&copy; 2026 FlowSync AI. All rights reserved.</p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">FlowSync AI</Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
            {children}
          </motion.div>
          {footer && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4"
            >
              {footer}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(AuthLayout)
