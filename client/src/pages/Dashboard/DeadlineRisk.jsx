import { useState, memo } from 'react'
import { AlertTriangle, CheckSquare, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function getDateStr(d) {
  if (!d) return null
  if (typeof d === 'string') return d.split('T')[0]
  return new Date(d).toISOString().split('T')[0]
}

const riskVariant = {
  hidden: { opacity: 0, x: -12 },
  show: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.3, delay: i * 0.08 } }),
}

const DeadlineRisk = memo(function DeadlineRisk({ tasks, onToggle }) {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]
  const [showAll, setShowAll] = useState(false)

  const overdue = tasks.filter(t => { const d = getDateStr(t.deadline); return d && t.status !== 'done' && d < today })
  const dueToday = tasks.filter(t => { const d = getDateStr(t.deadline); return d === today && t.status !== 'done' })

  const atRisk = [...overdue, ...dueToday].map(t => ({
    id: t._id,
    name: t.title,
    remaining: getDateStr(t.deadline) < today ? 'Overdue' : 'Due today',
    progress: getDateStr(t.deadline) < today ? 100 : 65,
    action: getDateStr(t.deadline) < today ? 'Complete ASAP' : 'Focus now',
    isOverdue: getDateStr(t.deadline) < today,
  }))

  const displayRisk = showAll ? atRisk : atRisk.slice(0, 3)
  const hasMore = atRisk.length > 3

  const active = tasks.filter(t => t.deadline && t.status !== 'done').length
  const risk = active > 0 ? Math.round((atRisk.length / active) * 100) : 0

  const riskLevel = risk <= 25 ? 'Low Risk' : risk <= 50 ? 'Moderate Risk' : 'High Risk'
  const riskColor = risk <= 25 ? 'text-indigo-600 dark:text-indigo-400' : risk <= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
  const badgeBg = risk <= 25 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : risk <= 50 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  const barColor = risk <= 25 ? 'bg-indigo-500' : risk <= 50 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Deadline Risk</h2>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <motion.div
              className={`${barColor} h-full rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${risk}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className={`text-sm font-bold ${riskColor}`}>{risk}%</span>
        </div>
      </div>
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 ${badgeBg}`}>
        <AlertTriangle size={12} /> {riskLevel}
      </div>

      {atRisk.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No tasks at risk</motion.p>
      ) : (
        <>
          <div className="space-y-3">
            <AnimatePresence>
              {displayRisk.map(({ id, name, remaining, progress, action, isOverdue }, i) => (
                <motion.div
                  key={id}
                  variants={riskVariant}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, x: 12 }}
                  custom={i}
                  className={`p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border transition ${
                    isOverdue
                      ? 'border-red-200 dark:border-red-900/50 shadow-[0_0_12px_-4px_rgba(239,68,68,0.3)] dark:shadow-[0_0_12px_-4px_rgba(239,68,68,0.15)]'
                      : 'border-slate-100 dark:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{remaining}</span>
                      {onToggle && (
                        <button
                          onClick={() => onToggle(id)}
                          className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
                          title="Mark as done"
                        >
                          <CheckSquare size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-zinc-700 rounded-full">
                    <motion.div
                      className={`h-full rounded-full ${isOverdue ? 'bg-red-500' : 'bg-indigo-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    Suggested: <span className="text-indigo-600 dark:text-indigo-400 font-medium">{action}</span>
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1 mx-auto mt-3 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              {showAll ? 'Show less' : `View all ${atRisk.length} at risk`} <ArrowRight size={12} />
            </button>
          )}
        </>
      )}
    </section>
  )
})

export default DeadlineRisk
