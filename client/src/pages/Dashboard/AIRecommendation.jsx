import { useState, useEffect, useCallback, memo } from 'react'
import { Brain, Lightbulb, Coffee, ArrowRight, Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { getTasks } from '../../services/taskService'
import { prioritizeTasks } from '../../services/aiService'

const recVariant = {
  hidden: { opacity: 0, x: -12 },
  show: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.3, delay: i * 0.08 } }),
}

function SkeletonCard() {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-700 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-zinc-700 rounded" />
        <div className="h-3 w-1/2 bg-slate-200 dark:bg-zinc-700 rounded" />
      </div>
    </div>
  )
}

const AIRecommendation = memo(function AIRecommendation() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRecommendations = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)

    try {
      const cached = sessionStorage.getItem('flowsync_ai_cache')
      if (cached && silent) {
        const parsed = JSON.parse(cached)
        if (Date.now() - parsed.timestamp < 300000) {
          setRecommendations(parsed.data)
          setLoading(false)
          return
        }
      }

      const tasks = await getTasks()
      const active = (Array.isArray(tasks) ? tasks : []).filter(t => t.status !== 'done')

      if (active.length === 0) {
        const data = [{ icon: CheckCircle2, title: 'All caught up!', desc: 'No active tasks. Create a new task to get AI suggestions.', priority: 'low', badge: 'Info' }]
        setRecommendations(data)
        sessionStorage.setItem('flowsync_ai_cache', JSON.stringify({ data, timestamp: Date.now() }))
        return
      }

      const res = await prioritizeTasks()
      let data
      if (res && res.rankings && res.rankings.length > 0) {
        data = res.rankings.slice(0, 3).map((r, i) => {
          const task = active.find(t => t._id === r.taskId) || {}
          const risk = (r.riskScore || 0) > 60
          return {
            icon: i === 0 ? Lightbulb : i === 1 ? Coffee : ArrowRight,
            title: task.title || r.title || 'Untitled',
            desc: risk ? 'High risk — nearest deadline or overdue.' : r.reason ? r.reason : `Priority score: ${Math.round(r.priorityScore || 0)}%`,
            priority: risk ? 'high' : i === 0 ? 'medium' : 'low',
            badge: risk ? 'High Priority' : i === 0 ? 'Suggested' : 'Optional',
          }
        })
      } else {
        const overdue = active.filter(t => t.deadline && new Date(t.deadline) < new Date())
        data = [
          { icon: Lightbulb, title: overdue.length > 0 ? `${overdue.length} overdue tasks` : 'Review your tasks', desc: overdue.length > 0 ? 'Focus on clearing overdue items first.' : 'You have active tasks to review.', priority: 'medium', badge: 'Active' },
        ]
      }
      setRecommendations(data)
      sessionStorage.setItem('flowsync_ai_cache', JSON.stringify({ data, timestamp: Date.now() }))
    } catch {
      setError('Could not fetch recommendations. Check connection.')
      const cached = sessionStorage.getItem('flowsync_ai_cache')
      if (cached) {
        try { setRecommendations(JSON.parse(cached).data) } catch {}
      } else {
        setRecommendations([{ icon: AlertCircle, title: 'AI unavailable', desc: 'Could not fetch recommendations. Check connection.', priority: 'low', badge: 'Offline' }])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRecommendations() }, [fetchRecommendations])

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Brain size={15} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Productivity Coach</h2>
        </div>
        <button
          onClick={() => fetchRecommendations(false)}
          disabled={loading}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition disabled:opacity-50"
          title="Refresh recommendations"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error && recommendations.length === 0 ? (
        <div className="text-center py-6">
          <AlertCircle size={32} className="mx-auto mb-3 text-red-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{error}</p>
          <button onClick={() => fetchRecommendations(false)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map(({ icon: Icon, title, desc, priority, badge }, i) => (
            <motion.div
              key={title + i}
              variants={recVariant}
              initial="hidden"
              animate="show"
              custom={i}
              className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' : priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'
              }`}>
                <Icon size={16} className={
                  priority === 'high' ? 'text-red-600 dark:text-red-400' : priority === 'medium' ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'
                } />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  }`}>{badge}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
})

export default AIRecommendation
