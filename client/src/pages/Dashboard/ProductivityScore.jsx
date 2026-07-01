import { useEffect, useState, memo } from 'react'
import { motion } from 'framer-motion'

function getDateStr(d) {
  if (!d) return null
  if (typeof d === 'string') return d.split('T')[0]
  return new Date(d).toISOString().split('T')[0]
}

const ProductivityScore = memo(function ProductivityScore({ tasks }) {
  const [animateScore, setAnimateScore] = useState(0)
  const completed = tasks.filter(t => t.status === 'done').length
  const pending = tasks.filter(t => t.status !== 'done').length
  const total = tasks.length
  const score = total > 0 ? Math.round((completed / total) * 100) : 0

  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const weeklyData = dayNames.map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const dayTasks = tasks.filter(t => {
      const ts = t.status === 'done' ? getDateStr(t.updatedAt) : getDateStr(t.createdAt)
      return ts === dateStr
    })
    return dayTasks.length > 0 ? Math.round((dayTasks.filter(t => t.status === 'done').length / dayTasks.length) * 100) : 0
  })

  useEffect(() => {
    const timer = setTimeout(() => setAnimateScore(score), 200)
    return () => clearTimeout(timer)
  }, [score])

  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animateScore / 100) * circumference
  const getLabel = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Needs Work' : 'Start Tracking'

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Productivity Score</h2>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r={radius} fill="none" className="stroke-slate-200 dark:stroke-zinc-700" strokeWidth="8" />
            <motion.circle
              cx="55" cy="55" r={radius} fill="none"
              className="stroke-indigo-500" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{animateScore}%</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{getLabel(animateScore)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400">Completed <strong className="text-slate-900 dark:text-slate-100">{completed}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-zinc-700" />
            <span className="text-slate-500 dark:text-slate-400">Pending <strong className="text-slate-900 dark:text-slate-100">{pending}</strong></span>
          </div>
        </div>
        <div className="mt-5 w-full">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Weekly Trend</p>
          <div className="flex items-end gap-1.5 h-12">
            {weeklyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded bg-indigo-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / 100) * 48}px` }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
                />
                <span className="text-[9px] text-slate-500 dark:text-slate-400">{dayNames[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

export default ProductivityScore
